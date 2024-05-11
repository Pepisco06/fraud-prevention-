import mongoose from "mongoose";

const mfaMethodSchema = new mongoose.Schema({
  method: {
    type: mongoose.Types.ObjectId,
    ref: "SupportMFA",
  },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  option: { type: mongoose.Types.ObjectId, ref: "MFAOption" },
  createdAt: { type: Date, default: Date.now },
});

const MFAMethod =
  mongoose.models.MFAMethod || mongoose.model("MFAMethod", mfaMethodSchema);

export default MFAMethod;
