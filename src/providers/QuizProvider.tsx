import { createContext, useContext, useState, useEffect } from "react";
import { 
    loginUserAPI, 
    addUserAPI, 
    User, 
    UserInfo, 
    Answer, 
    Question,
    History,
    HistoryData,
    addQuestionAPI, 
    Settings, 
    getQuestAPI,
    addHistoryAPI,
    getHistoryAPI,

} from "../quiz-api/quiz-api";
import { QuestionInfo} from "../quiz-api/quiz-api";

type QuizProviderProps = {
    children: React.ReactNode
}

export type QuizContextType = {
    user: User,
    settings: Settings,
    loginUser: (user: UserInfo) => Promise<User | undefined>,
    logoutUser: () => void,
    addUser: (user: UserInfo) => Promise<User | undefined>,
    addQuestion: (question: QuestionInfo) => void,
    getQuest: (settings: Settings) => Promise<Array<Question> | undefined>;
    addHistory: (userId : number, questionId : number, answer: Answer) => Promise<History | undefined>;
    getHistory: (userId : number) => Promise<Array<HistoryData> | undefined>;
    setSettings: (settings: Settings) => void,
}

const INIT_USER: User = {
    id: -1, 
    userName: "", 
    password: "",
}

const INIT_SETTINGS: Settings = {
    count: 5,
    tags: []
}

const QuizContext = createContext<QuizContextType>({
    user: INIT_USER,
    settings: INIT_SETTINGS,
    loginUser: () => {return new Promise(() => undefined)},
    logoutUser: () => {},
    addUser: () => {return new Promise(() => undefined)},
    addQuestion: () => {},
    getQuest: () => {return new Promise(() => undefined)},
    setSettings: () => {},
    addHistory: () => {return new Promise(() => undefined)},
    getHistory: () => {return new Promise(() => undefined)},
});

export const QuizProvider = ({children}: QuizProviderProps) => {

    const [user, setUser] = useState<User>(INIT_USER);
    const [settings, setSettings] = useState<Settings>(INIT_SETTINGS)

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if(loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, [])

    const addUser = async (user: UserInfo) => {
        try {
            const result = await addUserAPI(user);
            if(result) {
                localStorage.setItem("user", JSON.stringify(result));
                setUser(result);
            }
            return result;
        }
        catch(error)
        {
            console.error(error);
        }
    }

    const loginUser = async (user: UserInfo) => {
        //let result : User[] = [];
        try {
            const result = await loginUserAPI(user);
            if(result) {
                localStorage.setItem("user", JSON.stringify(result));
                setUser(result);
            }
            return result;
        }
        catch(error)
        {
            console.error(error);
        }

        //return result;
    }

    const logoutUser = () => {
        setUser(INIT_USER);
        localStorage.removeItem("user");
    }

    const addQuestion = async (question: QuestionInfo) => {
        try {
            const result = await addQuestionAPI(question);
            return result;
        }
        catch(error) {
            console.error(error);
        }
    }

    const getQuest = async (settings: Settings) => {
        try {
            const result = await getQuestAPI(settings);
            return result;
        }
        catch(error) {
            console.error(error);
        }
    }

    const addHistory = async (userId : number, questionId : number, answer: Answer) => {
        try {
            const result = await addHistoryAPI(userId, questionId, answer);
            return result;
        }
        catch(error) {
            console.error(error);
        }
    }

    const getHistory = async (userId : number) => {
        try {
            const result = await getHistoryAPI(userId);
            return result;
        }
        catch(error) {
            console.error(error);
        }
    }
    
    return(
        <QuizContext.Provider value={{
            user,
            settings,
            loginUser,
            logoutUser,
            addUser,
            addQuestion,
            getQuest,
            setSettings,
            addHistory,
            getHistory
        }}>
            {children}
        </QuizContext.Provider>
    );
}

const useQuiz = () => {
    const quizContext = useContext(QuizContext);

    return(quizContext);
}

export default useQuiz;