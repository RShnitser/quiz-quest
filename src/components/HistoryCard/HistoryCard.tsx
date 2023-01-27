import React from "react";
import { Question, QuestionType, Answer } from "../../quiz-api/quiz-api";
import "./HistoryCard.css";

type HistoryCardProps = {
  question: Question;
  answer: Answer;
  date?: string;
};

const HistoryCard = ({ question, answer, date }: HistoryCardProps) => {
  let result = null;

  switch (question.type) {
    case QuestionType.fillInBlank:
      if (answer.type === QuestionType.fillInBlank) {
        result = (
          <React.Fragment>
            {answer.answer !== question.answer ? (
              <>
                <div className="quest-grid">
                  <div className="incorrect">
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <div>{answer.answer}</div>
                </div>
                <div>
                  <span className="quest-bold">{"Correct Answer: "}</span>
                  {question.answer}
                </div>
              </>
            ) : (
              <div className="quest-flex">
                <div className="correct">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>{answer.answer}</div>
              </div>
            )}
          </React.Fragment>
        );
      }
      break;
    case QuestionType.allThatApply:
      if (answer.type === QuestionType.allThatApply) {
        result = (
          <div className="quest-grid">
            {answer.answer.map((option, index) => {
              const questionOption = question.options.find(
                (element) => element.id === option.id
              );
              if (questionOption) {
                let check = <div></div>;
                if (questionOption.answerApplies === option.applies) {
                  check = (
                    <div className="correct">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  );
                } else {
                  check = (
                    <div className="incorrect">
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  );
                }
                return (
                  <React.Fragment key={option.id}>
                    {check}
                    <div className={option.applies ? "quest-bold" : ""}>
                      {questionOption.answer}
                    </div>
                  </React.Fragment>
                );
              }
            })}
          </div>
        );
      }
      break;
    case QuestionType.multipleChoice:
      if (answer.type === QuestionType.multipleChoice) {
        result = (
          <div className="quest-grid">
            {answer.order.map((orderNum) => {
              const questionOption = question.options.find(
                (option) => option.id === orderNum
              );
              if (questionOption) {
                let check = <div></div>;
                if (questionOption.id === answer.answer) {
                  if (answer.answer === 0) {
                    check = (
                      <div className="correct">
                        <i className="fa-solid fa-check"></i>
                      </div>
                    );
                  } else {
                    check = (
                      <div className="incorrect">
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    );
                  }
                }
                if (answer.answer !== 0 && questionOption.id === 0) {
                  check = (
                    <div className="correct">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  );
                }
                return (
                  <React.Fragment key={questionOption.answer}>
                    {check}
                    <div
                      className={
                        questionOption.id === answer.answer ? "quest-bold" : ""
                      }
                    >
                      {questionOption.answer}
                    </div>
                  </React.Fragment>
                );
              }
            })}
          </div>
        );
      }
      break;
    default:
      break;
  }

  return (
    <>
      {result}
      <div className="history-date">{date}</div>
    </>
  );
};

export default HistoryCard;
