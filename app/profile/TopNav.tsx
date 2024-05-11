"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface Props {
  links: { href: string; name: string }[];
}
const TopNav = ({ links }: Props) => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6">
      {links.map(({ href, name }) => (
        <Link
          key={name}
          href={href}
          className={`
          ${pathname === href ? "after:bg-orange-300" : ""}
          "after:content-[''] after:block after:h-1 after:rounded-md after:hover:bg-orange-300 border-transparent"`}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
};

export default TopNav;
