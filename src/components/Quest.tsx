import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { Question, QuestionType } from "../quiz-api/quiz-api";
import InputField from "./InputField";
import { InputError } from "./QuizApp/QuizApp";

// type  AnswerFillInBlank = {
//     type: QuestionType.fillInBlank;
//     answer: string;
// }

// type AnswerMultipleChoice = {
//     type: QuestionType.multipleChoice;
//     answer: string;
// }

// type AnswerAllThatApply = {
//     type: QuestionType.allThatApply;
//     answer1Applies: boolean;
//     answer2Applies: boolean;
//     answer3Applies: boolean;
//     answer4Applies: boolean;
// }

// type Answer = AnswerFillInBlank | AnswerMultipleChoice | AnswerAllThatApply;

type Answer = {
    //type: QuestionType;
    answer: string;
    answer1Applies: boolean;
    answer2Applies: boolean;
    answer3Applies: boolean;
    answer4Applies: boolean;
}

const INIT_ANSWER : Answer = {
    answer: "",
    answer1Applies: false,
    answer2Applies: false,
    answer3Applies: false,
    answer4Applies: false,
}


const Quest = () => {

    const {getQuest}: QuizContextType = useQuiz();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Array<React.ReactNode>>([]);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [answer, setAnswer] = useState<Answer>(INIT_ANSWER);
    const [error, setError] = useState<InputError>({});

    useEffect(() => {
        const getQuizQuestions = async () => {

            try {
                const result = await getQuest({count: 0, tags: []});
                if(result) {
                    const questionNodes = result.map((question) => (
                        buildAnswerInput(question)
                    ));
                    setQuestions(questionNodes);
                }
            }
            catch(error) {
                console.error(error);
            }
        }

        getQuizQuestions();

    }, [])

    const isValidAnswer = () => {

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(questions.length) {
            if(questionIndex < questions.length - 1) {
                setQuestionIndex(questionIndex + 1);
                setAnswer(INIT_ANSWER);
            }
        }
    }

    const shuffleArray = (array: Array<React.ReactNode>) => {

        for(let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
            const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
            const temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }

        return array;
    }

    const buildAnswerInput = (question : Question): React.ReactNode => {
        let input = null;
        switch(question.type) {
            case QuestionType.fillInBlank:
                

                input = <InputField
                     label="Answer:"
                     type="text"
                     name="answer"
                     value={answer.answer}
                     onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                         setAnswer({
                             ...answer,
                             answer: value
                         })
                     }}
                     error={error["answer"] || ""}
                />
            break;
            case QuestionType.allThatApply:
                input = <div className="form-grid">
                     {shuffleArray([<InputField
                        key="input-1"
                        label={question.answer1}
                        type="checkbox"
                        name={question.answer1}
                        checked={answer.answer1Applies}
                        error=""
                        //value={d}
                        onChange={() => {
                            console.log(answer.answer1Applies);
                            setAnswer({
                                ...answer,
                                answer1Applies: !answer.answer1Applies,
                            })
                        }}
                    />,

                    <InputField
                        key="input-2"
                        label={question.answer2}
                        type="checkbox"
                        name={question.answer2}
                        checked={answer.answer2Applies}
                        error=""
                        //value={data.value}
                        onChange={() => {
                            setAnswer({
                                ...answer,
                                answer2Applies: !answer.answer2Applies,
                            })
                        }}
                    />,

                    <InputField
                        key="input-3"
                        label={question.answer3}
                        type="checkbox"
                        name={question.answer3}
                        error=""
                        //value={data.value}
                        checked={answer.answer3Applies}
                        onChange={() => {
                            setAnswer({
                                ...answer,
                                answer3Applies: !answer.answer3Applies,
                            })
                        }}
                    />,

                    <InputField
                        key="input-4"
                        label={question.answer4}
                        type="checkbox"
                        name={question.answer4}
                        error=""
                        //value={data.value}
                        checked={answer.answer4Applies}
                        onChange={() => {
                            setAnswer({
                                ...answer,
                                answer4Applies: !answer.answer4Applies,
                            })
                        }}
                    />])}
                </div>
            break;
            case QuestionType.multipleChoice:
                input = <div className="form-grid">
                    {shuffleArray([<InputField
                        key="input-1"
                        label={question.answer}
                        type="radio"
                        name="answer"
                        error=""
                        value={question.answer}
                        //className="form-btn"
                        onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                            setAnswer({
                                ...answer,
                                answer: value,
                            })
                        }}
                    />,

                    <InputField
                        key="input-2"
                        label={question.option1}
                        type="radio"
                        name="answer"
                        error=""
                        value={question.option1}
                        //className="form-btn"
                        onChange={({target: {name}}: React.ChangeEvent<HTMLInputElement>) => {
                           
                        }}
                    />,

                    <InputField
                        key="input-3"
                        label={question.option2}
                        type="radio"
                        name="answer"
                        error=""
                        value={question.option2}
                        //className="form-btn"
                        onChange={({target: {name}}: React.ChangeEvent<HTMLInputElement>) => {
                           
                        }}
                    />,

                    <InputField
                        key="input-3"
                        label={question.option3}
                        type="radio"
                        name="answer"
                        error=""
                        value={question.option3}
                        //className="form-btn"
                        onChange={({target: {name}}: React.ChangeEvent<HTMLInputElement>) => {
                           
                        }}
                    />])}
                </div>
            break;
            default:
            break;
        }
        
        return(
            <React.Fragment key={question.id}>
                <div className="title">{question.question}</div>
                {input}
            </React.Fragment>
        )
    }

    //const question = questions[questionIndex];

    return(
        <div className="center-display">
            <form className="form" onSubmit={handleSubmit}>
                {questions.length ? 
                    //buildAnswerInput(questions[questionIndex])
                    questions[questionIndex]
                    :<div>No Questions Available</div>}
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