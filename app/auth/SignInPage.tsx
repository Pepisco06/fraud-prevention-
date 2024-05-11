"use client";

import SignInButton from "./SignInButton";
import { useEffect } from "react";
import SignInLocally from "./SignInLocally";
import HorizontalOr from "./HorizontalOr";
import { FcGoogle } from "react-icons/fc";
import Space from "../components/Space";
import useAuth from "./store/useAuth";
import Heading from "../components/Heading";

import { useRouter } from "next/navigation";
import { userInfoRoute } from "../my-routes";

const SignInPage = () => {
  const { signInWithGoogle, isAuthenticated } = useAuth();
  const router = useRouter();

  const { replace } = router;

  const handleSignInWithGoogle = () => {
    signInWithGoogle();
  };

  useEffect(() => {
    if (isAuthenticated) {
      replace(userInfoRoute);
    }
  }, [isAuthenticated, replace]);

  return (
    <section className="w-[40%]">
      <Heading variant="h3" styles="font-semibold">
        Sign In / Sign Up
      </Heading>
      <Space styles="my-2" />
      <p className="text-gray-500">Enter your email and password to sign in!</p>
      <Space />
      <SignInButton
        icon={<FcGoogle className="text-lg" />}
        text="Sign in with Google"
        color="light-blue"
        onClick={handleSignInWithGoogle}
      />
      <Space styles="my-12" />
      <HorizontalOr />
      <Space styles="my-12" />
      <SignInLocally />
    </section>
  );
};

export default SignInPage;
