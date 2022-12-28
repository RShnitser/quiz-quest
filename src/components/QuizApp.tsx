import { Routes, Route, useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import MainMenu from "./MainMenu";
import TakeQuiz from "./TakeQuiz";

const QuizApp = () => {

    const {logoutUser} : QuizContextType  = useQuiz();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    }

    return(
        <div>
            <nav>
                <h2>Quiz Quest</h2>
                <button type="button" onClick={handleLogout}>
                    <div>Sign Out</div>
                </button>
            </nav>
            <Routes>
                <Route path="/" element={<MainMenu />}/>
                <Route path="/takequiz" element={<TakeQuiz />}/>
            </Routes>
        </div>
    );
}

export default QuizApp;