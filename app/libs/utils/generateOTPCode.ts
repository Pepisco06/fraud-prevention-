const speakeasy = require("speakeasy");

const generateOTPCode = (secret?: string) => {
  // Generate a new secret key

  // Generate an OTP code based on the secret key
  const otp: string = speakeasy.totp({
    secret: secret ? secret : speakeasy.generateSecret().base32,
    encoding: "base32",
  });

  return otp;
};

export default generateOTPCode;
