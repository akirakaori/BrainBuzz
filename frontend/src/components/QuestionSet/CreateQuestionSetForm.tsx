import axios from "axios";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface QuestionSetForm {
  title: string;
  questions: {
    questionText: string;
    choices: { text: string; label: string; correctAnswer: boolean }[];
  }[];
}

function CreateQuestionSetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const defaultValues: QuestionSetForm = {
    title: "",
    questions: [
      {
        questionText: "",
        choices: [],
      },
    ],
  };

  const methods = useForm({ defaultValues });
  const { watch, register, handleSubmit } = methods;
  
  const formData = watch();

  const onSubmitHandler = async (data: QuestionSetForm) => {
    setIsLoading(true);
    setError("");

    // Validation
    if (!data.title.trim()) {
      setError("Quiz title is required");
      setIsLoading(false);
      return;
    }

    if (data.questions.length === 0) {
      setError("At least one question is required");
      setIsLoading(false);
      return;
    }

    // Check if all questions have content and choices
    for (let i = 0; i < data.questions.length; i++) {
      const question = data.questions[i];
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        setIsLoading(false);
        return;
      }
      
      if (question.choices.length < 2) {
        setError(`Question ${i + 1} must have at least 2 choices`);
        setIsLoading(false);
        return;
      }

      const hasCorrectAnswer = question.choices.some(choice => choice.correctAnswer);
      if (!hasCorrectAnswer) {
        setError(`Question ${i + 1} must have at least one correct answer`);
        setIsLoading(false);
        return;
      }
    }

    try {
      console.log("🔍 Submitting quiz data:", JSON.stringify(data, null, 2));
      
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access token exists:", !!accessToken);
      
      const response = await axios.post("/api/admin/questionset/create", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      console.log("✅ Quiz created successfully:", response.data);
      
      // Success - redirect to quiz list
      navigate("/questionset/list");
    } catch (err: any) {
      console.error("❌ Error creating quiz:", err);
      console.error("Error response:", err?.response?.data);
      setError(err?.response?.data?.message || "Failed to create quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1>Create New Quiz</h1>
        <p>Design engaging quizzes to test knowledge and skills</p>
      </div>

      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="form-group">
                <label className="form-label">Quiz Title</label>
                <input 
                  {...register("title")} 
                  className="form-input"
                  placeholder="Enter a descriptive title for your quiz"
                  disabled={isLoading}
                />
              </div>

              <CreateQuestions />

              <div style={{ 
                display: "flex", 
                gap: "var(--spacing-4)", 
                justifyContent: "flex-end",
                paddingTop: "var(--spacing-6)",
                borderTop: "1px solid var(--border-light)",
                marginTop: "var(--spacing-8)"
              }}>
                <button 
                  type="button" 
                  onClick={() => navigate("/questionset/list")}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading"></span>
                      Creating Quiz...
                    </>
                  ) : (
                    "Create Quiz"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Preview Section */}
      {formData.title && (
        <div className="card mt-8" style={{ maxWidth: "800px", margin: "var(--spacing-8) auto 0" }}>
          <div className="card-header">
            <h3>Quiz Preview</h3>
          </div>
          <div className="card-body">
            <h4 style={{ color: "var(--primary-green)" }}>{formData.title}</h4>
            <p style={{ color: "var(--text-secondary)" }}>
              {formData.questions.length} question(s) • 
              {formData.questions.reduce((total, q) => total + q.choices.length, 0)} total choices
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateQuestions() {
  const { register, control } = useFormContext<QuestionSetForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestionHandler = () => {
    append({
      choices: [],
      questionText: "",
    });
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "var(--spacing-6)" 
      }}>
        <h3>Questions</h3>
        <button 
          type="button" 
          onClick={addQuestionHandler}
          className="btn btn-primary btn-sm"
        >
          + Add Question
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="question-form">
          <div className="question-header">
            <h4>Question {index + 1}</h4>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-danger btn-sm"
              >
                Remove Question
              </button>
            )}
          </div>

          <div className="question-body">
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <input
                {...register(`questions.${index}.questionText`)}
                className="form-input"
                placeholder="Enter your question here..."
              />
            </div>

            <CreateChoices questionIndex={index} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { register, control } = useFormContext<QuestionSetForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  const addChoiceHandler = () => {
    const choiceLabel = String.fromCharCode(65 + fields.length); // A, B, C, D...
    append({
      label: choiceLabel,
      text: "",
      correctAnswer: false,
    });
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "var(--spacing-4)" 
      }}>
        <label className="form-label">Answer Choices</label>
        <button 
          type="button" 
          onClick={addChoiceHandler}
          className="btn btn-secondary btn-sm"
        >
          + Add Choice
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="choice-item">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
            <input
              type="checkbox"
              {...register(`questions.${questionIndex}.choices.${index}.correctAnswer`)}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ 
              fontWeight: "600", 
              minWidth: "20px",
              color: "var(--text-secondary)" 
            }}>
              {String.fromCharCode(65 + index)}.
            </span>
            <input
              {...register(`questions.${questionIndex}.choices.${index}.text`)}
              className="form-input"
              placeholder="Enter answer choice..."
              style={{ flex: 1 }}
            />
            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p style={{ 
          color: "var(--text-secondary)", 
          textAlign: "center",
          padding: "var(--spacing-8)",
          border: "2px dashed var(--border-medium)",
          borderRadius: "var(--radius-md)"
        }}>
          Click "Add Choice" to create answer options
        </p>
      )}
    </div>
  );
}

export default CreateQuestionSetForm;
