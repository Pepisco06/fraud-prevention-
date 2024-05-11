import InputGroup from "@/app/auth/InputGroup";
import useAuth from "@/app/auth/store/useAuth";
import Space from "@/app/components/Space";
import APIClient from "@/app/services/apiClient";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useModal from "../../store";
import { FactorType } from "@/app/api/users/[id]/[mfa]/addMFA";
import { useRouter } from "next/navigation";
import { userInfoRoute } from "@/app/my-routes";

interface Props {
  nextHandler?: (step: number) => void;
  email?: string;
  heading?: string;
  factor?: FactorType;
  code?: string;
}

const StepTwo = ({ nextHandler, email, heading, factor, code }: Props) => {
  const { control, getValues } = useForm();
  const { close } = useModal();
  const { userInfo, setUserInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <section>
      <ul>
        <li>
          {heading
            ? heading
            : "Please enter the OTP code sent to your email and verify before it expires."}
        </li>
      </ul>
      <Space />
      <Controller
        name="code"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputGroup
            autoComplete="off"
            field={field}
            name="code"
            placeholder="Enter the 6-digit code sent to your email"
          />
        )}
      />
      <Space />
      <div className="flex justify-between gap-4">
        {nextHandler && (
          <button
            type="button"
            onClick={() => {
              nextHandler(1);
            }}
            className="text-blue-600 hover:text-gray-500 duration-300"
          >
            Back
          </button>
        )}

        <div>
          {nextHandler && (
            <button
              type="button"
              onClick={close}
              className="text-blue-600 hover:text-gray-500 duration-300 mr-4"
            >
              Cancel
            </button>
          )}
          <button
            disabled={isLoading}
            className="text-blue-600 disabled:text-gray-500 hover:text-gray-500 duration-300 disabled:cursor-not-allowed"
            onClick={async () => {
              setIsLoading(true);

              let verifyService = new APIClient(
                `/users/${userInfo?.user._id}/two-step-verification/${
                  factor ? factor : "email"
                }/verify`
              );

              if (code) {
                verifyService = new APIClient(
                  `/users/verify/${factor ? factor : "email"}`
                );
              }

              const res = await verifyService.post({
                code: code || getValues("code"),
                email,
              });

              console.log("RESPONSE", res);

              if (res.error) {
                setIsLoading(false);
                return toast.error("Failed to verify", {
                  description: res.error.message,
                  position: "top-center",
                });
              }

              if (res.verified) {
                setUserInfo(res.user, res.agent);
                toast.success("Code verified", {
                  position: "top-center",
                });
                setIsLoading(false);
                if (nextHandler) nextHandler(2);
                if (!code) close();
                if (code) router.replace(userInfoRoute);
              } else {
                toast.error("Failed to verify code", {
                  description:
                    "Is either the code has expired or it's incorrect",
                  position: "top-center",
                });
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default StepTwo;
