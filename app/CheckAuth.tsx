"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./auth/store/useAuth";

const CheckAuth = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return router.replace("/");
  }, [isAuthenticated, router]);
  return <></>;
};

export default CheckAuth;
