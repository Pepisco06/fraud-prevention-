const nodemailerConfig = {
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
};

export default nodemailerConfig;
