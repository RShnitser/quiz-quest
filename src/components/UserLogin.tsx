import React, { useState } from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { UserInfo } from "../quiz-api/quiz-api";
import InputField from "./InputField";
import { InputError } from "./QuizApp/QuizApp";

const INIT_USER : UserInfo = {
    userName: "",
    password: ""
}

const UserLogin = () => {

    const {loginUser} : QuizContextType  = useQuiz();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [user, setUser] = useState(INIT_USER);
    const [error, setError] = useState<InputError>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        try {

            let isError = false;
            if(!user.userName.length) {
                setError({...error, ["userName"]: "Enter Name"});
                isError = true;
            } 
            if(!user.password.length) {
                setError({...error, ["password"]: "Enter Password"});
                isError = true;
            }

            if(!isError){
                const {from} = location.state || {from: { pathname: "/"}}  
                await loginUser(user);
                navigate(from, { replace: true });
            }
           
        }
        catch(e){
            console.error(e);
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
            <h3 className="title">Sign In</h3>
            <form className="form" onSubmit={handleSubmit}>
                {formData.map((data) => (
                    <InputField 
                        {...data}
                        error={error[data.name] || ""}
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
                /> */}
                <input className="form-btn" type="submit" value="Sign In"/>
            </form>
            <div className="link">
                Don't have an account?&nbsp;
                <Link to="/register">Create Account</Link>
            </div>
        </div>
    );
}

export default UserLogin;