import Space from "@/app/components/Space";
import { PropsWithChildren } from "react";

interface Props {
  heading: string;
}
const SettingsCard = ({ heading, children }: PropsWithChildren<Props>) => {
  return (
    <section className="border rounded-md">
      <header className="text-sm border border-blue-100 p-3 bg-neutral-200">
        {heading}
      </header>
      <Space />
      <section className="px-3 text-sm">{children}</section>
    </section>
  );
};

export default SettingsCard;
