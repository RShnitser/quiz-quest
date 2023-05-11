import {
  QuestionType,
  Question,
  AllThatApplyQuestion,
  MultipleChoiceQuestion,
  FillInBlankQuestion,
  Option,
  QuestionInfo,
  SettingsInfo,
  HistoryResponse,
  HistoryInfo,
  QuestionResponse,
  UserHistory,
  UserInfo,
  UserResponse,
} from "./quiz-types";

const URL_BASE: string = "http://localhost:3000/";
const URL_USERS: string = URL_BASE + "user";
const URL_QUIZ: string = URL_BASE + "quiz";
const URL_QUESTIONS: string = URL_BASE + "question";
const URL_HISTORY: string = URL_BASE + "history";

type QuizResponse = {
  question: QuestionResponse;
  answers: AnswerResponse[];
  tags: TagResponse[];
};

type AnswerResponse = {
  id: number;
  questionId: number;
  answer: string;
  answerApplies: boolean | null;
};

type TagResponse = {
  id: number;
  value: string;
};

export const loginUserAPI = async (user: UserInfo): Promise<UserResponse> => {
  const response = await fetch(URL_BASE + "auth/login", {
    method: "POST",
    body: JSON.stringify({ email: user.email, password: user.password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw Error("Could not login");
  }
  const data = await response.json();
  return data;
};

export const addUserAPI = async (newUser: UserInfo): Promise<UserResponse> => {
  const response = await fetch(URL_USERS, {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    if (error && error.message) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Could not create user" };
  }
  const addedUser = await response.json();
  return {
    success: true,
    userInfo: { email: addedUser.userInfo.email },
    token: addedUser.token,
  };
};

export const addQuestionAPI = async (
  newQuestion: QuestionInfo,
  token: string
): Promise<QuestionResponse> => {
  const response = await fetch(URL_QUESTIONS, {
    method: "POST",
    body: JSON.stringify(newQuestion),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw Error("Could not add question");
  }
  const addedQuestion = await response.json();
  return addedQuestion;
};

export const getQuestAPI = async (settings: SettingsInfo, token: string) => {
  const response = await fetch(URL_QUIZ, {
    method: "POST",
    body: JSON.stringify(settings),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw Error("Could not fetch questions");
  }

  const questions = (await response.json()) as QuizResponse[];
  const result: Question[] = [];

  for (const question of questions) {
    if (question.question.type === QuestionType.allThatApply) {
      const questionData: AllThatApplyQuestion = {
        id: question.question.id,
        type: QuestionType.allThatApply,
        question: question.question.question,
        tags: question.tags.map((tag) => tag.value),
        options: question.answers.map((answer) => {
          return {
            id: answer.id,
            answer: answer.answer,
            answerApplies: answer.answerApplies || false,
          };
        }),
      };
      result.push(questionData);
    } else if (question.question.type === QuestionType.multipleChoice) {
      const questionData: MultipleChoiceQuestion = {
        id: question.question.id,
        type: QuestionType.multipleChoice,
        question: question.question.question,
        tags: question.tags.map((tag) => tag.value),
        //answer: "",
        options: question.answers.map((answer) => {
          const result: Option = {
            id: answer.id,
            answer: answer.answer,
            answerApplies: answer.answerApplies || false,
          };
          return result;
        }),
      };
      result.push(questionData);
    } else if (question.question.type === QuestionType.fillInBlank) {
      const questionData: FillInBlankQuestion = {
        id: question.question.id,
        type: QuestionType.fillInBlank,
        question: question.question.question,
        tags: question.tags.map((tag) => tag.value),
        answer: question.answers[0].answer,
        answerId: question.answers[0].id,
      };
      result.push(questionData);
    }
  }

  return result;
};

export const addHistoryAPI = async (
  history: HistoryInfo[],
  token: string
): Promise<HistoryResponse> => {
  const response = await fetch(URL_HISTORY, {
    method: "POST",
    body: JSON.stringify(history),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw Error("Could not add question");
  }

  const result = await response.json();
  return result;
};

export const getHistoryAPI = async (token: string): Promise<UserHistory[]> => {
  const response = await fetch(URL_HISTORY, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw Error("Could not get history");
  }

  const history = (await response.json()) as Promise<UserHistory[]>;
  return history;
};
