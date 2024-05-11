import APIClient from "./apiClient";

export type TokenType = {
  code: string;
  ip: string;
  user: { email: string };
};

const tokenService = new APIClient<TokenType>(`/token`);

export default tokenService;
