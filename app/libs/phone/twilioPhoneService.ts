const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import { Twilio } from "twilio";

const client = new Twilio(accountSid, authToken);

const twilioPhoneService = () => {
  client.verify.v2
    .services("VA2fa49dd1cb7f73f56e57196739f319a4")
    .verifications.create({ to: "+2348131915694", channel: "sms" })
    .then((verification) => console.log(verification.sid));
};

export default twilioPhoneService;
