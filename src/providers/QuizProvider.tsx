import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginUserAPI,
  addUserAPI,
  UserResponse,
  UserInfo,
  Settings,
  Answer,
  Question,
  History,
  HistoryInfo,
  HistoryData,
  addQuestionAPI,
  SettingsInfo,
  getQuestAPI,
  addHistoryAPI,
  getHistoryAPI,
} from "../quiz-api/quiz-api";
import { QuestionInfo } from "../quiz-api/quiz-api";
import useAuth from "./AuthProvider";

// type QuizProviderProps = {
//   children: React.ReactNode;
// };

export type QuizContextType = {
  user: UserResponse;
  settings: SettingsInfo;
  addQuestion: (question: QuestionInfo) => void;
  getQuest: (settings: Settings) => Promise<Array<Question> | undefined>;
  addHistory: (
    userId: number,
    questionId: number,
    answer: Answer
  ) => Promise<History | undefined>;
  getHistory: (userId: number) => Promise<Array<HistoryData> | undefined>;
  setSettings: (settings: SettingsInfo) => void;
};

const INIT_SETTINGS: SettingsInfo = {
  count: 5,
  tags: [],
};

const QuizContext = createContext<QuizContextType>({
  // user: INIT_USER,
  // settings: INIT_SETTINGS,
  // loginUser: () => {
  //   return new Promise(() => undefined);
  // },
  // logoutUser: () => {},
  // addUser: () => {
  //   return new Promise(() => undefined);
  // },
  // addQuestion: () => {},
  // getQuest: () => {
  //   return new Promise(() => undefined);
  // },
  // setSettings: () => {},
  // addHistory: () => {
  //   return new Promise(() => undefined);
  // },
  // getHistory: () => {
  //   return new Promise(() => undefined);
  // },
} as QuizContextType);

export const QuizProvider = ({ children }: { children: React.ReactPortal }) => {
  const { user, loginUser, logoutUser, addUser } = useAuth();
  const [settings, setSettings] = useState<SettingsInfo>(INIT_SETTINGS);

  const addQuestion = async (question: QuestionInfo) => {
    try {
      const result = await addQuestionAPI(question, user.token);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const getQuest = async (settings: Settings) => {
    const questSettings: SettingsInfo = {
      count: settings.count,
      tags: [],
    };

    for (const entry of settings.tags.entries()) {
      if (entry[1] === true) {
        questSettings.tags.push(entry[0]);
      }
    }

    try {
      const result = await getQuestAPI(questSettings, user.token);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const addHistory = async (history: HistoryInfo) => {
    try {
      const result = await addHistoryAPI(history, user.token);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const getHistory = async () => {
    try {
      const data = await getHistoryAPI(user.token);
      const result: HistoryData[] = [];
      for (const entry of data) {
        const resultEntry: HistoryData = {
          history: {},
        };
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        user,
        settings,
        loginUser,
        logoutUser,
        addUser,
        addQuestion,
        getQuest,
        setSettings,
        addHistory,
        getHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const quizContext = useContext(QuizContext);

  return quizContext;
};

export default useQuiz;
