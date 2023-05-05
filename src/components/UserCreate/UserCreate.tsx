import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import { AuthContextType } from "../../providers/AuthProvider";
import InputField from "../InputField/InputField";
import { ErrorData, UserInfo } from "../../quiz-api/quiz-types";

const INIT_USER: UserInfo = {
  userName: "",
  password: "",
};

const UserCreate = () => {
  const { addUser }: AuthContextType = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(INIT_USER);
  const [pageError, setPageError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

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
        const result = await addUser(user);
        if (result) {
          navigate("/");
        } else {
          setPageError("User with this Username already exists");
          setShowError(true);
        }
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
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
      label: " ",
      name: "userName",
      value: user.userName,
      placeholder: "Enter User Name",
    },
    {
      type: "password",
      label: "  ",
      name: "password",
      value: user.password,
      placeholder: "Enter Password",
    },
  ];

  return (
    <div className="center-display">
      <h3 className="title">Create Account</h3>
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

        <input className="form-btn" type="submit" value="Create Account" />
      </form>
      <div className="link">
        Already have an account?&nbsp;
        <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default UserCreate;
