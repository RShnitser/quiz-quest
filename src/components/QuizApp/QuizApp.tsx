import { Routes, Route, useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import MainMenu from "../MainMenu";
import Quest from "../Quest/Quest";
import QuestCreate from "../QuestCreate";
import QuestSettings from "../QuestSettings";
import QuestHistory from "../QuestHistory/QuestHistory";
import "./QuizApp.css";

export type InputError = {
    [key: string]: string
}

const QuizApp = () => {

    const {logoutUser} : QuizContextType  = useQuiz();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    }

    return(
        <div>
            <nav className="nav">
                <h2 className="title">Quiz Quest</h2>
                <button className="logout-btn" type="button" onClick={handleLogout}>
                    <div><i className="fa-solid fa-user">&nbsp;</i>Sign Out</div>
                </button>
            </nav>
            <Routes>
                <Route path="/" element={<MainMenu />}/>
                <Route path="/quest" element={<Quest />}/>
                <Route path="/settings" element={<QuestSettings />}/>
                <Route path="/add-quest" element={<QuestCreate />}/>
                <Route path="/history" element={<QuestHistory />}/>
            </Routes>
        </div>
    );
}

export default QuizApp;