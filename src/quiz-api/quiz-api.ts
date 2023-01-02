const URL_BASE: string = "http://localhost:3000/";
const URL_USERS: string = URL_BASE + "users";
const URL_QUESTIONS: string = URL_BASE + "questions";

export type UserInfo = {
    userName: string,
    password: string
}

export type User = {
    readonly id: number,
    userName: string,
    password: string
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
    answer: string;
    option1: string;
    option2: string;
    option3: string;
}

type AllThatApplyQuestionInfo = {
    question: string;
    tags: Tags;
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

export type QuestionInfo = FillInBlankQuestionInfo | MultipleChoiceQuestionInfo | AllThatApplyQuestionInfo;

type FillInBlankQuestion = {
    readonly id: number,
    question: string;
    tags: Array<string>;
    type: QuestionType.fillInBlank;
    answer: string;
}

type MultipleChoiceQuestion = {
    readonly id: number,
    question: string;
    tags: Array<string>;
    type: QuestionType.multipleChoice;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
}

type AllThatApplyQuestion = {
    readonly id: number,
    question: string;
    tags: Array<string>;
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

export type Question = FillInBlankQuestion | MultipleChoiceQuestion | AllThatApplyQuestion;

export type Tags = Map<string, boolean>;

export const loginUserAPI = async (user: UserInfo): Promise<User> => {
   
    const response: Response = await fetch(URL_USERS);
    if(!response.ok) {
        throw Error("Could not fetch user");
    }
    const users = await response.json() as Promise<User[]>;
    const result = (await users).find((userInList) => {
        if(userInList.userName === user.userName && userInList.password === user.password) {
            return(userInList);
        }
    })
    if(!result) {
        throw Error("Could not find user");
    }
    else {
        return(result);
    }
}

export const addUserAPI = async (newUser: UserInfo): Promise<User> => {
  
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
