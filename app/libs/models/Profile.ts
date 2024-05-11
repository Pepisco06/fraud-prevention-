import Joi, { required } from "joi";
import mongoose from "mongoose";

export type ProfileType = {
  firstName: string;
  lastName: string;
};

const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const validateProfile = async (data: ProfileType) => {
  return await Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
  }).validate(data);
};

export default mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);
