import APIClient from "./apiClient";

const generateService = (userId: string, factor = "email") =>
  new APIClient(`/users/${userId}/two-step-verification/${factor}/generate`);

export default generateService;
