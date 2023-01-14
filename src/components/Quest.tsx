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
    [key: string]: boolean | string;
    // answer1Applies: boolean;
    // answer2Applies: boolean;
    // answer3Applies: boolean;
    // answer4Applies: boolean;
}

const INIT_ANSWER : Answer = {
    answer: "",
    // answer1Applies: false,
    // answer2Applies: false,
    // answer3Applies: false,
    // answer4Applies: false,
}


const Quest = () => {

    const {getQuest, settings}: QuizContextType = useQuiz();
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
                if(result) {
                    // const questionNodes = result.map((question) => (
                    //     buildAnswerInput(question)
                    // ));
                    setQuestions(result);
                }
            }
            catch(error) {
                console.error(error);
            }
        }

        getQuizQuestions();

    }, [])

    const isValidAnswer = ():boolean => {
        let result = true;

        setPageError("");
        setError({});

        const newError: InputError = {};
        const question = questions[questionIndex];

        switch(question.type) {
            case QuestionType.fillInBlank: 
                if(!answer.answer.length) {
                    newError["answer"] = "Enter an answer";
                    result = false;
                }
            break;
            case QuestionType.multipleChoice: 
            if(!answer.answer.length) {
                //newError["answer"] = "Enter an answer";
                setPageError("Select an answer")
                result = false;
            }
            break;
            default:
            break;
        }

        if(!result) {
            setError(newError);
        }

        return(result);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if(isValidAnswer()) {

          
            if(questions.length) {

                const question = questions[questionIndex];
                switch(question.type) {
                    case QuestionType.fillInBlank:
                        if(question.answer === answer.answer) {
                            setCorrectCount(correctCount + 1)
                        }
                    break;
                    case QuestionType.allThatApply:
                        let correct = true;
                        for(let i = 0; i < question.options.length; i++) {
                            if(question.options[i].answerApplies !== answer[`answer${i}Applies`]) {
                                correct = false;
                                break;
                            }
                        }
                        if(correct) {
                            setCorrectCount(correctCount + 1)
                        }
                    break;
                    case QuestionType.multipleChoice:
                        if(question.answer === answer.answer) {
                            setCorrectCount(correctCount + 1)
                        }
                    break;
                    default:
                    break;   
                }

                const newAnswers = [...answerArray];
                newAnswers.push(answer);
                setAnswerArray(newAnswers);

                if(questionIndex < questions.length - 1) {
                    const newQuestionIndex = questionIndex + 1;
                 
                    setQuestionIndex(newQuestionIndex);

                    const question = questions[newQuestionIndex];
                    switch(question.type) {
                        case QuestionType.allThatApply:
                            const newAnswer : Answer = {
                                answer: ""
                            };
                            for(let i = 0; i < question.options.length; i++){
                                newAnswer[`answer${i}Applies`]= false;
                            }
                            setAnswer(newAnswer);
                        break;
                        default:
                            setAnswer(INIT_ANSWER);
                        break;
                    }
                }
                else {
                    setQuizComplete(true);
                }
            }
        }

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
                             //...answer,
                             answer: value
                         })
                     }}
                     error={error["answer"] || ""}
                />
            break;
            case QuestionType.allThatApply:
                input = <div className="form-grid">
                    {question.options.map((option, index) => (
                        
                        <InputField
                            key={option.answer}
                            label={option.answer}
                            type="checkbox"
                            name={option.answer}
                            checked={answer[`answer${index}Applies`] as boolean || false}
                            error=""
                            //value={d}
                            onChange={() => {
                                //console.log(answer.answer1Applies);
                                setAnswer({
                                    ...answer,
                                    //answer1Applies: !answer.answer1Applies,
                                    [`answer${index}Applies`]: !answer[`answer${index}Applies`]
                                })
                            }}
                        />
                    ))}
                </div>
              
            break;
            case QuestionType.multipleChoice:
                input = <div className="form-grid">
                    {question.options.map((option, index) => (
                        <InputField
                            key={option}
                            label={option}
                            type="radio"
                            name="answer"
                            error=""
                            value={option}
                            //className="form-btn"
                            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                                setAnswer({
                                    //...answer,
                                    answer: value,
                                })
                            }}
                        />
                    ))}
                </div>
            break;
            default:
            break;
        }
        
        return(
            <React.Fragment key={question.id}>
                <h3 className="quest-count">{`Question ${questionIndex + 1} / ${questions.length}`}</h3>
                <div className="title">{question.question}</div>
                {input}
            </React.Fragment>
        )
    }

    //const question = questions[questionIndex];

    return(
        <div className="center-display">
        {!quizComplete ?
             <form className="form" onSubmit={handleSubmit}>
             {questions.length ? 
                 buildAnswerInput(questions[questionIndex])
                 //questions[questionIndex]
                 :<div>No Questions Available</div>}
             <div className="input-error">{pageError}</div>
             <ul className="menu-list">
                 <li>
                     <input className="form-btn" type="submit" value="Submit Answer"/> 
                 </li>
                 <li>
                     <input className="form-btn" type="button" value="Abandon Quest" onClick={() => {navigate("/")}}/>
                 </li>
             </ul>
         </form>
         : <>
            <div>{`${(correctCount / questions.length * 100).toFixed(2)}%`}</div>
            {answerArray.map((answer, index) => {

                let result = null;
                const question = questions[index];
                switch(question.type) {
                    case QuestionType.fillInBlank:
                        result = <React.Fragment>
                            <div>{answer.answer}</div>
                            {answer.answer !== question.answer ?
                                <div>{`Correct Answer: ${question.answer}`}</div>
                                : null
                            }
                        </React.Fragment>
                    break;
                    case QuestionType.allThatApply:
                        result = question.options.map((option) => {
                            return(
                                <div key={option.answer}>{option.answer}</div>
                            );
                        });
                    break;
                    case QuestionType.multipleChoice:
                        result = question.options.map((option) => {
                            return(
                                <div key={option}>{option}</div>
                            );
                        });
                    break;
                    default:
                    break;
                }

                return(<React.Fragment key={`answer${index}`}>
                    <div>{question.question}</div>
                        {result}
                    </React.Fragment>
                );
            })}
            <ul className="menu-list">
                 {/* <li>
                     <input className="form-btn" type="submit" value="Submit Answer"/> 
                 </li> */}
                 <li>
                     <input className="form-btn" type="button" value="Main Menu" onClick={() => {navigate("/")}}/>
                 </li>
             </ul>
         </>
        }
        </div>
    );
}

export default Quest;