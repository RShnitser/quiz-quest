import React from "react";
import {
  AnswerInfo,
  QuestionType,
  UserAnswerInfo,
  UserHistory,
} from "../../quiz-api/quiz-types";
import "./HistoryCard.css";

type HistoryCardProps = {
  historyData: UserHistory;
};

type HistoryDisplayProps = {
  answers: { answer: AnswerInfo; userAnswer: UserAnswerInfo }[];
};

const FillInBlankHistory = ({ answers }: HistoryDisplayProps) => {
  const answer = answers[0].answer;
  const userAnswer = answers[0].userAnswer;

  if (answer.answer === undefined || userAnswer.userAnswer === undefined) {
    return null;
  }
  return (
    <React.Fragment>
      {answer.answer.toLocaleLowerCase() !==
      userAnswer.userAnswer.toLocaleLowerCase() ? (
        <>
          <div className="quest-grid">
            <div className="incorrect">
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div>{userAnswer.userAnswer}</div>
          </div>
          <div>
            <span className="quest-bold">{"Correct Answer: "}</span>
            {answer.answer}
          </div>
        </>
      ) : (
        <div className="quest-flex">
          <div className="correct">
            <i className="fa-solid fa-check"></i>
          </div>
          <div>{userAnswer.userAnswer}</div>
        </div>
      )}
    </React.Fragment>
  );
};

const AllThatApplyHistory = ({ answers }: HistoryDisplayProps) => {
  return (
    <div className="quest-grid">
      {answers.map((option) => {
        let check = <div></div>;
        if (
          option.answer.answerApplies === option.userAnswer.userAnswerApplies &&
          option.answer.answerApplies
        ) {
          check = (
            <div className="correct">
              <i className="fa-solid fa-check"></i>
            </div>
          );
        } else if (
          option.answer.answerApplies !== option.userAnswer.userAnswerApplies &&
          option.answer.answerApplies
        ) {
          check = (
            <div className="incorrect">
              <i className="fa-solid fa-xmark"></i>
            </div>
          );
        }
        return (
          <React.Fragment key={option.userAnswer.answerId}>
            {check}
            <div
              className={
                option.answer.answerApplies ? "quest-bold correct-text" : ""
              }
            >
              {option.answer.answer}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MultipleChoiceHistory = ({ answers }: HistoryDisplayProps) => {
  return (
    <div className="quest-grid">
      {answers.map((option) => {
        let check = <div></div>;
        const correct =
          option.answer.answerApplies === true &&
          option.answer.answerApplies === option.userAnswer.userAnswerApplies;
        const incorrect =
          option.userAnswer.userAnswerApplies === true &&
          option.userAnswer.userAnswerApplies !== option.answer.answerApplies;
        if (correct) {
          check = (
            <div className="correct">
              <i className="fa-solid fa-check"></i>
            </div>
          );
        } else if (incorrect) {
          check = (
            <div className="incorrect">
              <i className="fa-solid fa-xmark"></i>
            </div>
          );
        }

        return (
          <React.Fragment key={option.userAnswer.answerId}>
            {check}
            <div
              className={
                option.answer.answerApplies ? "quest-bold correct-text" : ""
              }
            >
              {option.answer.answer}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const HistoryCard = ({
  historyData: { question, date, answers },
}: HistoryCardProps) => {
  let result = null;

  switch (question.type) {
    case QuestionType.fillInBlank:
      result = <FillInBlankHistory answers={answers} />;
      break;
    case QuestionType.allThatApply:
      result = <AllThatApplyHistory answers={answers} />;
      break;
    case QuestionType.multipleChoice:
      result = <MultipleChoiceHistory answers={answers} />;
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
