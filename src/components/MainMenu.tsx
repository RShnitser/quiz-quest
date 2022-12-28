import { useNavigate } from "react-router-dom";

const MainMenu = () => {

    const navigate = useNavigate();

    return(
        <div>
            <div>Main Menu</div>
            <ul>
                <li>
                    <button type="button" onClick={() => navigate("/takequiz")}>Take Quiz</button>
                </li>
                <li>
                    <button type="button">Quiz Settings</button>
                </li>
                <li>
                    <button type="button">Add Question</button>
                </li>
                <li>
                    <button type="button">View History</button>
                </li>
            </ul>
        </div>
    );
}

export default MainMenu;