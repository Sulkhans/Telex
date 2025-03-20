export type ErrorType = {
  message: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  image: string;
  status: "onlline" | "away" | "offline";
};

export type LoginData = {
  username: string;
  password: string;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: boolean;
};
