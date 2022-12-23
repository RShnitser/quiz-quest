import { createContext, useContext } from "react";

const QuizContext = createContext({});

type QuizProviderProps = {
    children: React.ReactNode
}

export const QuizProvider = (props: QuizProviderProps) => {

    return(
        <QuizContext.Provider value={{

        }}>
            {props.children}
        </QuizContext.Provider>
    );
}

const useQuiz = () => {
    const quizContext = useContext(QuizContext);

    return(quizContext);
}

export default useQuiz;