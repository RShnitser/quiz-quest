const URL_BASE: string = "http://localhost:3000/";
const URL_USERS: string = URL_BASE + "users";
const URL_QUESTIONS: string = URL_BASE + "questions";
const URL_HISTORY: string = URL_BASE + "history";

export type UserInfo = {
    userName: string,
    password: string
}

export type User = {
    readonly id: number,
    userName: string,
    password: string
}

export type Settings = {
    count: number,
    tags: Array<string>,
}

export type SettingsInfo = {
    count: number,
    tags: Tags,
}


// export type QuestionInfo = {
//     question: string;
//     answer: Answer,
//     tags: Tags;
// }

export enum QuestionType {
    fillInBlank= "Fill in the blank",
    allThatApply="All that apply",
    multipleChoice="Multiple Choice",
}


type FillInBlankQuestionInfo = {
    question: string;
    tags: Tags;
    type: QuestionType.fillInBlank;
    answer: string;
}

type MultipleChoiceQuestionInfo = {
    question: string;
    tags: Tags;
    type: QuestionType.multipleChoice;
    //answer: string;
    answer: MultipleChoiceOption;
    // option1: string;
    // option2: string;
    // option3: string;
    options: Array<MultipleChoiceOption>
}

type AllThatApplyQuestionInfo = {
    question: string;
    tags: Tags;
    type: QuestionType.allThatApply;
    options: Array<AllThatApplyOption>
    // answer1: string;
    // answer1Applies: boolean;
    // answer2: string;
    // answer2Applies: boolean;
    // answer3: string;
    // answer3Applies: boolean;
    // answer4: string;
    // answer4Applies: boolean;
}

export type QuestionInfo = FillInBlankQuestionInfo | MultipleChoiceQuestionInfo | AllThatApplyQuestionInfo;

type FillInBlankQuestion = {
    readonly id: number,
    question: string;
    tags: Array<string>;
    type: QuestionType.fillInBlank;
    answer: string;
}

type MultipleChoiceOption = {
    id: number;
    answer: string;
}

type MultipleChoiceQuestion = {
    readonly id: number,
    question: string;
    tags: Array<string>;
    type: QuestionType.multipleChoice;
    answer: string;
    // option1: string;
    // option2: string;
    // option3: string;
    options: Array<MultipleChoiceOption>
}

type AllThatApplyOption = {
    id: number;
    answer: string;
    answerApplies: boolean;
}


type AllThatApplyQuestion = {
    readonly id: number,
    question: string;
    tags: Array<string>;
    type: QuestionType.allThatApply;
    options: Array<AllThatApplyOption>
    // answer1: string;
    // answer1Applies: boolean;
    // answer2: string;
    // answer2Applies: boolean;
    // answer3: string;
    // answer3Applies: boolean;
    // answer4: string;
    // answer4Applies: boolean;
}

export type Question = FillInBlankQuestion | MultipleChoiceQuestion | AllThatApplyQuestion;

export type Tags = Map<string, boolean>;

export type AnswerInfo = {
    [key : string]: string | boolean;
}

// type HistoryInfo = {
//     userId: number;
//     questionId: number;
//     info: AnswerInfo;
//     date: Date;
// }

export type History = {
    id: number;
    userId: number;
    questionId: number;
    info: AnswerInfo;
    date: Date;
}

export type HistoryData = {
    history: History;
    question: Question;
}


export const loginUserAPI = async (user: UserInfo): Promise<User | undefined> => {
   
    const response: Response = await fetch(URL_USERS);
    if(!response.ok) {
        throw Error("Could not fetch user");
    }
    const users = await response.json() as Promise<User[]>;
    const result = (await users).find((userInList) => {
        if(userInList.userName === user.userName && userInList.password === user.password) {
            return(userInList);
        }
    });
    // if(!result) {
    //     throw Error("Invalid Username or Password");
    // }
    // else {
    return(result);
    //}
}

