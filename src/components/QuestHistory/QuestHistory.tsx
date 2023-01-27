import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import { HistoryData } from "../../quiz-api/quiz-api";
import HistoryCard from "../HistoryCard/HistoryCard";

const QuestHistory = () => {
  const { user, getHistory }: QuizContextType = useQuiz();
  const navigate = useNavigate();

  const [history, setHistory] = useState<Array<HistoryData>>([]);

  useEffect(() => {
    const getHistoryData = async () => {
      try {
        const result = await getHistory(user.id);
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
          {/* {result} */}
          <HistoryCard
            question={data.question}
            answer={data.history.answer}
            date={new Date(data.history.date).toString()}
          />
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
      {/* <input className="form-btn" type="button" value="Main Menu" onClick={() => {navigate("/")}}/> */}
      <ul className="menu-list">
        {/* <li>
                     <input className="form-btn" type="submit" value="Submit Answer"/> 
                 </li> */}
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
