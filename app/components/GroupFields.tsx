import { PropsWithChildren } from "react";

interface Props {
  into?: number;
}

const GroupFields = ({ into = 2, children }: PropsWithChildren<Props>) => {
  const group: { [key: number]: string } = {
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  return <div className={`grid gap-6 ${group[into]}`}>{children}</div>;
};

export default GroupFields;
