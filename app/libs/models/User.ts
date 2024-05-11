import Joi from "joi";
import mongoose from "mongoose";

type ProfileDocument = {
  firstName: string;
  lastName: string;
};

type MFAMethodType = { method: string };

export type UserDocument = {
  email: string;
  password: string;
  ips: string[];
  profile: ProfileDocument;
  mfaMethods: MFAMethodType[];
};

type User = {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ips: { type: [String], required: true },
  profile: { type: mongoose.Types.ObjectId, ref: "Profile" },
  mfamethods: [{ type: mongoose.Types.ObjectId, ref: "MFAMethod" }],
});

export const validateUser = async (data: User) => {
  const result = Joi.object({
    email: Joi.string().email().min(2),
    password: Joi.string()
      .min(8) // Minimum length of 8 characters
      .max(30) // Maximum length of 30 characters
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[.#<>@$!%*?&])[A-Za-z\\d.#<>@$!%*?&]+$"
        )
      )
      .message(
        '"{#label}" must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
      ),
  }).min(1);

  const validate = await result.validate(data);

  return validate;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
