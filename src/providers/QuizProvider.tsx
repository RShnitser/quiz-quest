import React, { createContext, useContext, useState } from "react";
import {
  addQuestionAPI,
  getQuestAPI,
  addHistoryAPI,
  getHistoryAPI,
} from "../quiz-api/quiz-api";
import {
  UserHistory,
  QuestionInfo,
  SettingsInfo,
  HistoryResponse,
  HistoryInfo,
  Question,
} from "../quiz-api/quiz-types";

export type QuizContextType = {
  settings: SettingsInfo;
  addQuestion: (question: QuestionInfo, token: string) => void;
  getQuest: (
    settings: SettingsInfo,
    token: string
  ) => Promise<Array<Question> | undefined>;

  addHistory: (
    history: HistoryInfo[],
    token: string
  ) => Promise<HistoryResponse | undefined>;
  getHistory: (token: string) => Promise<Array<UserHistory> | undefined>;
  setSettings: (settings: SettingsInfo) => void;
};

const INIT_SETTINGS: SettingsInfo = {
  count: 5,
  tags: [],
};

const QuizContext = createContext<QuizContextType>({} as QuizContextType);

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SettingsInfo>(INIT_SETTINGS);

  const addQuestion = async (question: QuestionInfo, token: string) => {
    try {
      const result = await addQuestionAPI(question, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const getQuest = async (settings: SettingsInfo, token: string) => {
    try {
      const result = await getQuestAPI(settings, token);

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const addHistory = async (history: HistoryInfo[], token: string) => {
    try {
      const result = await addHistoryAPI(history, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const getHistory = async (token: string) => {
    try {
      const data = await getHistoryAPI(token);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        settings,
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
