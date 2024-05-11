import APIClient from "./apiClient";
import { MFAMethodType } from "./mfsMethodService";

export type UserType = {
  _id?: string;
  email: string;
  password?: string;
  ips?: string[];
  mfamethods?: MFAMethodType[];
  profile?: string;
};

const userService = new APIClient<UserType>("/users");

export default userService;
