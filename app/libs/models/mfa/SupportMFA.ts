import mongoose from "mongoose";

const supportMFASchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["authenticator", "email"],
    required: true,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SupportMFA =
  mongoose.models.SupportMFA || mongoose.model("SupportMFA", supportMFASchema);

// SupportMFA.insertMany([
//   {
//     method: "email",
//     message: "Add email address",
//   },
//   {
//     method: "authenticator",
//     message: "Add authenticator app",
//   },
// ]);

export default SupportMFA;
