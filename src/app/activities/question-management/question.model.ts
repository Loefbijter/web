export interface Question {
  activityId?: string;
  id?: string;
  text: string;
  required: boolean;
  type: QuestionTypes;
  order: number;
}

export enum QuestionTypes {
  SHORT = 0,
  OPEN = 1,
  NUMBER = 2,
  CHECKBOX = 3,
}
