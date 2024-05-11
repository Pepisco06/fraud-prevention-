import Heading from "@/app/components/Heading";
import Space from "@/app/components/Space";
import { useState } from "react";
import StepTwo from "../EmailMultiFactor/StepTwo";
import AuthAppStepOne from "./AuthAppStepOne";

const AuthenticatorMultiFactor = () => {
  const [step, setStep] = useState(1);

  const nextHandler = (step: number) => {
    setStep(step);
  };

  return (
    <section>
      <Heading variant="h3">Set up authenticator app</Heading>
      <Space styles="my-2" />

      {step === 1 && <AuthAppStepOne nextHandler={nextHandler} />}
      {step === 2 && (
        <StepTwo
          nextHandler={nextHandler}
          factor="authenticator"
          heading="Enter the 6-digit code you see in the app"
        />
      )}
    </section>
  );
};

export default AuthenticatorMultiFactor;
