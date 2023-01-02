import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { QuestionType, QuestionInfo} from "../quiz-api/quiz-api";
import InputField from "./InputField";


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

    //const [question, setQuestion] = useState<string>("");
    const [questionInfo, setQuestionInfo] = useState<QuestionInfo>(INIT_QUESTION);
    //const [tags, setTags] = useState<Tags>(INIT_TAGS);

    const isQuestionValid = (): boolean => {
        return true;
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
                {/* <label htmlFor="fill-in-blank-answer">Answer:</label>
                 <input 
                    id="fill-in-blank-answer"
                    type="text" 
                    name="answer" 
                    value={questionInfo.answer} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer: value});
                    }}
                 /> */}
                 <InputField
                    label="Answer:"
                    type="text" 
                    name="answer" 
                    value={questionInfo.answer} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer: value});
                    }}
                 />
            </>
        break;
        case QuestionType.multipleChoice:

            const multipleChoiceData = [
                {
                    label: "Answer: ",
                    type: "text", 
                    name: "answer", 
                    value: questionInfo.answer,
                },
                {
                    label: "Wrong Choice 1: ",
                    type: "text", 
                    name: "option1", 
                    value: questionInfo.option1,
                },
                {
                    label: "Wrong Choice 2: ",
                    type: "text", 
                    name: "option2", 
                    value: questionInfo.option2,
                },
                {
                    label: "Wrong Choice 3: ",
                    type: "text", 
                    name: "option3", 
                    value: questionInfo.option3,
                },
            ];
            inputs = <>
                {multipleChoiceData.map((data) => (
                    <InputField
                        key={data.label}
                        {...data}
                        onChange={({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
                            setQuestionInfo({...questionInfo, [name]: value});
                        }}
                    />
                ))}
                {/* <label htmlFor="multiple-choice-answer">Answer:</label>
                <input 
                    id="multiple-choice-answer"
                    type="text" 
                    name="answer" 
                    value={questionInfo.answer} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer: value});
                    }}
                 />
                <label htmlFor="multiple-choice-wrong1">Wrong Choice 1:</label>
                 <input 
                    id="multiple-choice-wrong1"
                    type="text" 
                    name="option1" 
                    value={questionInfo.option1} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, option1: value});
                    }}
                 />
                <label htmlFor="multiple-choice-wrong2">Wrong Choice 2:</label>
                 <input 
                    id="multiple-choice-wrong2"
                    type="text" 
                    name="option2" 
                    value={questionInfo.option2} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, option2: value});
                    }}
                 />
                <label htmlFor="multiple-choice-wrong3">Wrong Choice 3:</label>
                 <input 
                    id="multiple-choice-wrong3"
                    type="text" 
                    name="option3" 
                    value={questionInfo.option3} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, option3: value});
                    }}
                 /> */}
            </>
        break;
        case QuestionType.allThatApply:

            const allThatApplyData = [
                {
                    label: "Answer 1",
                    name: "answer1",
                    value: questionInfo.answer1,
                    applies: questionInfo.answer1Applies,
                },
                {
                    label: "Answer 2",
                    name: "answer2",
                    value: questionInfo.answer2,
                    applies: questionInfo.answer2Applies,
                },
                {
                    label: "Answer 3",
                    name: "answer3",
                    value: questionInfo.answer3,
                    applies: questionInfo.answer3Applies,
                },
                {
                    label: "Answer 4",
                    name: "answer4",
                    value: questionInfo.answer4,
                    applies: questionInfo.answer4Applies,
                },
            ];

            inputs = <>
                {allThatApplyData.map((data) => (
                    <React.Fragment key={data.name}>
                        <InputField
                            label={data.label + ": "}
                            type="text"
                            name={data.name}
                            value={data.value}
                            onChange={({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
                                setQuestionInfo({...questionInfo, [name]: value});
                            }}
                        />
                        <InputField
                            label={data.label + " Apples: "}
                            type="checkbox"
                            name={data.name + "Applies"}
                            //value={data.value}
                            onChange={({target: {name}}: React.ChangeEvent<HTMLInputElement>) => {
                                setQuestionInfo({...questionInfo, [name]: !data.applies});
                            }}
                        />
                    </React.Fragment>
                ))}
                {/* <label htmlFor="all-that-apply-answer1">Answer 1:</label>
                <input 
                    id="all-that-apply-answer1"
                    type="text" 
                    name="answer1" 
                    value={questionInfo.answer1} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer1: value});
                    }}
                 />
                <label htmlFor="all-that-apply-check1">Answer 1 Applies:</label>
                 <input 
                    id="all-that-apply-check1"
                    type="checkbox" 
                    name="answer1Applies" 
                    checked={questionInfo.answer1Applies} 
                    onChange={() => {
                        setQuestionInfo({...questionInfo, answer1Applies: !questionInfo.answer1Applies});
                    }}
                 />
                <label htmlFor="all-that-apply-answer2">Answer 2:</label>
                 <input 
                    id="all-that-apply-answer2"
                    type="text" 
                    name="answer2" 
                    value={questionInfo.answer2} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer2: value});
                    }}
                 />
                <label htmlFor="all-that-apply-check2">Answer 2 Applies:</label>
                 <input 
                    id="all-that-apply-check2"
                    type="checkbox" 
                    name="answer2Applies" 
                    checked={questionInfo.answer2Applies} 
                    onChange={() => {
                        setQuestionInfo({...questionInfo, answer2Applies: !questionInfo.answer2Applies});
                    }}
                 />
                 <label htmlFor="all-that-apply-answer3">Answer 3:</label>
                <input 
                    id="all-that-apply-answer3"
                    type="text" 
                    //name="answer1" 
                    value={questionInfo.answer3} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer3: value});
                    }}
                 />
                <label htmlFor="all-that-apply-check3">Answer 3 Applies:</label>
                 <input 
                    id="all-that-apply-check3"
                    type="checkbox" 
                    //name="answer1Applies" 
                    checked={questionInfo.answer3Applies} 
                    onChange={() => {
                        setQuestionInfo({...questionInfo, answer3Applies: !questionInfo.answer3Applies});
                    }}
                 />
                <label htmlFor="all-that-apply-answer4">Answer 4:</label>
                 <input 
                    id="all-that-apply-answer4"
                    type="text" 
                    //name="answer4" 
                    value={questionInfo.answer2} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, answer4: value});
                    }}
                 />
                <label htmlFor="all-that-apply-check4">Answer 4 Applies:</label>
                 <input 
                    id="all-that-apply-check4"
                    type="checkbox" 
                    //name="answer4Applies" 
                    checked={questionInfo.answer4Applies} 
                    onChange={() => {
                        setQuestionInfo({...questionInfo, answer4Applies: !questionInfo.answer4Applies});
                    }}
                 /> */}
            </>
        break;
        default:
        break;
    }

    return(
        <div className="center-display">
            <h3 className="title">Add Question</h3>
            <form className="form" onSubmit={handleSubmit}>
                {/* <input
                    className="form-input" 
                    type="text" 
                    name="question" 
                    value={questionInfo.question} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setQuestionInfo({...questionInfo, question: value});
                    }}
                /> */}
                <InputField 
                    label="Question: " 
                    name="question" 
                    type="text" 
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
                        //setType(value as QuestionType);
                        switch(value) {
                            case QuestionType.fillInBlank:
                                setQuestionInfo({
                                    //type: QuestionType.fillInBlank,
                                    ...questionInfo,
                                    type: value,
                                    answer: ""
                                });
                            break;
                            case QuestionType.multipleChoice:
                                setQuestionInfo({
                                    //type: QuestionType.multipleChoice,
                                    ...questionInfo,
                                    type: value,
                                    answer: "",
                                    option1: "",
                                    option2:"",
                                    option3:"",
                                });
                            break;
                            case QuestionType.allThatApply:
                                setQuestionInfo({
                                    //type: QuestionType.allThatApply,
                                    ...questionInfo,
                                    type: value,
                                answer1: "",
                                answer1Applies: false,
                                answer2: "",
                                answer2Applies: false,
                                answer3: "",
                                answer3Applies: false,
                                answer4: "",
                                answer4Applies: false,
                                });
                            break;
                            default:
                            break;
                        }
                    }}>
                    {/* <option value={QuestionType.fillInBlank}>Fill in the blank</option> */}
                    {Object.values(QuestionType).map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                {inputs}
                <label className="input-label" >Tags:</label>
                <div className="form-grid">
                    { Array.from(questionInfo.tags.keys()).map((tag) => (
                        <React.Fragment key={tag}>
                            {/* <label htmlFor={tag}>{`${tag}: `}</label>
                            <input 
                                type="checkbox" 
                                checked={questionInfo.tags.get(tag)}
                                onChange={() => {
                                
                                    setQuestionInfo({
                                        ...questionInfo, 
                                        tags: new Map<string, boolean>(questionInfo.tags.set(tag, !questionInfo.tags.get(tag) || false))
                                    });
                                    
                                }}
                            /> */}
                            <InputField 
                                label={tag}
                                type="checkbox"
                                checked={questionInfo.tags.get(tag)}
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
                <input className="form-btn" type="submit" value="Add Question"/>
            </form>
        </div>
    );
}

export default QuestCreate;