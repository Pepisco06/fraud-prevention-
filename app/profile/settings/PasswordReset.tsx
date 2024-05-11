"use client";
import InputGroup from "@/app/auth/InputGroup";
import SignInButton from "@/app/auth/SignInButton";
import useAuth from "@/app/auth/store/useAuth";
import Space from "@/app/components/Space";
import userService from "@/app/services/userService";
import { userInfo } from "os";
import { useRef, useState } from "react";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

const PasswordReset = () => {
  const methods = useForm();
  const { userInfo } = useAuth();
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false);

  const onSubmitHandler = async (data: FieldValues) => {
    setIsLoadingChangePassword(true);
    const passwordResetRes = await userService.patch(
      {
        password: data.password,
        confirmPassword: data.confirm_password,
      },
      `/${userInfo?.user._id}/password`
    );

    if (passwordResetRes.error) {
      toast.error("Fail to change password", {
        description: passwordResetRes.error.message,
        position: "top-center",
      });

      setIsLoadingChangePassword(false);
    }

    if (passwordResetRes.message) {
      toast.success("Password changed successfully", {
        position: "top-center",
      });
      reset();
    }

    setIsLoadingChangePassword(false);
  };

  const password = watch("password", "");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
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

        <Controller
          name="confirm_password"
          control={control}
          defaultValue=""
          rules={{
            required: "Confirm Password is required",
            validate: (value) =>
              value === password || "The passwords do not match",
          }}
          render={({ field }) => (
            <InputGroup
              field={field}
              type="password"
              name="confirm_password"
              placeholder="Min. 8 Characters"
            />
          )}
        />
        <div
          className={`${
            errors.confirm_password ? "visible" : "invisible"
          } p-2 text-red-400`}
        >
          {errors.confirm_password && (
            <div>{`${errors.confirm_password.message}`}</div>
          )}
        </div>
        <Space />
        <SignInButton
          disabled={isLoadingChangePassword}
          color="light-blue"
          text="Change password"
        />
      </form>
    </FormProvider>
  );
};

export default PasswordReset;
