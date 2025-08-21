export type SignupFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthday: string;
  height?: number;
  weight?: number;
  pregnant: number;
  feeding: boolean;
  dueDate: string;
  allergyList: string[] | null;
  diseaseList: string[] | null;
};

export type LoginFormValues = {
  email: string;
  password: string;
};
