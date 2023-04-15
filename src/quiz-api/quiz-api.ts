const URL_BASE: string = "http://localhost:3000/";
const URL_USERS: string = URL_BASE + "user";
const URL_QUIZ: string = URL_BASE + "quiz";
const URL_QUESTIONS: string = URL_BASE + "question";
const URL_HISTORY: string = URL_BASE + "history";

export type UserInfo = {
  userName: string;
  password: string;
};

export type UserResponse = {
  //readonly id: number;
  userInfo: {
    email: string;
  };
  token: string;
  //password: string;
};

export type SettingsInfo = {
  count: number;
  tags: Array<string>;
};

export type Settings = {
  count: number;
  tags: Tags;
};

export enum QuestionType {
  fillInBlank = "Fill in the blank",
  allThatApply = "All that apply",
  multipleChoice = "Multiple Choice",
}

type AnswerInfo = {
  answer?: string;
  answerApplies?: boolean;
};

type UserAnswerInfo = {
  answerId: number;
  answer?: string;
  answerApplies?: boolean;
  order: number;
};

export type HistoryInfo = {
  questionId: number;
  userAnswer: UserAnswerInfo[];
};

export type QuestionInfo = {
  question: string;
  type: QuestionType;
  tags: string[];
  options: AnswerInfo[];
};

// type FillInBlankQuestionInfo = {
//   question: string;
//   tags: Tags;
//   type: QuestionType.fillInBlank;
//   answer: string;
// };

// type MultipleChoiceQuestionInfo = {
//   question: string;
//   tags: Tags;
//   type: QuestionType.multipleChoice;
//   answer: MultipleChoiceOption;
//   options: Array<MultipleChoiceOption>;
// };

// type AllThatApplyQuestionInfo = {
//   question: string;
//   tags: Tags;
//   type: QuestionType.allThatApply;
//   options: Array<AllThatApplyOption>;
// };

// export type QuestionInfo =
//   | FillInBlankQuestionInfo
//   | MultipleChoiceQuestionInfo
//   | AllThatApplyQuestionInfo;

type FillInBlankQuestion = {
  readonly id: number;
  question: string;
  tags: Array<string>;
  type: QuestionType.fillInBlank;
  answer: string;
};

type MultipleChoiceOption = {
  id: number;
  answer: string;
};

type MultipleChoiceQuestion = {
  readonly id: number;
  question: string;
  tags: Array<string>;
  type: QuestionType.multipleChoice;
  answer: string;
  options: Array<MultipleChoiceOption>;
};

type AllThatApplyOption = {
  id: number;
  answer: string;
  answerApplies: boolean;
};

type AllThatApplyQuestion = {
  readonly id: number;
  question: string;
  tags: Array<string>;
  type: QuestionType.allThatApply;
  options: Array<AllThatApplyOption>;
};

export type Question =
  | FillInBlankQuestion
  | MultipleChoiceQuestion
  | AllThatApplyQuestion;

type QuestionResponse = {
  id: number;
  question: string;
  type: string;
  userId: number;
};

type HistoryResponse = {
  id: number;
  userId: number;
  questionId: number;
  createdDate: Date;
};

type UserHistory = {
  question: QuestionResponse;
  answers: {
    userAnswer: UserAnswerInfo;
    answer: AnswerInfo;
  }[];
};

export type Tags = Map<string, boolean>;

type FillInBlankAnswer = {
  type: QuestionType.fillInBlank;
  answer: string;
};

type MultipleChoiceAnswer = {
  type: QuestionType.multipleChoice;
  answer: number;
  order: Array<number>;
};

type AllThatApplyAnswer = {
  type: QuestionType.allThatApply;
  answer: Array<{ id: number; applies: boolean }>;
};

export type Answer =
  | FillInBlankAnswer
  | MultipleChoiceAnswer
  | AllThatApplyAnswer;

export type History = {
  id: number;
  userId: number;
  questionId: number;
  answer: Answer;
  date: Date;
};

