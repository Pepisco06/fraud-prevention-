import { InputHTMLAttributes, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import capitalize from "../libs/utils/capitalize";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  field?: ControllerRenderProps<FieldValues, any>;
  defaultValue?: string;
}

const InputGroup = ({ defaultValue, field, ...rest }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={rest.name} className="block my-2 text-sm">
        {capitalize(rest.name?.split("_").join(" ") || "")}
        {rest.required && <span className="text-orange-600">*</span>}
      </label>
      <div className="relative">
        <input
          {...field}
          value={defaultValue}
          {...rest}
          type={
            rest.type === "password"
              ? showPassword
                ? "text"
                : "password"
              : rest.type
          }
          className="w-full py-3 px-4 pr-12 rounded-xl border border-gray-200 
           focus:outline-none text-sm"
        />
        {rest.type === "password" && (
          <span
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="text-gray-300 absolute top-[50%] -translate-y-[50%] right-4 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
