import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import { Question, QuestionType, Answer } from "../../quiz-api/quiz-api";
import HistoryCard from "../HistoryCard/HistoryCard";
import InputField from "../InputField/InputField";
import { InputError } from "../QuizApp/QuizApp";
import "./Quest.css";

const INIT_ANSWER: Answer = {
  type: QuestionType.fillInBlank,
  answer: "",
};

const Quest = () => {
  const { user, getQuest, settings, addHistory }: QuizContextType = useQuiz();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<Answer>(INIT_ANSWER);
  const [answerArray, setAnswerArray] = useState<Array<Answer>>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [error, setError] = useState<InputError>({});
  const [pageError, setPageError] = useState<string>("");

  useEffect(() => {
    const getQuizQuestions = async () => {
      try {
        const result = await getQuest(settings);
        if (result) {
          setQuestions(result);

          const question = result[0];
          resetAnswer(question);
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
          answer: -1,
          order: [],
        };
        for (const option of question.options) {
          choiceAnswer.order.push(option.id);
        }
        setAnswer(choiceAnswer);
        break;
      default:
        break;
    }
  };

  const isValidAnswer = (): boolean => {
    let result = true;

    setPageError("");
    setError({});

    const newError: InputError = {};

    switch (answer.type) {
      case QuestionType.fillInBlank:
        if (!answer.answer.length) {
          newError["answer"] = "Enter an answer";
          result = false;
        }
        break;
      case QuestionType.multipleChoice:
        if (answer.answer === -1) {
          setPageError("Select an answer");
          result = false;
        }
        break;
      default:
        break;
    }

    if (!result) {
      setError(newError);
    }

    return result;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValidAnswer()) {
      if (questions.length) {
        const question = questions[questionIndex];
        switch (question.type) {
          case QuestionType.fillInBlank:
            if (answer.type === QuestionType.fillInBlank) {
              if (
                question.answer.toLowerCase() === answer.answer.toLowerCase()
              ) {
                setCorrectCount(correctCount + 1);
              }
            }
            break;
          case QuestionType.allThatApply:
            let correct = true;

            if (answer.type === QuestionType.allThatApply) {
              for (const answerIndex in answer.answer) {
                if (
                  question.options[answerIndex].answerApplies !==
                  answer.answer[answerIndex].applies
                ) {
                  correct = false;
                  break;
                }
              }
            }
            if (correct) {
              setCorrectCount(correctCount + 1);
            }
            break;
          case QuestionType.multipleChoice:
            if (answer.type === QuestionType.multipleChoice) {
              if (answer.answer === 0) {
                setCorrectCount(correctCount + 1);
              }
            }
            break;
          default:
            break;
        }

        const newAnswers = [...answerArray];
        newAnswers.push(answer);
        setAnswerArray(newAnswers);

        await addHistory(user.id, question.id, answer);

        if (questionIndex < questions.length - 1) {
          const newQuestionIndex = questionIndex + 1;

          setQuestionIndex(newQuestionIndex);

          const question = questions[newQuestionIndex];
          resetAnswer(question);
        } else {
          setQuizComplete(true);
        }
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
            error={error["answer"] || ""}
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
            {question.options.map((option) => (
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
                    const choiceAnswer: Answer = {
                      type: QuestionType.multipleChoice,
                      answer: parseInt(value),
                      order: [...answer.order],
                    };
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

  return (
    <div className="center-display">
      {!quizComplete ? (
        <form className="form" onSubmit={handleSubmit}>
          {questions.length ? (
            buildAnswerInput(questions[questionIndex])
          ) : (
            <div>No Questions Available</div>
          )}
          <div className="input-error">{pageError}</div>
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
        <div>
          <div className="quest-percentage">{`${(
            (correctCount / questions.length) *
            100
          ).toFixed(2)}%`}</div>
          {answerArray.map((answer, index) => {
            const question = questions[index];

            return (
              <div className="quest-answer-container" key={`answer${index}`}>
                <div className="title">{`Question ${index + 1}: ${
                  question.question
                }`}</div>
                <HistoryCard question={question} answer={answer} />
              </div>
            );
          })}
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
      )}
    </div>
  );
};

export default Quest;