export type HistoryData = {
  history: History;
  question: Question;
};

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
  // const response: Response = await fetch(URL_USERS);
  // if(!response.ok) {
  //     throw Error("Could not fetch user");
  // }
  // const users = await response.json() as Promise<User[]>;
  // const result = (await users).find((userInList) => {
  //     if(userInList.userName === user.userName && userInList.password === user.password) {
  //         return(userInList);
  //     }
  // });

  // return(result);
  const response = await fetch(URL_BASE + "auth/login", {
    method: "POST",
    body: JSON.stringify({ email: user.userName, password: user.password }),
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

export const addUserAPI = async (
  newUser: UserInfo
): Promise<UserResponse | undefined> => {
  const userResponse: Response = await fetch(URL_USERS);
  if (!userResponse.ok) {
    throw Error("Could not add user");
  }
  // const users = (await userResponse.json()) as Promise<UserResponse[]>;
  // const userExists = (await users).find((userInList) => {
  //   if (userInList.userName === newUser.userName) {
  //     return userInList;
  //   }
  // });

  // if (userExists) {
  //   return undefined;
  // }

  const response = await fetch(URL_USERS, {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw Error("Could not add user");
  }

  //const addedUser = (await response.json()) as Promise<UserResponse>;
  const addedUser = await response.json();
  return addedUser;
};

export const addQuestionAPI = async (
  newQuestion: QuestionInfo,
  token: string
): Promise<QuestionResponse> => {
  const response = await fetch(URL_QUESTIONS, {
    method: "POST",
    // body: JSON.stringify({
    //   ...newQuestion,
    //   tags: Array.from(newQuestion.tags.keys()).filter(
    //     (key) => newQuestion.tags.get(key) === true
    //   ),
    // }),
    body: JSON.stringify(newQuestion),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw Error("Could not add question");
  }

  //const addedQuestion = (await response.json()) as Promise<Question>;
  const addedQuestion = await response.json();
  return addedQuestion;
};

// const shuffleArray = (array: Array<any>) => {
//   for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
//     const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
//     const temp = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temp;
//   }

//   return array;
// };

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
            answerApplies: answer.answerApplies as boolean,
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
        answer: "",
        options: question.answers.map((answer) => {
          const result: MultipleChoiceOption = {
            id: answer.id,
            answer: answer.answer,
          };
          return result;
        }),
      };
      for (const answerData of question.answers) {
        if (answerData.answerApplies) {
          questionData.answer = answerData.answer;
          break;
        }
      }
    } else if (question.question.type === QuestionType.fillInBlank) {
      const questionData: FillInBlankQuestion = {
        id: question.question.id,
        type: QuestionType.fillInBlank,
        question: question.question.question,
        tags: question.tags.map((tag) => tag.value),
        answer: question.answers[0].answer,
      };
    }
  }

  return result;

  // const filteredQuestions = settings.tags.length
  //   ? questions.filter((question: Question) => {
  //       for (const tag of settings.tags) {
  //         if (question.tags.includes(tag)) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     })
  //   : questions;

  // let result: Array<Question> = [];

  // if (filteredQuestions.length > settings.count) {
  //   for (let i = 0; i < settings.count; i++) {
  //     const randomQuestionIndex = Math.floor(
  //       Math.random() * filteredQuestions.length
  //     );
  //     result.push(filteredQuestions[randomQuestionIndex]);
  //     filteredQuestions.splice(randomQuestionIndex, 1);
  //   }
  // } else {
  //   result = [...filteredQuestions];
  // }

  // for (const question of result) {
  //   if (
  //     question.type === QuestionType.allThatApply ||
  //     question.type === QuestionType.multipleChoice
  //   ) {
  //     shuffleArray(question.options);
  //   }
  // }

  // return new Promise<Array<Question>>((resolve) => {
  //   resolve(shuffleArray(result));
  // });
};

export const addHistoryAPI = async (
  history: HistoryInfo,
  token: string
  // userId: number,
  // questionId: number,
  // answerInfo: Answer
): Promise<HistoryResponse> => {
  const response = await fetch(URL_HISTORY, {
    method: "POST",
    // body: JSON.stringify({
    //   userId: userId,
    //   questionId: questionId,
    //   answer: { ...answerInfo },
    //   date: Date.now(),
    body: JSON.stringify(history),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw Error("Could not add question");
  }

  const addedHistory = await response.json();
  return addedHistory;
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
    throw Error("Could not add question");
  }

  const history = (await response.json()) as Promise<UserHistory[]>;
  return history;
  // const [historyRes, questionRes] = await Promise.all([
  //   fetch(URL_HISTORY),
  //   fetch(URL_QUESTIONS),
  // ]);
  // if (!historyRes.ok || !questionRes.ok) {
  //   throw Error("Could not fetch history");
  // }

  // const [history, questions] = await Promise.all([
  //   historyRes.json(),
  //   questionRes.json(),
  // ]);

  // const historyData: Array<HistoryData> = [];
  // for (const entry of history) {
  //   if (entry.userId === userId) {
  //     historyData.push({
  //       history: entry,
  //       question: questions.find((question: Question) => {
  //         return question.id === entry.questionId;
  //       }),
  //     });
  //   }
  // }

  // return historyData.sort(
  //   (a, b) =>
  //     new Date(b.history.date).getTime() - new Date(a.history.date).getTime()
  // );
};