export const addUserAPI = async (newUser: UserInfo): Promise<User | undefined> => {

    const userResponse: Response = await fetch(URL_USERS);
    if(!userResponse.ok) {
        throw Error("Could not add user");
    }
    const users = await userResponse.json() as Promise<User[]>;
    const userExists = (await users).find((userInList) => {
        if(userInList.userName === userInList.userName) {
            return(userInList);
        }
    });

    if(userExists) {
        //throw Error("User with this Username already exists");
        return undefined;
    }
  
    const response = await fetch(URL_USERS, {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
        "Content-Type": "application/json",
        },
    });
    if(!response.ok) {
        throw Error("Could not add user");
    }

    const addedUser = await response.json() as Promise<User>;
    return(addedUser); 
}

export const addQuestionAPI = async (newQuestion: QuestionInfo) => {
    
    const response = await fetch(URL_QUESTIONS, {
        method: "POST",
        body: JSON.stringify({
            ...newQuestion,
            tags: Array.from(newQuestion.tags.keys())
                .filter((key) => (
                    newQuestion.tags.get(key) === true
                ))
        }),
        headers: {
        "Content-Type": "application/json",
        },
    });
    if(!response.ok) {
        throw Error("Could not add question");
    }

    const addedQuestion = await response.json() as Promise<Question>;
    return(addedQuestion); 
}

const shuffleArray = (array: Array<any>) => {

    for(let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
        const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        const temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
}

export const getQuestAPI = async (settings: Settings) => {
 
    const response = await fetch(URL_QUESTIONS);
    if(!response.ok) {
        throw Error("Could not fetch questions");
    }

    const questions = await response.json();
    
    const filteredQuestions = settings.tags.length ?

        questions.filter((question: Question) => {
            for(const tag of settings.tags) {
                if(question.tags.includes(tag)) {
                    return true;
                }
            }
            return false;
        }):
        questions;
    
    let result: Array<Question> = [];

    if(filteredQuestions.length > settings.count) {

        for(let i = 0; i < settings.count; i++) {
            const randomQuestionIndex = Math.floor(Math.random() * filteredQuestions.length);
            result.push(filteredQuestions[randomQuestionIndex]);
            filteredQuestions.splice(randomQuestionIndex, 1);
        }
    }
    else{
        result = [...filteredQuestions];
    }


    for(const question of result) {
        if(question.type === QuestionType.allThatApply || question.type === QuestionType.multipleChoice) {
            shuffleArray(question.options);
        }
    }
    //return result as Promise<Array<Question>>;
    return new Promise<Array<Question>>((resolve) => {
        resolve(shuffleArray(result));
    });
}

export const addHistoryAPI = async (userId : number, questionId : number, answerInfo: AnswerInfo) => {

    const response = await fetch(URL_HISTORY, {
        method: "POST",
        body: JSON.stringify({
            userId: userId,
            questionId: questionId,
            info: {...answerInfo},
            date: Date.now()

        }),
        headers: {
        "Content-Type": "application/json",
        },
    });
    if(!response.ok) {
        throw Error("Could not add question");
    }

    const addedHistory = await response.json() as Promise<History>;
    return(addedHistory); 
}

export const getHistoryAPI = async (userId: number) => {

   

    const [historyRes, questionRes] = await Promise.all([
        fetch(URL_HISTORY),
        fetch(URL_QUESTIONS)
    ]);
    if(!historyRes.ok || !questionRes.ok) {
        throw Error("Could not fetch history");
    }

    const [history, questions] = await Promise.all([
        historyRes.json(),
        questionRes.json()
    ]);


    
    // const filteredHistory: HistoryData = history.filter((entry: History) => {
    //         if(entry.userId === userId) {
                
    //         }
    //  }); 

    const historyData: Array<HistoryData> = [];
    for(const entry of history) {
        if(entry.userId === userId) {
            historyData.push({
                history: entry,
                question: questions.find((question: Question) => {
                    return question.id === entry.questionId;
                })
            })
        }
    }

    return historyData;
     //return filteredHistory as Promise<HistoryData>;
}