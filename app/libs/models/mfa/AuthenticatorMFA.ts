import mongoose from "mongoose";

type Authenticator = {
  value: string;
  default: boolean;
};

export type AuthenticatorDocument = {
  authenticators: Authenticator[];
  message: string;
  seck: string;
  enabled: boolean;
};

const authenticatorMFASchema = new mongoose.Schema({
  authenticators: [{ value: String, default: Boolean }],
  message: { type: String },
  enabled: { type: Boolean, default: false },
});

// const AuthenticatorMFA =
//   mongoose.models.AuthenticatorMFA ||
//   mongoose.model("AuthenticatorMFA", authenticatorMFASchema);

// export default AuthenticatorMFA;
export { authenticatorMFASchema };
