import React from "react";
import { Question, QuestionType, Answer } from "../../quiz-api/quiz-api";
//import {Answer} from "../QuizApp/QuizApp";

type HistoryCardProps = {
    question: Question,
    answer: Answer,
}

const HistoryCard = ({question, answer}: HistoryCardProps) => {

    let result = null;

    switch(question.type) {
        case QuestionType.fillInBlank:
            if(answer.type === QuestionType.fillInBlank) {

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
            }
        break;
        case QuestionType.allThatApply:
            if(answer.type === QuestionType.allThatApply) {
                result = <div className="quest-grid">
                    {answer.answer.map((option, index) => {
                        
                        let check = <div></div>
                        if(question.options[option.id].answerApplies === option.applies) {
                            check =  <div className="correct"><i className="fa-solid fa-check"></i></div>
                        }
                        else {
                            check =  <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                        }
                        return(
                            <React.Fragment key={option.id}>
                                {check}
                                <div className={option.applies ? "quest-bold" : ""}>
                                    {question.options[option.id].answer}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            }
        break;
        case QuestionType.multipleChoice:
            if(answer.type === QuestionType.multipleChoice) {

                result = <div className = "quest-grid">
                    {answer.order.map((index) => {
                        let check = <div></div>
                        if(question.options[index].id === answer.answer) {
                            if(answer.answer === 0) {
                                check = <div className="correct"><i className="fa-solid fa-check"></i></div>;
                            }
                            else {
                                check = <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                            }
                        }
                        if(answer.answer !== 0 && question.options[index].id === 0) {
                            check = <div className="correct"><i className="fa-solid fa-check"></i></div>;
                        }
                        return(
                            <React.Fragment key={question.options[index].answer}>
                                {check}
                                <div className={question.options[index].id === answer.answer ? "quest-bold" : ""}>
                                    {question.options[index].answer}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            }
        break;
        default:
        break;
    }

    return(result);
}

export default HistoryCard;