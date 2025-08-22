const AnswerModel = require("../model/AnswerModel");
const QuestionSet = require("../model/QuestionSetModel");

async function listQuestionSetController(req, res) {
  const questionSet = await QuestionSet.aggregate([
    {
      $project: {
        title: 1,
        questionCount: { $size: { $ifNull: ["$questions", []] } },
      },
    },
  ]);

  res.json({
    questionSet: questionSet,
  });
}

async function getQuestionSetController(req, res) {
  const { id } = req.params;
  const questionSet = await QuestionSet.findById(id).select(
    "-questions.choices.correctAnswer"
  );

  if (!questionSet) {
    return res.status(404).json({ message: "Question set not found" });
  }

  res.json(questionSet);
}

async function saveAttemptedQuestionController(req, res) {
  try {
    const { questionSet: questionSetId, responses } = req.body;
    const { id: userId } = req.user;

    console.log("🔍 Processing quiz attempt:");
    console.log("Question Set ID:", questionSetId);
    console.log("User responses:", JSON.stringify(responses, null, 2));

    const questionSet = await QuestionSet.findById(questionSetId).select(
      "questions._id questions.choices._id questions.choices.correctAnswer"
    );

    if (!questionSet)
      return res.status(404).json({ message: "QuestionSet not found" });

    console.log("📋 Question set data:", JSON.stringify(questionSet, null, 2));

  const result = (responses || []).reduce(
    (acc, current) => {
      console.log(`\n🔍 Processing question response:`, current);
      
      const questions = Array.isArray(questionSet?.questions)
        ? questionSet.questions
        : Array.isArray(questionSet)
        ? questionSet
        : [];

      // 1) find the question in this set
      const q = questions.find(
        (qn) => String(qn._id) === String(current.questionId)
      );
      if (!q) {
        console.log(`❌ Question not found for ID: ${current.questionId}`);
        return acc; // skip unknown question ids
      }

      console.log(`📝 Found question:`, q);

      // 2) build the list of correct choice ids using reduce
      const correctIds = (q.choices || []).reduce((ids, c) => {
        console.log(`Choice:`, c);
        if (c?.correctAnswer) {
          console.log(`✅ Correct choice found: ${c._id}`);
          ids.push(String(c._id));
        }
        return ids;
      }, []);

      console.log(`🎯 Correct choice IDs:`, correctIds);
      console.log(`👆 User selected:`, current.selectedChoiceIds);

      // 3) count how many SELECTED are actually CORRECT (using find)
      const selected = current.selectedChoiceIds || [];
      const selectedAreCorrectCount = selected.reduce((cnt, selId) => {
        const hit =
          correctIds.find((cid) => cid === String(selId)) !== undefined;
        return cnt + (hit ? 1 : 0);
      }, 0);

      // 4) count how many CORRECT were actually SELECTED (using find)
      const correctSelectedCount = correctIds.reduce((cnt, cid) => {
        const hit =
          selected.find((selId) => String(selId) === cid) !== undefined;
        return cnt + (hit ? 1 : 0);
      }, 0);

      // exact match if:
      //  - every selected is correct, AND
      //  - every correct was selected, AND
      //  - lengths line up on both sides
      const allSelectedAreCorrect = selectedAreCorrectCount === selected.length;
      const allCorrectWereSelected = correctSelectedCount === correctIds.length;
      const isCorrect = allSelectedAreCorrect && allCorrectWereSelected;

      acc.total += 1;
      if (isCorrect) acc.score += 1;

      // optional per-question detail (nice for review UI)
      acc.details.push({
        questionId: String(q._id),
        selectedChoiceIds: selected.map(String),
        isCorrect,
      });

      return acc;
    },
    { score: 0, total: 0, details: [] }
  );

  console.log("📊 Scoring result:", result);

  const saveAnswerQuestion = await new AnswerModel({
    questionSet: questionSetId,
    user: userId,
    responses,
    score: result.score,
    total: result.total,
  });

  await saveAnswerQuestion.save();
  
  console.log("✅ Quiz result saved successfully");
  
  return res.status(201).json({
    message: "Graded",
    data: {
      score: result.score,
      total: result.total,
      responses: result.responses,
      // id: saved?._id,
    },
  });
  } catch (error) {
    console.error("❌ Error processing quiz attempt:", error);
    return res.status(500).json({
      message: "Failed to process quiz attempt",
      error: error.message,
    });
  }
}

module.exports = {
  listQuestionSetController,
  getQuestionSetController,
  saveAttemptedQuestionController,
};
