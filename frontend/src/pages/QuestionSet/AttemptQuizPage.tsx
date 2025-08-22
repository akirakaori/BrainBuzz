import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AttemptQuizForm from "../../components/QuestionSet/AttemptQuizForm";

export interface IAttempQuestionForm {
  _id: string;
  title: string;
  questions: IQuestion[];
  createdBy: string;
  __v: number;
}

export interface IQuestion {
  questionText: string;
  choices: IChoice[];
  _id: string;
}

export interface IChoice {
  label: string;
  text: string;
  _id: string;
  selected?: boolean;
}

function AttemptQuizPage() {
  const { id } = useParams();

  const [questionSets, setQuestionSet] = useState<IAttempQuestionForm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !id) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      axios
        .get(`/api/questions/set/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setQuestionSet(response?.data);
          setIsLoading(false);
        })
        .catch(() => {
          console.error("Failed to fetch quiz data");
          setIsLoading(false);
        });
    }

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading quiz...</p>
      </div>
    );
  }

  if (!questionSets) {
    return (
      <div className="container">
        <div className="text-center">
          <h2>Quiz Not Found</h2>
          <p>The quiz you're looking for doesn't exist or you don't have permission to access it.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AttemptQuizForm questionSet={questionSets} />
    </div>
  );
}

export default AttemptQuizPage;
