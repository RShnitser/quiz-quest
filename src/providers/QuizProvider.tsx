import { createContext, useContext, useState, useEffect } from "react";
import { loginUserAPI, addUserAPI, User, UserInfo } from "../quiz-api/quiz-api";

type QuizProviderProps = {
    children: React.ReactNode
}

export type QuizContextType = {
    user: User,
    loginUser: (user: UserInfo) => void,
    logoutUser: () => void,
    addUser: (user: UserInfo) => void,
}

const INIT_USER = {
    id: -1, 
    userName: "", 
    password: "",
}

const QuizContext = createContext<QuizContextType>({
    user: INIT_USER,
    loginUser: () => {},
    logoutUser: () => {},
    addUser: () => {},
});

export const QuizProvider = ({children}: QuizProviderProps) => {

    const [user, setUser] = useState<User>(INIT_USER);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if(loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, [])

    const addUser = async (user: UserInfo) => {
        try {
            const result = await addUserAPI(user);
            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
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
            localStorage.setItem("user", JSON.stringify(result));
            setUser(result);
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
    
    return(
        <QuizContext.Provider value={{
            user,
            loginUser,
            logoutUser,
            addUser,
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