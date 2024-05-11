"use client";

import { ReactNode } from "react";
import { BiChevronRight } from "react-icons/bi";
import { GrStatusGood, GrStatusWarning } from "react-icons/gr";

type MultiFactorType = {
  icon: ReactNode;
  method: string;
  message: string;
  added: boolean;
};

interface Props {
  factor: MultiFactorType;
  open: (method: string) => void;
}

const MultiFactor = ({ factor, open }: Props) => {
  return (
    <>
      <li
        onClick={() => open(factor.method)}
        className="rounded-md my-6 hover:bg-gray-300 duration-300 flex items-center px-8 py-3 justify-between"
      >
        <div className="flex items-center gap-2 w-[40%]">
          {factor.icon}
          <span>{factor.method}</span>
        </div>
        <div className="text-xl flex items-center gap-2 flex-grow justify-start">
          {factor.added ? (
            <GrStatusGood className="text-green-400 " />
          ) : (
            <GrStatusWarning className="text-orange-300 " />
          )}
          <span className="text-sm">{factor.message}</span>
        </div>
        <BiChevronRight size={28} className="text-gray-500" />
      </li>
    </>
  );
};

export default MultiFactor;
