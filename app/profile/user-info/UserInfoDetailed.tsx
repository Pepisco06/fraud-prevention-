"use client";

import useAuth from "@/app/auth/store/useAuth";
import { ProfileType } from "@/app/libs/models/Profile";
import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import UserInfoForm from "./UserInfoForm";
import Space from "@/app/components/Space";
import userService from "@/app/services/userService";

const UserInfoDetailed = () => {
  const { userInfo } = useAuth();

  const [profile, setProfile] = useState<ProfileType | undefined>(
    {} as ProfileType
  );

  useEffect(() => {
    const init = async () => {
      const profileResponse = await userService.fetchOne(
        `/${userInfo?.user._id}/profile/${userInfo?.user.profile}`
      );
      setProfile(profileResponse);
    };

    init();
  }, [userInfo]);

  return (
    <>
      <UserInfo profile={profile} />
      <section className=" flex-grow">
        <UserInfoForm profile={profile} />
      </section>
      <Space />
    </>
  );
};

export default UserInfoDetailed;
