import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import { PropsWithChildren } from "react";
import Space from "../components/Space";

const AuthPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="py-10 px-20">
      <Space styles="my-20" />
      {children}
    </main>
  );
};

export default AuthPageLayout;
