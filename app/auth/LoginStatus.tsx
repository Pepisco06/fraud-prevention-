"use client";

import Link from "next/link";
import useAuth from "./store/useAuth";

const LoginStatus = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? (
        <Link
          href="/profile/user-info"
          className="hover:border border-gray-100 rounded-md p-2 duration-300"
        >
          Profile
        </Link>
      ) : (
        <Link href="/auth">Login</Link>
      )}
    </>
  );
};

export default LoginStatus;
