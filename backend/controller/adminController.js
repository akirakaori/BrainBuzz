const QuestionSet = require("../model/QuestionSetModel");

async function createQuestionSetController(req, res) {
  try {
    console.log("🔍 Creating question set...");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const data = req.body;
    const { id, role } = req.user;
    
    console.log("User info:", { id, role });

    const finalData = {
      ...data,
      createdBy: id,
    };

    console.log("Final data to save:", JSON.stringify(finalData, null, 2));

    const createSet = new QuestionSet(finalData);
    const savedQuestionSet = await createSet.save();
    
    console.log("✅ Question set saved successfully:", savedQuestionSet._id);

    res.status(201).json({
      message: "Question Set Created Successfully",
      questionSet: savedQuestionSet,
    });
  } catch (error) {
    console.error("❌ Error creating question set:", error);
    res.status(500).json({
      message: "Failed to create question set",
      error: error.message,
    });
  }
}

module.exports = {
  createQuestionSetController,
};
