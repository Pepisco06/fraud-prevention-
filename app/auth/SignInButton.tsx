import { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";

type ButtonColorType = "light-blue" | "orange";

interface Props {
  onClick?: () => void;
  color: ButtonColorType;
  text: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const SignInButton = ({ onClick, disabled, color, text, icon }: Props) => {
  const btnColor: { [key in ButtonColorType]: string } = {
    "light-blue": "bg-blue-50 hover:bg-gray-200",
    orange: "bg-orange-400 hover:bg-orange-500 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${btnColor[color]} flex justify-center items-center gap-2
        w-full py-4 px-4 rounded-xl  select-none duration-300
        disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </button>
  );
};

export default SignInButton;
