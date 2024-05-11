import { useEffect } from "react";
import useAuth from "./store/useAuth";
import { useRouter } from "next/navigation";

const SignOutPage = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    signOut();
    router.replace("/admin/default");
  }, [router, signOut]);

  return <></>;
};

export default SignOutPage;
