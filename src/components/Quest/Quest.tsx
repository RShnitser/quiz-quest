import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import { Question, QuestionType, Answer } from "../../quiz-api/quiz-api";
import HistoryCard from "../HistoryCard/HistoryCard";
import InputField from "../InputField/InputField";
import { InputError } from "../QuizApp/QuizApp";
//import {Answer} from "../QuizApp/QuizApp";
import "./Quest.css";



const INIT_ANSWER : Answer = {
    type: QuestionType.fillInBlank,
    answer: "",
}

const Quest = () => {

    const {user, getQuest, settings, addHistory}: QuizContextType = useQuiz();
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

                    const question = result[0];
                    switch(question.type) {
                        case QuestionType.allThatApply:
                            const applyAnswer : Answer = {
                                type: QuestionType.allThatApply,
                                answer: [],
                                //answer: ""
                            };
                            //for(let i = 0; i < question.options.length; i++){
                            for(const option of question.options) {
                                //newAnswer[`answer${i}Applies`]= false;
                                applyAnswer.answer.push({id: option.id, applies: false});
                            }
                            setAnswer(applyAnswer);
                        break;
                        case QuestionType.multipleChoice:
                            const choiceAnswer: Answer = {
                                type: QuestionType.multipleChoice,
                                answer: -1,
                                order: [],
                            }
                            for(const option of question.options) {
                                //newAnswer[`answer${i}Applies`]= false;
                                choiceAnswer.order.push(option.id);
                            }
                            setAnswer(choiceAnswer);
                        break;
                        default:
                            //setAnswer(INIT_ANSWER);
                        break;
                    }
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
        //const question = questions[questionIndex];

        switch(answer.type) {
            case QuestionType.fillInBlank: 
                if(!answer.answer.length) {
                    newError["answer"] = "Enter an answer";
                    result = false;
                }
            break;
            case QuestionType.multipleChoice: 
                if(answer.answer === -1) {
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

    // const handleAddHistory = async () => {
    //     try {
    //         for(const index in answerArray) {
    //             console.log(index);
    //             await addHistory(user.id, questions[index].id, answerArray[index]);
    //         }
    //     }
    //     catch(error) {
    //         console.error(error);
    //     }
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                        //for(const option of question.options) {
                            if(question.options[i].answerApplies !== (answer.answer as {id: number, applies: boolean}[])[i].applies) {
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

                await addHistory(user.id, question.id, answer);

                if(questionIndex < questions.length - 1) {
                    const newQuestionIndex = questionIndex + 1;
                 
                    setQuestionIndex(newQuestionIndex);

                    const question = questions[newQuestionIndex];
                    switch(question.type) {
                        case QuestionType.allThatApply:
                            const newAnswer : Answer = {
                                type: QuestionType.allThatApply,
                                answer: [],
                            };
                            //for(let i = 0; i < question.options.length; i++){
                            for(const option of question.options) {
                                //newAnswer[`answer${i}Applies`]= false;
                                newAnswer.answer.push({id: option.id, applies: false});
                            }
                            setAnswer(newAnswer);
                        break;
                        default:
                            setAnswer(INIT_ANSWER);
                        break;
                    }
                }
                else {
                   //await handleAddHistory();
                    setQuizComplete(true);
                }
            }
        }

    }

   

    const buildAnswerInput = (question : Question): React.ReactNode => {
        let input = null;
        //switch(answer.type) {
        switch(question.type) {
            case QuestionType.fillInBlank:
                

                input = <InputField
                     label="Answer:"
                     type="text"
                     name="answer"
                     value={answer.answer as string}
                     onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                         setAnswer({
                             type: QuestionType.fillInBlank,
                             answer: value,
                             //...answer,
                             //answer: value
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
                            checked={(answer.answer as {id: number, applies: boolean}[])[index].applies}
                            error=""
                            //value={d}
                            onChange={() => {
                                //console.log(answer.answer1Applies);

                                const applyAnswer: Answer = {
                                    type: QuestionType.allThatApply,
                                    answer: [...(answer.answer as {id: number, applies: boolean}[])]
                                }
                                applyAnswer.answer[index].applies = ! applyAnswer.answer[index].applies;
                                setAnswer(
                                    applyAnswer
                                    //...answer,
                                    //answer1Applies: !answer.answer1Applies,
                                    //[`answer${index}Applies`]: !answer[`answer${index}Applies`]
                                );
                            }}
                        />
                    ))}
                </div>
              
            break;
            case QuestionType.multipleChoice:
                input = <div className="form-grid">
                    {question.options.map((option, index) => (
                        <InputField
                            key={option.answer}
                            label={option.answer}
                            type="radio"
                            name="answer"
                            error=""
                            value={option.id.toString()}
                            //className="form-btn"
                            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {

                                if(answer.type === QuestionType.multipleChoice) {

                                    const choiceAnswer: Answer = {
                                        type: QuestionType.multipleChoice,
                                        answer: parseInt(value),
                                        order: [...answer.order]
                                    }
                                    setAnswer(
                                        choiceAnswer
    
                                        //...answer,
                                        //answer: value,
                                    )
                                }
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
         : <div>
            <div className="quest-percentage">{`${(correctCount / questions.length * 100).toFixed(2)}%`}</div>
            {answerArray.map((answer, index) => {

                //let result = null;
                const question = questions[index];
                // switch(question.type) {
                //     case QuestionType.fillInBlank:
                //         result = <React.Fragment>
                //             {answer.answer !== question.answer ?
                //             <>
                //                 <div className="quest-grid">
                //                     <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                //                     <div>{answer.answer}</div>
                //                 </div>
                //                 <div><span className="quest-bold">{"Correct Answer: "}</span>{question.answer}</div>
                //             </>
                //                 : <div className="quest-flex">
                //                     <div className="correct"><i className="fa-solid fa-check"></i></div>
                //                     <div>{answer.answer}</div>
                //                 </div>
                //             }
                //         </React.Fragment>
                //     break;
                //     case QuestionType.allThatApply:
                //         result = <div className="quest-grid">
                //             {question.options.map((option, index) => {
                                
                //                 let check = <div></div>
                //                 if(option.answerApplies === answer[`answer${index}Applies`]) {
                //                     check =  <div className="correct"><i className="fa-solid fa-check"></i></div>
                //                 }
                //                 else {
                //                     check =  <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                //                 }
                //                 return(
                //                     <React.Fragment key={option.answer}>
                //                         {check}
                //                         <div className={answer[`answer${index}Applies`] ? "quest-bold" : ""}>
                //                             {option.answer}
                //                         </div>
                //                     </React.Fragment>
                //                 );
                //             })}
                //         </div>
                //     break;
                //     case QuestionType.multipleChoice:
                //         result = <div className = "quest-grid">
                //             {question.options.map((option) => {
                //                 let check = <div></div>
                //                 if(option === answer.answer) {
                //                    if(answer.answer === question.answer) {
                //                        check = <div className="correct"><i className="fa-solid fa-check"></i></div>;
                //                    }
                //                    else {
                //                        check = <div className="incorrect"><i className="fa-solid fa-xmark"></i></div>
                //                    }
                //                 }
                //                 if(answer.answer !== question.answer && option === question.answer) {
                //                     check = <div className="correct"><i className="fa-solid fa-check"></i></div>;
                //                 }
                //                 return(
                //                     <React.Fragment key={option}>
                //                         {check}
                //                         <div className={option === answer.answer ? "quest-bold" : ""}>
                //                             {option}
                //                         </div>
                //                     </React.Fragment>
                //                 );
                //         })}
                //         </div>
                //     break;
                //     default:
                //     break;
                // }

                return(<div className="quest-answer-container" key={`answer${index}`}>
                    <div className="title">{`Question ${index + 1}: ${question.question}`}</div>
                        {/* {result} */}
                        <HistoryCard
                            question={question}
                            answer={answer}
                        />
                    </div>
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
         </div>
        }
        </div>
    );
}

export default Quest;