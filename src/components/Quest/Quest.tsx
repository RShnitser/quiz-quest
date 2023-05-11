import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import {
  QuestionType,
  UserAnswerInfo,
  HistoryInfo,
  Question,
  Answer,
  AnswerInfo,
  UserHistory,
  ErrorData,
} from "../../quiz-api/quiz-types";
import HistoryCard from "../HistoryCard/HistoryCard";
import InputField from "../InputField/InputField";
import "./Quest.css";

const INIT_ANSWER: Answer = {
  type: QuestionType.fillInBlank,
  answer: "",
};

const Quest = () => {
  const { user } = useAuth();
  const { getQuest, settings, addHistory }: QuizContextType = useQuiz();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<Answer>(INIT_ANSWER);
  const [answerArray, setAnswerArray] = useState<HistoryInfo[]>([]);

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  useEffect(() => {
    const getQuizQuestions = async () => {
      try {
        if (user.success) {
          const result = await getQuest(settings, user.token);
          if (result) {
            setQuestions(result);

            const question = result[0];
            resetAnswer(question);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getQuizQuestions();
  }, []);

  const resetAnswer = (question: Question) => {
    switch (question.type) {
      case QuestionType.fillInBlank:
        const fillAnswer: Answer = {
          type: QuestionType.fillInBlank,
          answer: "",
        };
        setAnswer(fillAnswer);
        break;
      case QuestionType.allThatApply:
        const applyAnswer: Answer = {
          type: QuestionType.allThatApply,
          answer: [],
        };
        for (const option of question.options) {
          applyAnswer.answer.push({ id: option.id, applies: false });
        }
        setAnswer(applyAnswer);
        break;
      case QuestionType.multipleChoice:
        const choiceAnswer: Answer = {
          type: QuestionType.multipleChoice,
          answer: [],
        };
        for (const option of question.options) {
          choiceAnswer.answer.push({ id: option.id, applies: false });
        }

        setAnswer(choiceAnswer);
        break;
      default:
        break;
    }
  };

  const buildError = (): ErrorData => {
    const result: ErrorData = {
      success: true,
      error: {},
    };

    switch (answer.type) {
      case QuestionType.fillInBlank:
        if (!answer.answer.length) {
          result.error["blank"] = "Enter an answer";
          result.success = false;
        }
        break;
      case QuestionType.multipleChoice:
        if (answer.answer.every((choice) => choice.applies === false)) {
          result.error["choice"] = "Select an answer";
          result.success = false;
        }
        break;
      default:
        break;
    }

    return result;
  };

  const errorData = buildError();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!errorData.success) {
      return;
    }

    if (questions.length < 1) {
      return;
    }

    const question = questions[questionIndex];
    const answerInfo: UserAnswerInfo[] = [];

    if (
      question.type === QuestionType.fillInBlank &&
      answer.type === QuestionType.fillInBlank
    ) {
      if (question.answer.toLowerCase() === answer.answer.toLowerCase()) {
        setCorrectCount(correctCount + 1);
      }

      answerInfo.push({
        answerId: question.answerId,
        userAnswer: answer.answer,
      });
    } else if (
      question.type === QuestionType.allThatApply &&
      answer.type === QuestionType.allThatApply
    ) {
      let applyCorrect = true;
      for (const answerIndex in answer.answer) {
        if (
          question.options[answerIndex].answerApplies !==
          answer.answer[answerIndex].applies
        ) {
          applyCorrect = false;
          break;
        }
      }
      if (applyCorrect) {
        setCorrectCount(correctCount + 1);
      }

      for (let i = 0; i < question.options.length; i++) {
        answerInfo.push({
          answerId: question.options[i].id,
          userAnswerApplies: answer.answer[i].applies,
          order: i,
        });
      }
    } else if (
      question.type === QuestionType.multipleChoice &&
      answer.type === QuestionType.multipleChoice
    ) {
      let correct = true;
      for (const answerIndex in answer.answer) {
        if (
          question.options[answerIndex].answerApplies !==
          answer.answer[answerIndex].applies
        ) {
          correct = false;
          break;
        }
      }
      if (correct) {
        setCorrectCount(correctCount + 1);
      }

      for (let i = 0; i < question.options.length; i++) {
        answerInfo.push({
          answerId: question.options[i].id,
          userAnswerApplies: answer.answer[i].applies,
          order: i,
        });
      }
    }

    const historyInfo: HistoryInfo = {
      questionId: question.id,
      userAnswer: answerInfo,
    };

    const newAnswers = [...answerArray];
    newAnswers.push(historyInfo);
    setAnswerArray(newAnswers);

    if (questionIndex < questions.length - 1) {
      const newQuestionIndex = questionIndex + 1;

      setQuestionIndex(newQuestionIndex);

      const question = questions[newQuestionIndex];
      resetAnswer(question);
    } else {
      setQuizComplete(true);
      if (user.success) {
        await addHistory(answerArray, user.token);
      }
    }
  };

  const buildAnswerInput = (question: Question): React.ReactNode => {
    let input = null;
    switch (question.type) {
      case QuestionType.fillInBlank:
        input = (
          <InputField
            label="Answer:"
            type="text"
            name="answer"
            value={answer.answer as string}
            onChange={({
              target: { value },
            }: React.ChangeEvent<HTMLInputElement>) => {
              setAnswer({
                type: QuestionType.fillInBlank,
                answer: value,
              });
            }}
            error={errorData.error["blank"]}
          />
        );
        break;
      case QuestionType.allThatApply:
        input = (
          <div className="quest-answer-grid">
            {question.options.map((option, index) => (
              <InputField
                key={option.answer}
                label={option.answer}
                type="checkbox"
                name={option.answer}
                checked={
                  (answer.answer as { id: number; applies: boolean }[])[index]
                    .applies
                }
                error=""
                onChange={() => {
                  if (answer.type === QuestionType.allThatApply) {
                    const applyAnswer: Answer = {
                      type: QuestionType.allThatApply,
                      answer: [...answer.answer],
                    };
                    applyAnswer.answer[index].applies =
                      !applyAnswer.answer[index].applies;
                    setAnswer(applyAnswer);
                  }
                }}
              />
            ))}
          </div>
        );

        break;
      case QuestionType.multipleChoice:
        input = (
          <div className="quest-answer-grid">
            {question.options.map((option, index) => (
              <InputField
                key={option.answer}
                label={option.answer}
                type="radio"
                name="answer"
                error=""
                value={option.id.toString()}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLInputElement>) => {
                  if (answer.type === QuestionType.multipleChoice) {
                    const choiceAnswers = [];
                    for (let i = 0; i < question.options.length; i++) {
                      choiceAnswers.push({
                        id: answer.answer[i].id,
                        applies: false,
                      });
                    }
                    const choiceAnswer: Answer = {
                      type: QuestionType.multipleChoice,
                      answer: choiceAnswers,
                    };
                    choiceAnswer.answer[index].applies = true;
                    setAnswer(choiceAnswer);
                  }
                }}
              />
            ))}
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <React.Fragment key={question.id}>
        <h3 className="quest-count">{`Question ${questionIndex + 1} / ${
          questions.length
        }`}</h3>
        <div className="title">{question.question}</div>
        {input}
      </React.Fragment>
    );
  };

  const buildSummary = () => {
    const answerSummary: React.ReactNode[] = [];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      const answers: {
        userAnswer: UserAnswerInfo;
        answer: AnswerInfo;
      }[] = [];

      switch (question.type) {
        case QuestionType.fillInBlank:
          const blankUserAnswer = answerArray[i].userAnswer[0];
          const blankAnswer: AnswerInfo = {
            answer: question.answer,
          };
          answers.push({ userAnswer: blankUserAnswer, answer: blankAnswer });

          break;
        case QuestionType.allThatApply:
          for (let j = 0; j < question.options.length; j++) {
            const applyUserAnswer = answerArray[i].userAnswer[j];

            const applyAnswer: AnswerInfo = {
              answer: question.options[j].answer,
              answerApplies: question.options[j].answerApplies,
            };
            answers.push({
              userAnswer: applyUserAnswer,
              answer: applyAnswer,
            });
          }
          break;
        case QuestionType.multipleChoice:
          for (let j = 0; j < question.options.length; j++) {
            const choiceUserAnswer = answerArray[i].userAnswer[j];

            const choiceAnswer: AnswerInfo = {
              answer: question.options[j].answer,
              answerApplies: question.options[j].answerApplies,
            };
            answers.push({
              userAnswer: choiceUserAnswer,
              answer: choiceAnswer,
            });
          }
          break;
      }

      const historyData: UserHistory = {
        question: {
          id: question.id,
          type: question.type,
          question: question.question,
        },
        date: new Date(Date.now()).toDateString(),
        answers: answers,
      };

      answerSummary.push(
        <div className="quest-answer-container" key={`answer${i}`}>
          <div className="title">{`Question ${i + 1}: ${
            question.question
          }`}</div>

          <HistoryCard historyData={historyData} />
        </div>
      );
    }
    return (
      <div>
        <div className="quest-percentage">{`${(
          (correctCount / questions.length) *
          100
        ).toFixed(2)}%`}</div>
        {answerSummary}
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

  return (
    <div className="center-display">
      {!quizComplete ? (
        <form className="form" onSubmit={handleSubmit}>
          {questions.length ? (
            buildAnswerInput(questions[questionIndex])
          ) : (
            <div>No Questions Available</div>
          )}
          <div className="input-error">{errorData.error["choice"]}</div>
          <ul className="menu-list">
            <li>
              <input className="form-btn" type="submit" value="Submit Answer" />
            </li>
            <li>
              <input
                className="form-btn"
                type="button"
                value="Abandon Quest"
                onClick={() => {
                  navigate("/");
                }}
              />
            </li>
          </ul>
        </form>
      ) : (
        buildSummary()
      )}
    </div>
  );
};

export default Quest;
