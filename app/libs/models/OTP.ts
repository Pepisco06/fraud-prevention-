import mongoose from "mongoose";

const OPTSchema = new mongoose.Schema({
  expireAt: { type: Date, expires: 60, default: Date.now },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  token: { seck: String, verified: Boolean },
  code: { type: String },
  ip: { type: String },
});

const OTP = mongoose.models.OTP || mongoose.model("OTP", OPTSchema);

export default OTP;
