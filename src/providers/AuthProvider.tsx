import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUserAPI, addUserAPI } from "../quiz-api/quiz-api";
import { UserResponse, UserInfo } from "../quiz-api/quiz-types";

const INIT_USER: UserResponse = {
  success: false,
  message: "uninitialized",
};

export type AuthContextType = {
  user: UserResponse;
  loginUser: (user: UserInfo) => Promise<UserResponse | undefined>;
  logoutUser: () => void;
  addUser: (user: UserInfo) => Promise<UserResponse>;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse>(INIT_USER);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const loginUser = async (user: UserInfo) => {
    try {
      const result = await loginUserAPI(user);
      if (result) {
        localStorage.setItem("user", JSON.stringify(result));
        setUser(result);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const logoutUser = () => {
    setUser(INIT_USER);
    localStorage.removeItem("user");
  };

  const addUser = async (user: UserInfo) => {
    const result = await addUserAPI(user);

    if (result.success) {
      localStorage.setItem("user", JSON.stringify(result));
      setUser(result);
    }

    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, addUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
