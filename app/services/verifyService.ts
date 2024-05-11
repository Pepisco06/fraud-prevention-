import APIClient from "./apiClient";

export type VerifyCredential = {
  code: string;
};

const verifyService = new APIClient<VerifyCredential>(`/verify`);

export default verifyService;
