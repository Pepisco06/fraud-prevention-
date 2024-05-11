import Link from "next/link";
import Heading from "../components/Heading";
import Space from "../components/Space";
import { PropsWithChildren } from "react";
import TopNav from "./TopNav";
import CheckAuth from "../CheckAuth";

const links = [
  { href: "/profile/user-info", name: "User Info" },
  { href: "/profile/settings", name: "Security" },
];
const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <CheckAuth />
      <Heading variant={"h2"}>Edit Profile</Heading>
      <Space />
      <TopNav links={links} />
      <Space />
      {children}
    </div>
  );
};

export default layout;
