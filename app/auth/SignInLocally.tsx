import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import InputGroup from "./InputGroup";
import SignInButton from "./SignInButton";
import useAuth from "./store/useAuth";
import Space from "../components/Space";
import StepTwo from "../profile/settings/MultiFactors/EmailMultiFactor/StepTwo";
import { useState } from "react";

const SignInLocally = () => {
  const methods = useForm();
  const { handleSubmit, control } = methods;
  const { signIn, isAuthenticating } = useAuth();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const submitHandler = async (data: FieldValues) => {
    await signIn(
      { email: data.email, password: data.password },
      (authMessage, messageData) => {
        if (authMessage) {
          if (authMessage.toLowerCase().includes("ip address")) {
            toast.error("Auth Failed", {
              position: "top-center",
              description: authMessage,
            });
          }

          if (authMessage.includes("Verification code")) {
            setCode(messageData.code);
            setEmail(data.email);
          }

          toast.message(authMessage, {
            position: "top-center",
          });
        } else {
          toast.success("Congratulations login successful!", {
            position: "top-center",
          });
        }
      }
    );
  };

  return (
    <FormProvider {...methods}>
      {code && email ? (
        <StepTwo email={email} code={code} />
      ) : (
        <form onSubmit={handleSubmit(submitHandler)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputGroup
                field={field}
                name="email"
                placeholder="khem@khemshield.com"
              />
            )}
          />

          <Space />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputGroup
                field={field}
                type="password"
                name="password"
                placeholder="Min. 8 Characters"
              />
            )}
          />

          <Space />
          <SignInButton
            text={isAuthenticating ? "Loading..." : "Sign In / Sign Up"}
            disabled={isAuthenticating}
            color="orange"
          />
        </form>
      )}
    </FormProvider>
  );
};

export default SignInLocally;
