import {BrowserRouter, Routes, Route, Navigate, Outlet, useLocation} from "react-router-dom"
import QuizApp from './components/QuizApp'
import { QuizProvider } from './providers/QuizProvider'
import UserLogin from "./components/UserLogin"
import UserCreate from "./components/UserCreate"
//import useQuiz from "./providers/QuizProvider";
//import { QuizContextType } from "./providers/QuizProvider";
import './App.css'
//import React from "react"

// type PrivateRouteProps {
  //   children: React.ReactNode,
// }
  
const PrivateRoute = () => {


  //const {user}: QuizContextType = useQuiz();
  const location = useLocation();
  
 //const isAuth = user.id > -1;
 let isAuth = false;

  const loggedInUser = localStorage.getItem("user");
  if(loggedInUser) {
      isAuth = true;
  }

  return isAuth
  ? <Outlet />
  //? children
  : <Navigate to="/login" replace state={{from: location}}/>
}

function App() {
 
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<UserLogin />}/>
          <Route path="/register" element={<UserCreate />}/>
          <Route element={<PrivateRoute/>} >
            <Route path="*" element={<QuizApp />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  )
}

export default App
