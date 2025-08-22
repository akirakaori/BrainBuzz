import { useState } from "react";
import type { IAttempQuestionForm } from "../../pages/QuestionSet/AttemptQuizPage";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";

export interface IAttemptQuizFinalData {
  questionSet: string;
  responses: {
    questionId: string;
    selectedChoicesIds: string[];
  }[];
}

interface QuizResult {
  score: number;
  total: number;
}

function AttemptQuizForm({
  questionSet,
}: {
  questionSet: IAttempQuestionForm;
}) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultValues: IAttempQuestionForm = {
    ...questionSet,
  };
  const methods = useForm({ defaultValues });

  const { watch, handleSubmit } = methods;
  const formData = watch();

  const onSubmitHandler = async (data: IAttempQuestionForm) => {
    setIsLoading(true);
    setError("");

    const accessToken = localStorage.getItem("accessToken");

    const finalData: IAttemptQuizFinalData = {
      questionSet: data?._id,
      responses: data?.questions?.map((question) => {
        return {
          questionId: question?._id,
          selectedChoicesIds: question?.choices
            ?.filter((choice) => choice?.selected)
            ?.map((ch) => ch?._id),
        };
      }),
    };

    try {
      const response = await axios.post(
        "/api/questions/answer/attempt", 
        finalData, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      setResult(response.data.data);
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      setError(err?.response?.data?.message || "Failed to submit quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress
  const answeredQuestions = formData.questions?.filter(q => 
    q.choices?.some(c => c.selected)
  ).length || 0;
  const totalQuestions = formData.questions?.length || 0;
  const progressPercent = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  if (result) {
    const scorePercent = result.total > 0 ? (result.score / result.total) * 100 : 0;
    const isGoodScore = scorePercent >= 70;

    return (
      <div className="container">
        <div className="text-center mb-8">
          <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--spacing-4)" }}>
            {isGoodScore ? "🎉" : "📚"}
          </div>
          <h1>{isGoodScore ? "Congratulations!" : "Quiz Complete"}</h1>
          <p>You've finished the quiz. Here are your results:</p>
        </div>

        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="card-body text-center">
            <div className="stat-number" style={{ 
              fontSize: "var(--font-size-4xl)",
              color: isGoodScore ? "var(--primary-green)" : "var(--accent-orange)"
            }}>
              {result.score}/{result.total}
            </div>
            <h3 style={{ margin: "var(--spacing-4) 0" }}>
              Final Score: {scorePercent.toFixed(1)}%
            </h3>
            
            <div className="progress-container" style={{ margin: "var(--spacing-6) 0" }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${scorePercent}%`,
                  background: isGoodScore 
                    ? "linear-gradient(90deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)"
                    : "linear-gradient(90deg, var(--accent-orange) 0%, #D97706 100%)"
                }}
              ></div>
            </div>

            <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-6)" }}>
              {isGoodScore 
                ? "Excellent work! You have a strong understanding of the material."
                : "Good effort! Consider reviewing the material and trying again."
              }
            </p>

            <div style={{ display: "flex", gap: "var(--spacing-4)", justifyContent: "center" }}>
              <Link to="/questionset/list" className="btn btn-primary">
                Back to Quizzes
              </Link>
              <Link to="/" className="btn btn-secondary">
                Home
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="badge badge-info">
            Quiz: {questionSet.title}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1>{questionSet.title}</h1>
        <p>Answer all questions to the best of your ability</p>
        
        {/* Progress Indicator */}
        <div style={{ margin: "var(--spacing-6) 0" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "var(--spacing-2)"
          }}>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>
              Progress: {answeredQuestions}/{totalQuestions} questions
            </span>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: "800px", margin: "0 auto var(--spacing-6)" }}>
          {error}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <QuestionList />

          <div style={{ 
            maxWidth: "800px", 
            margin: "var(--spacing-8) auto 0",
            display: "flex", 
            gap: "var(--spacing-4)", 
            justifyContent: "center"
          }}>
            <Link to="/questionset/list" className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isLoading || answeredQuestions === 0}
            >
              {isLoading ? (
                <>
                  <span className="loading"></span>
                  Submitting...
                </>
              ) : (
                `Submit Quiz (${answeredQuestions}/${totalQuestions})`
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

function QuestionList() {
  const { control } = useFormContext<IAttempQuestionForm>();

  const { fields } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {fields.map((field, index) => (
        <div key={field.id} className="question-form">
          <div className="question-header">
            <h3>Question {index + 1}</h3>
            <span className="badge badge-info">
              {field.choices?.length || 0} choices
            </span>
          </div>

          <div className="question-body">
            <p style={{ 
              fontSize: "var(--font-size-lg)", 
              marginBottom: "var(--spacing-6)",
              lineHeight: "1.6"
            }}>
              {field.questionText}
            </p>

            <AnswerChoices questionIndex={index} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnswerChoices({ questionIndex }: { questionIndex: number }) {
  const { register, control, watch } = useFormContext<IAttempQuestionForm>();

  const { fields } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  const selectedChoices = watch(`questions.${questionIndex}.choices`);

  return (
    <div>
      {fields.map((field, index) => {
        const isSelected = selectedChoices?.[index]?.selected || false;
        
        return (
          <div
            key={field.id}
            className={`choice-item ${isSelected ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              {...register(`questions.${questionIndex}.choices.${index}.selected`)}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ 
              fontWeight: "600", 
              minWidth: "20px",
              color: "var(--text-secondary)" 
            }}>
              {String.fromCharCode(65 + index)}.
            </span>
            <span style={{ flex: 1 }}>
              {field.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default AttemptQuizForm;
