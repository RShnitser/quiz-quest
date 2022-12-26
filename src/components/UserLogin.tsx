import React, { useState } from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import { UserInfo } from "../quiz-api/quiz-api";

// type LoginState = {
//     userName: string,
//     password: string
// }

const INIT_USER : UserInfo = {
    userName: "",
    password: ""
}

const UserLogin = () => {

    const {loginUser} : QuizContextType  = useQuiz();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(INIT_USER);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();
      
        try {
            if(user.userName.length && user.password.length) {
                const {from} = location.state || {from: { pathname: "/"}}  
                loginUser(user);
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

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userName" onChange={handleChange}></input>
                <input type="text" name="password" onChange={handleChange}></input>
                <input type="submit" value="Sign In"></input>
            </form>
            <div>
                <Link to="/register">Create Account</Link>
            </div>
        </>
    );
}

export default UserLogin;