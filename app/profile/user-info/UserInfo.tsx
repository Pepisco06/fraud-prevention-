"use client";

import SignInButton from "@/app/auth/SignInButton";
import useAuth from "@/app/auth/store/useAuth";
import Heading from "@/app/components/Heading";
import Space from "@/app/components/Space";
import { ProfileType } from "@/app/libs/models/Profile";
import userService from "@/app/services/userService";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  profile?: ProfileType;
}
const UserInfo = ({ profile }: Props) => {
  const { userInfo } = useAuth();

  return (
    <section className="w-[30%] bg-white rounded-md text-center py-4">
      <header>
        <Heading variant="h4" styles="text-gray-500">
          {profile?.firstName || "Khem"}
        </Heading>
        <p className="text-xs">{userInfo?.user.email}</p>
      </header>
      <Space />
      <section>
        <Image
          src={"/images/profile-placeholder.jpg"}
          alt={""}
          width={100}
          height={100}
          className="rounded-full m-auto"
        />

        <Space />

        <div className="w-[90%] m-auto">
          <SignInButton color="light-blue" text="Upload new avatar" />
        </div>

        <Space />

        <section>
          <Heading variant="h6" styles="text-gray-500 text-xs">
            Last Login:
          </Heading>

          <Space />

          <div className="w-[90%] m-auto border border-green-50 bg-green-100 text-green-800 rounded-md p-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <p>City: Kastina</p>
              <p>Country: Nigeria</p>
              <p>
                OS: {userInfo?.agent.os.name + " " + userInfo?.agent.os.version}
              </p>
              <p>Org: MTN</p>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default UserInfo;
