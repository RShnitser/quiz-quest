import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { Question } from "../quiz-api/quiz-api";

const Quest = () => {

    const {getQuest}: QuizContextType = useQuiz();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Array<Question>>([]);

    useEffect(() => {
        const getQuizQuestions = async () => {

            try {
                const result = await getQuest({count: 0, tags: []});
                if(result) {
    
                    setQuestions(result);
                }
            }
            catch(error) {
                console.error(error);
            }
        }

        getQuizQuestions();

    }, [])

    return(
        <div className="center-display">
            <form className="form">
                {questions.length ? questions.map((question) => (
                    <div>{question.question}</div>
                )):
                <div>No Questions Available</div>}
                <ul className="menu-list">
                    <li>
                        <input className="form-btn" type="submit" value="Submit Answer"/> 
                    </li>
                    <li>
                        <input className="form-btn" type="button" value="Abandon Quest" onClick={() => {navigate("/")}}/>
                    </li>
                </ul>
            </form>
        </div>
    );
}

export default Quest;