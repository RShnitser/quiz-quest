import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import { AuthContextType } from "../../providers/AuthProvider";
import InputField from "../InputField/InputField";
import { UserInfo, ErrorData } from "../../quiz-api/quiz-types";

const INIT_USER: UserInfo = {
  userName: "",
  password: "",
};

const UserLogin = () => {
  const { loginUser }: AuthContextType = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(INIT_USER);
  const [showError, setShowError] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string>("");

  const buildError = (): ErrorData => {
    const result: ErrorData = {
      success: true,
      error: {},
    };

    if (!user.userName.length) {
      result.error["userName"] = "Enter Name";
      result.success = false;
    }
    if (!user.password.length) {
      result.error["password"] = "Enter Password;";
      result.success = false;
    }

    return result;
  };

  const errorData = buildError();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPageError("");

    try {
      if (errorData.success) {
        const result = await loginUser(user);
        if (result) {
          const { from } = location.state || { from: { pathname: "/" } };
          navigate(from, { replace: true });
        } else {
          setPageError("Invalid Username or Password");
          setShowError(true);
        }
      } else {
        setShowError(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [name]: value });
  };

  const formData = [
    {
      type: "text",
      label: "  ",
      name: "userName",
      value: user.userName,
      placeholder: "Enter User Name",
    },
    {
      type: "password",
      label: "   ",
      name: "password",
      value: user.password,
      placeholder: "Enter Password",
    },
  ];

  return (
    <div className="center-display">
      <h3 className="title">Sign In</h3>
      <div className="input-error">{showError ? pageError : ""}</div>
      <form
        className="form"
        onSubmit={handleSubmit}
        onBlur={() => setShowError(false)}
      >
        {formData.map((data) => (
          <InputField
            key={data.name}
            {...data}
            error={showError ? errorData.error[data.name] || "" : ""}
            onChange={handleChange}
          />
        ))}
        <input className="form-btn" type="submit" value="Sign In" />
      </form>
      <div className="link">
        Don't have an account?&nbsp;
        <Link to="/register">Create Account</Link>
      </div>
    </div>
  );
};

export default UserLogin;
