import React from "react";
import { Question, QuestionType } from "../../quiz-api/quiz-api";
import {Answer} from "../QuizApp/QuizApp";

type HistoryCardProps = {
    question: Question,
    answer: Answer,
}

const HistoryCard = ({question, answer}: HistoryCardProps) => {

    let result = null;

    switch(question.type) {
        case QuestionType.fillInBlank:
            result = <React.Fragment>
                {answer.answer !== question.answer ?
                <>
                    <div className="quest-grid">
                        <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                        <div>{answer.answer}</div>
                    </div>
                    <div><span className="quest-bold">{"Correct Answer: "}</span>{question.answer}</div>
                </>
                    : <div className="quest-flex">
                        <div className="correct"><i className="fa-solid fa-check"></i></div>
                        <div>{answer.answer}</div>
                    </div>
                }
            </React.Fragment>
        break;
        case QuestionType.allThatApply:
            result = <div className="quest-grid">
                {question.options.map((option, index) => {
                    
                    let check = <div></div>
                    if(option.answerApplies === answer[`answer${index}Applies`]) {
                        check =  <div className="correct"><i className="fa-solid fa-check"></i></div>
                    }
                    else {
                        check =  <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                    }
                    return(
                        <React.Fragment key={option.answer}>
                            {check}
                            <div className={answer[`answer${index}Applies`] ? "quest-bold" : ""}>
                                {option.answer}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        break;
        case QuestionType.multipleChoice:
            result = <div className = "quest-grid">
                {question.options.map((option) => {
                    let check = <div></div>
                    if(option === answer.answer) {
                        if(answer.answer === question.answer) {
                            check = <div className="correct"><i className="fa-solid fa-check"></i></div>;
                        }
                        else {
                            check = <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                        }
                    }
                    if(answer.answer !== question.answer && option === question.answer) {
                        check = <div className="correct"><i className="fa-solid fa-check"></i></div>;
                    }
                    return(
                        <React.Fragment key={option}>
                            {check}
                            <div className={option === answer.answer ? "quest-bold" : ""}>
                                {option}
                            </div>
                        </React.Fragment>
                    );
            })}
            </div>
        break;
        default:
        break;
    }

    return(result);
}

export default HistoryCard;