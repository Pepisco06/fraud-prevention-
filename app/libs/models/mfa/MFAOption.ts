import mongoose from "mongoose";
import { emailMFASchema } from "./EmailMFA";
import { authenticatorMFASchema } from "./AuthenticatorMFA";

const mfaOptionSchema = new mongoose.Schema({
  email: { type: emailMFASchema, embedded: true },
  authenticator: { type: authenticatorMFASchema, embedded: true },
});

// Define MFAOption model which includes both Email and Authenticator schemas
const MFAOption =
  mongoose.models.MFAOption || mongoose.model("MFAOption", mfaOptionSchema);

export default MFAOption;
