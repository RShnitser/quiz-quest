import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { UserInfo } from "../quiz-api/quiz-api";

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
                const result = addUser(user);
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

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userName" onChange={handleChange}></input>
                <input type="text" name="password" onChange={handleChange}></input>
                <input type="submit" value="Create Account"/>
            </form>
            <div>
                <Link to="/login">Sign In</Link>
            </div>
        </>
    );
}

export default UserCreate;