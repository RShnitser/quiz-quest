import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import { HistoryData } from "../../quiz-api/quiz-api";
import HistoryCard from "../HistoryCard/HistoryCard";

const QuestHistory = () => {

    const {user, getHistory}: QuizContextType = useQuiz();
    const navigate = useNavigate();

    const [history, setHistory] = useState<Array<HistoryData>>([]);

    useEffect(() => {
        const getHistoryData = async () => {
            try {
                const result = await getHistory(user.id);
                if(result) {
                    setHistory(result);
                }
            }
            catch(error) {
                console.error(error);
            }
        }

        getHistoryData();
    }, []);

    const mapHistoryData = () => {

        const result = history.map((data, index) => {

            const answer = {
                answer: "",
                ...data.history.info
            }

            return(<div className="quest-answer-container" key={`answer${index}`}>
            <div className="title">{data.question.question}</div>
                {/* {result} */}
                <HistoryCard
                    question={data.question}
                    answer={answer}
                />
            </div>
        );
        });

        return result;
    }

    return(
        <React.Fragment>
            {history.length ? 
                mapHistoryData()
                :<div>No History Available</div>}
            <input className="form-btn" type="button" value="Main Menu" onClick={() => {navigate("/")}}/>
        </React.Fragment>
    );
}

export default QuestHistory;