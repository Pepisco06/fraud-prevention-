import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import Space from "@/app/components/Space";
import Heading from "@/app/components/Heading";

const EmailMultiFactor = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const nextHandler = (step: number) => {
    setStep(step);
  };

  return (
    <section>
      <Heading variant="h3">Set up email method!</Heading>
      <Space styles="my-2" />

      {step === 1 && <StepOne nextHandler={nextHandler} setEmail={setEmail} />}
      {step === 2 && <StepTwo nextHandler={nextHandler} email={email} />}
    </section>
  );
};

export default EmailMultiFactor;
