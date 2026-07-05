import api from "../api/axios";

export interface SignUpData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export const signup = async (data: SignUpData) => {
  console.log("Sending:", data);

  const response = await api.post("/user/signup", data);

  console.log("Response:", response);

  return response.data;
};
export interface SignInData {
  username: string;
  password: string;
}
export const signin = async (data: SignInData) => {
    const response = await api.post("/user/signin", data);
    return response.data;
};