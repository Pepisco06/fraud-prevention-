import Joi, { required } from "joi";
import mongoose from "mongoose";

export type Email = {
  value: string;
  default: boolean;
};

export type EmailDocument = {
  emails: Email[];
  message: string;
  seck: string;
  enabled: boolean;
};

const emailMFASchema = new mongoose.Schema({
  emails: [
    {
      value: { type: String, required: true },
      default: { type: Boolean, required: true },
    },
  ],
  message: { type: String, required: true },
  seck: { type: String, required: true },
  enabled: { type: Boolean, required: true },
});

// const EmailMFA =
//   mongoose.models.EmailMFA ||
//   mongoose.model<EmailDocument>("EmailMFA", emailMFASchema);

const validateEmail = async (data: EmailDocument) => {
  return await Joi.object({
    email: Joi.string().email(),
    message: Joi.string().min(3).required(),
    enabled: Joi.boolean().required(),
  }).validate(data);
};

// export default EmailMFA;
export { emailMFASchema, validateEmail };
