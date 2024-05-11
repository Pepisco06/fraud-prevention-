"use client";

import InputGroup from "@/app/auth/InputGroup";
import SignInButton from "@/app/auth/SignInButton";
import useAuth from "@/app/auth/store/useAuth";
import GroupFields from "@/app/components/GroupFields";
import Space from "@/app/components/Space";
import { ProfileType } from "@/app/libs/models/Profile";
import userService from "@/app/services/userService";
import { useState } from "react";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

interface Props {
  profile?: ProfileType;
}
const UserInfoForm = ({ profile }: Props) => {
  const methods = useForm();
  const { userInfo } = useAuth();
  const { handleSubmit, control } = methods;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (data: FieldValues) => {
    setIsLoading(true);
    const userResponse = await userService.put(
      {
        firstName: data.first_name,
        lastName: data.last_name,
      },
      `${userInfo?.user._id}/profile`
    );

    if (userResponse.user) {
      toast.success("Profile updated!", { position: "top-center" });
    }

    if (userResponse.error) {
      toast.error("Fail to update profile", { position: "top-center" });
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <GroupFields>
          <Controller
            name="first_name"
            control={control}
            defaultValue={profile?.firstName || ""}
            render={({ field }) => (
              <InputGroup
                field={field}
                name="first_name"
                placeholder={profile?.firstName || ""}
              />
            )}
          />

          <Controller
            name="last_name"
            control={control}
            defaultValue={profile?.lastName || ""}
            render={({ field }) => (
              <InputGroup
                field={field}
                name="last_name"
                placeholder={profile?.lastName || ""}
              />
            )}
          />
        </GroupFields>
        <Space />
        <InputGroup
          disabled={true}
          name="email"
          defaultValue=""
          placeholder={userInfo?.user.email}
        />
        <Space />
        <div className="w-40">
          <SignInButton
            disabled={isLoading}
            color="light-blue"
            text={isLoading ? "Updating..." : "Update Profile"}
          />
        </div>
        <Space />
      </form>
    </FormProvider>
  );
};

export default UserInfoForm;
