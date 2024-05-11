import OTP from "@/app/libs/models/OTP";
import mongoose from "mongoose";

const hasTempSec = async (userId: string) => {
  const foundTempOTP = await OTP.findOne({
    user: new mongoose.Types.ObjectId(userId),
  });

  if (foundTempOTP) {
    return true;
  } else {
    return false;
  }
};

export default hasTempSec;
