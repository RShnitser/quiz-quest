import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-display">
      <div className="title">Main Menu</div>
      <ul className="form menu-list">
        <li>
          <button
            className="form-btn"
            type="button"
            onClick={() => navigate("/quest")}
          >
            Take Quiz
          </button>
        </li>
        <li>
          <button
            className="form-btn"
            type="button"
            onClick={() => navigate("/settings")}
          >
            Quiz Settings
          </button>
        </li>
        <li>
          <button
            className="form-btn"
            type="button"
            onClick={() => navigate("/add-quest")}
          >
            Add Question
          </button>
        </li>
        <li>
          <button
            className="form-btn"
            type="button"
            onClick={() => navigate("/history")}
          >
            View History
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MainMenu;
