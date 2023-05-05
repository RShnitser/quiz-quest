import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import HistoryCard from "../HistoryCard/HistoryCard";
import { UserHistory } from "../../quiz-api/quiz-types";
import useAuth from "../../providers/AuthProvider";

const QuestHistory = () => {
  const { getHistory }: QuizContextType = useQuiz();
  const navigate = useNavigate();

  const [history, setHistory] = useState<Array<UserHistory>>([]);
  const { user } = useAuth();

  useEffect(() => {
    const getHistoryData = async () => {
      try {
        const result = await getHistory(user.token);
        if (result) {
          setHistory(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getHistoryData();
  }, []);

  const mapHistoryData = () => {
    const result = history.map((data, index) => {
      return (
        <div className="quest-answer-container" key={`answer${index}`}>
          <div className="title">{data.question.question}</div>
          <HistoryCard historyData={data} />
        </div>
      );
    });

    return result;
  };

  return (
    <div className="center-display">
      <h3 className="title">History</h3>
      <div>
        {history.length ? mapHistoryData() : <div>No History Available</div>}
      </div>
      <ul className="menu-list">
        <li>
          <input
            className="form-btn"
            type="button"
            value="Main Menu"
            onClick={() => {
              navigate("/");
            }}
          />
        </li>
      </ul>
    </div>
  );
};

export default QuestHistory;
