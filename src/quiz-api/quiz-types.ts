//input validation
type InputError = {
  [key: string]: string;
};

export type ErrorData = {
  success: boolean;
  error: InputError;
};

export enum QuestionType {
  fillInBlank = "Fill in the blank",
  allThatApply = "All that apply",
  multipleChoice = "Multiple Choice",
}

//tags are stored in a map after getting fetched
//or during question creation
export type TagsData = Map<string, boolean>;

//union used for question creation
//data format stored on client side
type FillInBlankQuestionData = {
  type: QuestionType.fillInBlank;
  question: string;
  answer: string;
  tags: TagsData;
};

type MultipleChoiceQuestionData = {
  type: QuestionType.multipleChoice;
  question: string;
  options: { answer: string; answerApplies: boolean }[];
  tags: TagsData;
};

type AllThatAppliesQuestionData = {
  type: QuestionType.allThatApply;
  question: string;
  options: { answer: string; answerApplies: boolean }[];
  tags: TagsData;
};

export type QuestionData =
  | FillInBlankQuestionData
  | MultipleChoiceQuestionData
  | AllThatAppliesQuestionData;

//settings data stored on client side
export type SettingsData = {
  count: number;
  tags: TagsData;
};

//data format for questions and answer data
//when sent to the backend
//converted from questiondata type
export type AnswerInfo = {
  answer?: string;
  answerApplies?: boolean;
};

export type QuestionInfo = {
  question: string;
  type: QuestionType;
  tags: string[];
  options: AnswerInfo[];
};

//settings data when sent to the backend
export type SettingsInfo = {
  count: number;
  tags: Array<string>;
};

//history data received from the backend
export type HistoryResponse = {
  id: number;
  userId: number;
  questionId: number;
  createdDate: Date;
};

//answer data format sent to the backend
export type UserAnswerInfo = {
  answerId: number;
  userAnswer?: string;
  userAnswerApplies?: boolean;
  order?: number;
};

//history data format sent to the backend
export type HistoryInfo = {
  questionId: number;
  userAnswer: UserAnswerInfo[];
};

//data format stored on client and used
//when taking quiz
export type FillInBlankQuestion = {
  id: number;
  answerId: number;
  question: string;
  tags: Array<string>;
  type: QuestionType.fillInBlank;
  answer: string;
};

export type Option = {
  id: number;
  answer: string;
  answerApplies: boolean;
};

export type MultipleChoiceQuestion = {
  id: number;
  question: string;
  tags: Array<string>;
  type: QuestionType.multipleChoice;
  options: Array<Option>;
};

export type AllThatApplyQuestion = {
  readonly id: number;
  question: string;
  tags: Array<string>;
  type: QuestionType.allThatApply;
  options: Array<Option>;
};

export type Question =
  | FillInBlankQuestion
  | MultipleChoiceQuestion
  | AllThatApplyQuestion;

export type FillInBlankAnswer = {
  type: QuestionType.fillInBlank;
  answer: string;
};

export type MultipleChoiceAnswer = {
  type: QuestionType.multipleChoice;
  answer: Array<{ id: number; applies: boolean }>;
};

export type AllThatApplyAnswer = {
  type: QuestionType.allThatApply;
  answer: Array<{ id: number; applies: boolean }>;
};

export type Answer =
  | FillInBlankAnswer
  | MultipleChoiceAnswer
  | AllThatApplyAnswer;

//question data received from the backend
export type QuestionResponse = {
  id: number;
  question: string;
  type: string;
};

//history data received from the backend
export type UserHistory = {
  question: QuestionResponse;
  date: string;
  answers: {
    userAnswer: UserAnswerInfo;
    answer: AnswerInfo;
  }[];
};

//user data sent to the backend
export type UserInfo = {
  userName: string;
  password: string;
};

//user data received from the backend
export type UserResponse = {
  userInfo: {
    email: string;
  };
  token: string;
};
