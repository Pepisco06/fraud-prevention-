import { Email } from "@/app/libs/models/mfa/EmailMFA";
import { MFAMethodType } from "@/app/services/mfsMethodService";

const getDefaultEmail = async (populateEmailMethod: any): Promise<Email> => {
  const defaultEmail = (
    populateEmailMethod.mfamethods as MFAMethodType[]
  )[0].option.email.emails.find(
    (email: { default: boolean }) => email.default === true
  );
  return defaultEmail;
};

export default getDefaultEmail;
