import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { QuestionType, QuestionInfo} from "../quiz-api/quiz-api";
import InputField from "./InputField/InputField";
import { InputError } from "./QuizApp/QuizApp";


const INIT_QUESTION: QuestionInfo = {
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
}

const QuestCreate = () => {

    const {addQuestion} : QuizContextType  = useQuiz();
    const navigate = useNavigate();

    const [questionInfo, setQuestionInfo] = useState<QuestionInfo>(INIT_QUESTION);
    const [answerCount] = useState<number>(4);
    const [error, setError] = useState<InputError>({});
    const [pageError, setPageError] = useState<string>("");

    const isQuestionValid = (): boolean => {
        let result = true;

        setPageError("");
        setError({});

        const newError: InputError = {};

        if(!questionInfo.question.length) {
            newError["question"] = "Enter a question";
            result = false;
        }

        switch(questionInfo.type) {
            case QuestionType.fillInBlank:
                if(!questionInfo.answer.length) {
                    newError["answer"] = "Enter an answer";
                    result = false;
                }
            break;

            case QuestionType.multipleChoice:
                for(let i = 0; i < questionInfo.options.length; i++) {
                    const option = questionInfo.options[i];
                    if(option.length === 0) {
                        newError[`option${i}`] = "Enter an answer";
                    }
                }
            break;

            case QuestionType.allThatApply:
                for(let i = 0; i < questionInfo.options.length; i++) {
                    const option = questionInfo.options[i];
                    if(option.answer.length === 0) {
                        newError[`answer${i}`] = "Enter an answer";
                    }
                }
            break;
        }

        let isTagsValid = false;
        for(const key of questionInfo.tags.keys()) {
            const tagChecked = questionInfo.tags.get(key);
            if(tagChecked) {
                isTagsValid = true;
                break;
            }
        }

        if(!isTagsValid) {
            setPageError("Select a tag");
        }

        if(!result) {
            setError(newError);
        }

        return(result);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        try {
            if(isQuestionValid()) {
                addQuestion(questionInfo);
                setQuestionInfo({
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
        }
        catch(error) {
            console.error(error);
        }
    }

    let inputs = null;

    switch(questionInfo.type) {
        case QuestionType.fillInBlank:
            inputs = <>
                 <InputField
                    label="Answer:"
                    type="text" 
                    name="answer"
                    error={error["answer"] || ""}
                    value={questionInfo.answer} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({ 
                            ...questionInfo,
                            answer: value,   
                        });
                    }}
                 />
            </>
        break;
        case QuestionType.multipleChoice:

            inputs = [];
            for(let index = 0; index < answerCount; index++){
                const input = <InputField
                    key={`choice${index}`}
                    label={index === 0 ? "Answer :" : `Wrong Choice ${index}: `}
                    type="text"
                    name={index === 0 ? "answer" : `option${index - 1}`}
                    error={error[`option${index}`] || ""}
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        const options = [
                            ...questionInfo.options
                        ]
                        options[index] = value;
                        setQuestionInfo({
                            ...questionInfo, 
                            answer: options[0],
                            options: options,
                        });
                    }}
                />
                inputs.push(input);
            }
        break;

        case QuestionType.allThatApply:

            inputs = [];
            for(let index = 0; index < answerCount; index++) {
                const input =  <React.Fragment key={`answer${index}`}>
                    <InputField
                        label={`Answer ${index + 1}: `}
                        type="text"
                        name={`answer${index}`}
                        error={error[`answer${index}`] || ""}
                        value={questionInfo.options[index].answer}
                        onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                            const options = [
                                ...questionInfo.options
                            ]
                            options[index].answer = value;
                            setQuestionInfo({...questionInfo, options: options});
                        }}
                    />

                    <InputField
                            label={`Answer ${index + 1} Applies: `}
                            type="checkbox"
                            name={`answer${index}Applies`}
                            error=""
                            onChange={() => {
                                const options = [
                                    ...questionInfo.options
                                ]
                                options[index].answerApplies = !options[index].answerApplies;
                                setQuestionInfo({...questionInfo, options: options});
                            }}
                    />
                </React.Fragment>
                inputs.push(input);
            }

        break;
        default:
        break;
    }

    return(
        <div className="center-display">
            <h3 className="title">Add Question</h3>
            <div className="input-error">{pageError}</div>
            <form className="form" onSubmit={handleSubmit}>
                <InputField 
                    label="Question: " 
                    name="question" 
                    type="text"
                    value={questionInfo.question}
                    error={error["question"] || ""}
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, question: value});
                    }}
                />
                <label className="input-label" htmlFor="question-type">Question Type:</label>
                <select 
                    id="question-type"
                    name="type"
                    className="form-option"
                    value={questionInfo.type}
                    onChange={({target: {value}}: React.ChangeEvent<HTMLSelectElement>) => {
                      
                        setError({});
                        setPageError("");

                        switch(value) {
                            case QuestionType.fillInBlank:
                                setQuestionInfo({
                                    question: questionInfo.question,
                                    type: value,
                                    answer: "",
                                    tags: questionInfo.tags,
                                });
                            break;
                            case QuestionType.multipleChoice:
                                const multipleChoiceOptions = [];
                                for(let index = 0; index < answerCount; index++) {
                                    multipleChoiceOptions.push("");
                                }
                                setQuestionInfo({
                                    question: questionInfo.question,
                                    type: value,
                                    answer: "",
                                    options: multipleChoiceOptions,
                                    tags: questionInfo.tags,
                                });
                            break;
                            case QuestionType.allThatApply:
                                const allThatApplyOptions = [];
                                for(let index = 0; index < answerCount; index++) {
                                    allThatApplyOptions.push({answer: "", answerApplies: false});
                                }
                                setQuestionInfo({
                                    question: questionInfo.question,
                                    type: value,
                                    options: allThatApplyOptions,
                                    tags: questionInfo.tags,
                                });
                            break;
                            default:
                            break;
                        }
                    }}>
        
                    {Object.values(QuestionType).map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                {inputs}
                <label className="input-label" >Tags:</label>
                <div className="form-grid">
                    { Array.from(questionInfo.tags.keys()).map((tag) => (
                        <React.Fragment key={tag}>
                            <InputField 
                                label={tag}
                                type="checkbox"
                                checked={questionInfo.tags.get(tag)}
                                error=""
                                onChange={() => {
                                    setQuestionInfo({
                                        ...questionInfo, 
                                        tags: new Map<string, boolean>(questionInfo.tags.set(tag, !questionInfo.tags.get(tag) || false))
                                    });
                                    
                                }}

                            />
                        </React.Fragment>
                    ))}
                </div>
                <ul className="menu-list">
                    <li>
                        <input className="form-btn" type="submit" value="Add Question"/> 
                    </li>
                    <li>
                        <input className="form-btn" type="button" value="Main Menu" onClick={() => {navigate("/")}}/>
                    </li>
                </ul>
            </form>
        </div>
    );
}

export default QuestCreate;