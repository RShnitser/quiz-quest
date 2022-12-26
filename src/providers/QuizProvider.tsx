import { createContext, useContext, useState } from "react";
import { loginUserAPI, addUserAPI, User, UserInfo } from "../quiz-api/quiz-api";


type QuizProviderProps = {
    children: React.ReactNode
}

export type QuizContextType = {
    user: User,
    loginUser: (user: UserInfo) => void,
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
    addUser: () => {},
});

export const QuizProvider = ({children}: QuizProviderProps) => {

    const [user, setUser] = useState<User>(INIT_USER);

    const addUser = async (user: UserInfo) => {
        try {
            const result = await addUserAPI(user);
            setUser(result);
        }
        catch(error)
        {
            console.error(error);
        }
    }

    const loginUser = async (user: UserInfo) => {
        //let result : User[] = [];
        console.log(user);
        try {
            const result = await loginUserAPI(user);
           setUser(result);
        }
        catch(error)
        {
            console.error(error);
        }

        //return result;
    }
    
    return(
        <QuizContext.Provider value={{
            user,
            loginUser,
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