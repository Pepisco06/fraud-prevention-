import InputGroup from "@/app/auth/InputGroup";
import useAuth from "@/app/auth/store/useAuth";
import Space from "@/app/components/Space";
import generateService from "@/app/services/generateService";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useModal from "../../store";

interface Props {
  nextHandler: (step: number) => void;
  setEmail: (email: string) => void;
}

const StepOne = ({ nextHandler, setEmail }: Props) => {
  const { control, getValues } = useForm();
  const { close } = useModal();
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section>
      <ul>
        <li>
          We will use this email to help you sign in and to alert you if there’s
          unusual activity in your account.
        </li>
      </ul>
      <Space />
      <form>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <InputGroup
              field={field}
              name="email"
              placeholder="khem@khemshield.com"
            />
          )}
        />
        <Space />
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={close}
            className="text-blue-600  hover:text-gray-500 duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="text-blue-600 disabled:text-gray-500 hover:text-gray-500 duration-300 disabled:cursor-not-allowed"
            onClick={async () => {
              setIsLoading(true);

              const res = await generateService(userInfo?.user._id || "").post({
                email: getValues("email"),
              });

              if (res.error) {
                toast.error("Failed to send", {
                  description: res.error.message,
                  position: "top-center",
                });

                setIsLoading(false);
              }

              if (res.message) {
                toast.message("Email sent", {
                  description: res.message,
                  position: "top-center",
                });
                setIsLoading(false);
                setEmail(getValues("email"));
                nextHandler(2);
              }
            }}
          >
            {isLoading ? "Loading..." : "Next"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default StepOne;
