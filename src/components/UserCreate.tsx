import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { UserInfo } from "../quiz-api/quiz-api";
import InputField from "./InputField";

const INIT_USER : UserInfo = {
    userName: "",
    password: ""
}


const UserCreate = () => {

    const {addUser} : QuizContextType  = useQuiz();
    const navigate = useNavigate();
    const [user, setUser] = useState(INIT_USER);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        try {
            if(user.userName.length && user.password.length) {
                addUser(user);
                navigate("/");
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        setUser({...user, [name]: value});
    }

    const formData = [
        {
            type: "text", 
            label: "",
            name: "userName",
            value: user.userName,
            placeHolder: "Enter User Name",
        },
        {
            type: "password", 
            label: "",
            name: "password",
            value: user.password,
            placeHolder: "Enter Password",
        }
    ]

    return(
        <div className="center-display">
            <h3 className="title">Create Account</h3>
            <form className="form" onSubmit={handleSubmit}>
                {formData.map((data) => (
                    <InputField 
                        {...data}
                        onChange={handleChange}
                    />
                ))}
                {/* <input 
                    className="form-input" 
                    type="text" 
                    name="userName"
                    value={user.userName}
                    placeholder="enter user name" 
                    onChange={handleChange}
                />
                <input 
                    className="form-input" 
                    type="password" 
                    name="password"
                    value={user.password}
                    placeholder="enter password"
                    onChange={handleChange}
                />*/}
                <input className="form-btn" type="submit" value="Create Account"/> 
            </form>
            <div className="link">
                Already have an account?&nbsp;
                <Link to="/login">Sign In</Link>
            </div>
        </div>
    );
}

export default UserCreate;