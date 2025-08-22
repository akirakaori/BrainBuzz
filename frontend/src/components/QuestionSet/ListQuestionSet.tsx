import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IListQuestionSet {
  _id: string;
  title: string;
  questionCount: number;
}

function ListQuestionSet() {
  const [questionSets, setQuestionSet] = useState<IListQuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const response = await axios.get("/api/questions/set/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuestionSet(response?.data?.questionSet || []);
      } catch (error) {
        console.error("Error fetching question sets:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleTakeQuiz = (questionSetId: string) => {
    navigate(`/questionset/${questionSetId}/attempt`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1>Available Quizzes</h1>
        <p>Choose a quiz to test your knowledge and track your progress</p>
      </div>

      {questionSets.length === 0 ? (
        <div className="text-center" style={{ padding: "var(--spacing-16) 0" }}>
          <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--spacing-4)" }}>
            📝
          </div>
          <h2>No Quizzes Available</h2>
          <p style={{ marginBottom: "var(--spacing-6)" }}>
            There are currently no quizzes available. Check back later or contact an administrator.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: "var(--spacing-8)" }}>
            <div className="stat-card">
              <div className="stat-number">{questionSets.length}</div>
              <div className="stat-label">Available Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {questionSets.reduce((total, quiz) => total + quiz.questionCount, 0)}
              </div>
              <div className="stat-label">Total Questions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {Math.round(questionSets.reduce((total, quiz) => total + quiz.questionCount, 0) / questionSets.length)}
              </div>
              <div className="stat-label">Avg. Questions per Quiz</div>
            </div>
          </div>

          <div className="quiz-grid">
            {questionSets.map((questionSet) => (
              <div key={questionSet._id} className="quiz-card">
                <div className="quiz-card-header">
                  <h3 className="quiz-card-title">{questionSet.title}</h3>
                  <div className="quiz-card-meta">
                    <span>📝 {questionSet.questionCount} questions</span>
                  </div>
                </div>
                
                <div className="quiz-card-body">
                  <p style={{ color: "var(--text-secondary)" }}>
                    Test your knowledge with this comprehensive quiz covering various topics.
                  </p>
                  
                  <div style={{ margin: "var(--spacing-4) 0" }}>
                    <div className="badge badge-info">
                      ⏱️ ~{Math.ceil(questionSet.questionCount * 1.5)} mins
                    </div>
                  </div>
                </div>
                
                <div className="quiz-card-footer">
                  <button 
                    onClick={() => handleTakeQuiz(questionSet._id)}
                    className="btn btn-primary w-full"
                  >
                    Start Quiz →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ListQuestionSet;
