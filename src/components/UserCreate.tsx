import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { UserInfo } from "../quiz-api/quiz-api";
import InputField from "./InputField/InputField";
import { InputError } from "./QuizApp/QuizApp";

const INIT_USER : UserInfo = {
    userName: "",
    password: "",
}

// interface InputError {
//     [key: string]: string
// }
const UserCreate = () => {

    const {addUser} : QuizContextType  = useQuiz();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(INIT_USER);
    const [error, setError] = useState<InputError>({});
    const [pageError, setPageError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setPageError("");
        setError({});

        const newError: InputError = {};

        try {
            let isError = false;
            if(!user.userName.length) {
                //setError({...error, ["userName"]: "Enter Name"});
                newError["userName"] = "Enter Name";
                isError = true;
            } 
            if(!user.password.length) {
                //setError({...error, ["password"]: "Enter Password"});
                newError["password"] = "Enter Password;"
                isError = true;
            }

            if(!isError){
                const result = await addUser(user);
                if(result) {
                    navigate("/");
                }
                else {
                    setPageError("User with this Username already exists");
                }
            }
            else {
                setError(newError);
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
        }
    ]

    return(
        <div className="center-display">
            <h3 className="title">Create Account</h3>
            <div className="input-error">{pageError}</div>
            <form className="form" onSubmit={handleSubmit}>
                {formData.map((data) => (
                    <InputField
                        key={data.name} 
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