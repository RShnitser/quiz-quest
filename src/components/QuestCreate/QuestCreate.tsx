import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import {
  QuestionType,
  QuestionData,
  AnswerInfo,
  QuestionInfo,
  ErrorData,
} from "../../quiz-api/quiz-types";
import InputField from "../InputField/InputField";

const INIT_QUESTION: QuestionData = {
  question: "",
  type: QuestionType.fillInBlank,
  answer: "",
  tags: new Map([
    ["HTML", false],
    ["CSS", false],
    ["Javascript", false],
    ["Git", false],
    ["React", false],
  ]),
};

const QuestCreate = () => {
  const { addQuestion }: QuizContextType = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState<QuestionData>(INIT_QUESTION);
  const [answerCount] = useState<number>(4);

  const buildError = (): ErrorData => {
    const result: ErrorData = {
      success: true,
      error: {},
    };

    if (!questionData.question.length) {
      result.error["question"] = "Enter a question";
      result.success = false;
    }

    switch (questionData.type) {
      case QuestionType.fillInBlank:
        if (!questionData.answer.length) {
          result.error["answer"] = "Enter an answer";
          result.success = false;
        }
        break;

      case QuestionType.multipleChoice:
        for (let i = 0; i < questionData.options.length; i++) {
          const option = questionData.options[i];
          if (option.answer.length === 0) {
            result.error[`option${i}`] = "Enter an answer";
            result.success = false;
          }
        }
        break;

      case QuestionType.allThatApply:
        for (let i = 0; i < questionData.options.length; i++) {
          const option = questionData.options[i];
          if (option.answer.length === 0) {
            result.error[`answer${i}`] = "Enter an answer";
            result.success = false;
          }
        }
        break;
    }

    let isTagsValid = false;
    for (const key of questionData.tags.keys()) {
      const tagChecked = questionData.tags.get(key);
      if (tagChecked) {
        isTagsValid = true;
        break;
      }
    }

    if (!isTagsValid) {
      result.error["tags"] = "Select a tag";
      result.success = false;
    }

    return result;
  };

  const errorData = buildError();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    try {
      if (errorData.success) {
        const answerInfo: AnswerInfo[] = [];
        switch (questionData.type) {
          case QuestionType.fillInBlank:
            answerInfo.push({ answer: questionData.answer });
            break;

          case QuestionType.multipleChoice:
            for (const option of questionData.options) {
              answerInfo.push({
                answer: option.answer,
                answerApplies: option.answerApplies,
              });
            }
            break;

          case QuestionType.allThatApply:
            for (const option of questionData.options) {
              answerInfo.push({
                answer: option.answer,
                answerApplies: option.answerApplies,
              });
            }
            break;
        }

        const tags: string[] = [];
        for (const entry of questionData.tags.entries()) {
          if (entry[1] === true) {
            tags.push(entry[0]);
          }
        }

        const questionInfo: QuestionInfo = {
          question: questionData.question,
          type: questionData.type,
          options: answerInfo,
          tags: tags,
        };

        addQuestion(questionInfo, user.token);
        setQuestionData({
          ...INIT_QUESTION,
          tags: new Map([
            ["HTML", false],
            ["CSS", false],
            ["Javascript", false],
            ["Git", false],
            ["React", false],
          ]),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  let inputs = null;

  switch (questionData.type) {
    case QuestionType.fillInBlank:
      inputs = (
        <>
          <InputField
            label="Answer:"
            type="text"
            name="answer"
            error={errorData.error["answer"] || ""}
            value={questionData.answer}
            onChange={({
              target: { value },
            }: React.ChangeEvent<HTMLInputElement>) => {
              setQuestionData({
                ...questionData,
                answer: value,
              });
            }}
          />
        </>
      );
      break;
    case QuestionType.multipleChoice:
      inputs = [];
      for (let index = 0; index < answerCount; index++) {
        const input = (
          <InputField
            key={`choice${index}`}
            label={index === 0 ? "Answer :" : `Wrong Choice ${index}: `}
            type="text"
            name={index === 0 ? "answer" : `option${index - 1}`}
            error={errorData.error[`option${index}`] || ""}
            onChange={({
              target: { value },
            }: React.ChangeEvent<HTMLInputElement>) => {
              const options = [...questionData.options];
              options[index].answer = value;

              setQuestionData({
                ...questionData,

                options: options,
              });
            }}
          />
        );
        inputs.push(input);
      }
      break;

    case QuestionType.allThatApply:
      inputs = [];
      for (let index = 0; index < answerCount; index++) {
        const input = (
          <React.Fragment key={`answer${index}`}>
            <InputField
              label={`Answer ${index + 1}: `}
              type="text"
              name={`answer${index}`}
              error={errorData.error[`answer${index}`] || ""}
              value={questionData.options[index].answer}
              onChange={({
                target: { value },
              }: React.ChangeEvent<HTMLInputElement>) => {
                const options = [...questionData.options];
                options[index].answer = value;
                setQuestionData({ ...questionData, options: options });
              }}
            />

            <InputField
              label={`Answer ${index + 1} Applies: `}
              type="checkbox"
              name={`answer${index}Applies`}
              error=""
              onChange={() => {
                const options = [...questionData.options];
                options[index].answerApplies = !options[index].answerApplies;
                setQuestionData({ ...questionData, options: options });
              }}
            />
          </React.Fragment>
        );
        inputs.push(input);
      }

      break;
    default:
      break;
  }

  return (
    <div className="center-display">
      <h3 className="title">Add Question</h3>
      {/* <div className="input-error">{errorData.error["page"]}</div> */}
      <form className="form" onSubmit={handleSubmit}>
        <InputField
          label="Question: "
          name="question"
          type="text"
          value={questionData.question}
          error={errorData.error["question"] || ""}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => {
            setQuestionData({ ...questionData, question: value });
          }}
        />
        <label className="input-label" htmlFor="question-type">
          Question Type:
        </label>
        <select
          id="question-type"
          name="type"
          className="form-option"
          value={questionData.type}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLSelectElement>) => {
            switch (value) {
              case QuestionType.fillInBlank:
                const blankData: QuestionData = {
                  question: questionData.question,
                  type: QuestionType.fillInBlank,
                  answer: "",
                  tags: questionData.tags,
                };
                setQuestionData(blankData);
                break;
              case QuestionType.multipleChoice:
                const multipleChoiceOptions = [];
                for (let index = 0; index < answerCount; index++) {
                  multipleChoiceOptions.push({
                    answer: "",
                    answerApplies: index === 0,
                  });
                }
                const choiceData: QuestionData = {
                  question: questionData.question,
                  type: QuestionType.multipleChoice,

                  options: multipleChoiceOptions,
                  tags: questionData.tags,
                };
                setQuestionData(choiceData);
                break;
              case QuestionType.allThatApply:
                const allThatApplyOptions = [];
                for (let index = 0; index < answerCount; index++) {
                  allThatApplyOptions.push({
                    answer: "",
                    answerApplies: false,
                  });
                }
                setQuestionData({
                  question: questionData.question,
                  type: QuestionType.allThatApply,
                  options: allThatApplyOptions,
                  tags: questionData.tags,
                });
                break;
              default:
                break;
            }
          }}
        >
          {Object.values(QuestionType).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {inputs}
        <label className="input-label">Tags:</label>
        <div className="form-grid">
          {Array.from(questionData.tags.keys()).map((tag) => (
            <React.Fragment key={tag}>
              <InputField
                label={tag}
                type="checkbox"
                checked={questionData.tags.get(tag)}
                error=""
                onChange={() => {
                  setQuestionData({
                    ...questionData,
                    tags: new Map<string, boolean>(
                      questionData.tags.set(
                        tag,
                        !questionData.tags.get(tag) || false
                      )
                    ),
                  });
                }}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="input-error">{errorData.error["tags"]}</div>
        <ul className="menu-list">
          <li>
            <input className="form-btn" type="submit" value="Add Question" />
          </li>
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
      </form>
    </div>
  );
};

export default QuestCreate;
