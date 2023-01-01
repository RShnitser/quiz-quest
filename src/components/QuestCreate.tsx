// const QuestionType = {
//     fillInBlank: 1,
//     allThatApply: 2,
//     multipleChoice: 3,
// } as const;

import { useState } from "react";

// type QuestionType = typeof QuestionType[keyof typeof QuestionType];

enum QuestionType {
    fillInBlank= "Fill in the blank",
    allThatApply="All that apply",
    multipleChoice="Multiple Choice",
}

type FillInBlankAnswer = {
    type: QuestionType.fillInBlank;
    answer: string;
}

type MultipleChoiceAnswer = {
    type: QuestionType.multipleChoice;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
}

type AllThatApplyAnswer = {
    type: QuestionType.allThatApply;
    answer1: string;
    answer1Applies: boolean;
    answer2: string;
    answer2Applies: boolean;
    answer3: string;
    answer3Applies: boolean;
    answer4: string;
    answer4Applies: boolean;
}

type Answer = FillInBlankAnswer | MultipleChoiceAnswer | AllThatApplyAnswer;

// type FillInBlankQuestion = {
//     id: number;
//     question: string;
//     type: QuestionType.fillInBlank;
//     answer: string;
//     tags: string[];
//   };
  
//   type AllThatApplyQuestion = {
//     id: number;
//     question: string;
//     type: QuestionType.allThatApply;
//     answers: string[];
//     options: string[];
//     tags: string[];
//   };
//   type MultipleChoiceQuestion = {
//     id: number;
//     question: string;
//     type: QuestionType.multipleChoice;
//     answer: string;
//     options: string[];
//     tags: string[];
//   };
  
//   type Question = AllThatApplyQuestion | MultipleChoiceQuestion | FillInBlankQuestion

// const INIT_QUESTION: Question = {
//     id: -1,
//     question: "",
//     type: QuestionType.fillInBlank,
//     answer: "",
//     tags: [],
// }

// const TAGS : string[] = [
//     "HTML",
//     "CSS",
//     "Javascript",
//     "Git",
//     "React"
// ]

const INIT_TAGS = new Map<string, boolean>([
    ["HTML", false],
    ["CSS", false],
    ["Javascript", false],
    ["Git", false],
    ["React", false],
]);

const QuestCreate = () => {

    const [question, setQuestion] = useState<string>("");
    //const [type, setType] = useState<QuestionType>(QuestionType.fillInBlank);
    const [answer, setAnswer] = useState<Answer>({type: QuestionType.fillInBlank, answer: ""});
    const [tags, setTags] = useState<Map<string, boolean>>(INIT_TAGS);
    //const [isChecked, setIsChecked] = useState<boolean>(false);

    // if(question.type === QuestionType.fillInBlank) {
        //     inputs = <>
        //         <input type="text" name="question" value={question.question} onChange={handleChange}/>
        //         <input type="text" name="answer" value={question.answer} onChange={handleChange}/>
    //     </>
    // }
    
    // const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    //     setQuestion({...question, [name]: value});
    // }
    
    let inputs = null;

    switch(answer.type) {
        case QuestionType.fillInBlank:
            inputs = <>
                 <input 
                    type="text" 
                    name="answer" 
                    value={answer.answer} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, answer: value});
                    }}
                 />
            </>
        break;
        case QuestionType.multipleChoice:
            inputs = <>
                <input 
                    type="text" 
                    name="answer" 
                    value={answer.answer} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, answer: value});
                    }}
                 />
                 <input 
                    type="text" 
                    name="option1" 
                    value={answer.option1} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, option1: value});
                    }}
                 />
                 <input 
                    type="text" 
                    name="option2" 
                    value={answer.option2} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, option2: value});
                    }}
                 />
                 <input 
                    type="text" 
                    name="option3" 
                    value={answer.option3} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, option3: value});
                    }}
                 />
            </>
        break;
        case QuestionType.allThatApply:
            inputs = <>
                <input 
                    type="text" 
                    name="answer1" 
                    value={answer.answer1} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, answer1: value});
                    }}
                 />
                 <input 
                    type="checkbox" 
                    name="answer1Applies" 
                    checked={answer.answer1Applies} 
                    onChange={() => {
                        setAnswer({...answer, answer1Applies: !answer.answer1Applies});
                    }}
                 />
                 <input 
                    type="text" 
                    name="answer2" 
                    value={answer.answer2} 
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setAnswer({...answer, answer2: value});
                    }}
                 />
                 <input 
                    type="checkbox" 
                    name="answer2Applies" 
                    checked={answer.answer2Applies} 
                    onChange={() => {
                        setAnswer({...answer, answer2Applies: !answer.answer2Applies});
                    }}
                 />
            </>
        break;
        default:
        break;
    }

    return(
        <form>
            <input 
                type="text" 
                name="question" 
                value={question} 
                onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                    setQuestion(value);
                }}
            />
            <select 
                name="type"
                value={answer.type}
                onChange={({target: {value}}: React.ChangeEvent<HTMLSelectElement>) => {
                    //setType(value as QuestionType);
                    switch(value) {
                        case QuestionType.fillInBlank:
                            setAnswer({
                                //type: QuestionType.fillInBlank,
                                type: value,
                                answer: ""
                            });
                        break;
                        case QuestionType.multipleChoice:
                            setAnswer({
                                //type: QuestionType.multipleChoice,
                                type: value,
                                answer: "",
                                option1: "",
                                option2:"",
                                option3:"",
                            });
                        break;
                        case QuestionType.allThatApply:
                            setAnswer({
                                //type: QuestionType.allThatApply,
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
            { Array.from(tags.keys()).map((tag) => (
                <input 
                    key={tag} 
                    type="checkbox" 
                    //name={tag}
                    //value={tag}
                    checked={tags.get(tag)}
                    //checked={isChecked}
                    onChange={() => {
                        //console.log(tag, tags.get(tag));
                        setTags(new Map<string, boolean>(tags.set(tag, !tags.get(tag) || false)));
                        //setIsChecked(!isChecked);
                    }}
                />
            ))}
            <input className="form-btn" type="submit" value="Add Question"/>
        </form>
    );
}

export default QuestCreate;