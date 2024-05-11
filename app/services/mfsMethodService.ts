import APIClient from "./apiClient";

type OptionType = {
  [key in "authenticator" | "email"]: any;
};
export type MFAMethodType = {
  _id?: string;
  method: {
    method: string;
  };
  option: OptionType;
  createdAt: string;
};

export type SupportMFAType = { method: "authenticator" | "email" };

const supportMfsMethodService = new APIClient<SupportMFAType>(
  `/mfamethods/support`
);

export default supportMfsMethodService;
