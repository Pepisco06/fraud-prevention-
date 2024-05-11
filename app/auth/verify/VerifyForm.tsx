import verifyService from "@/app/services/verifyService";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import InputGroup from "../InputGroup";
import Space from "@/app/components/Space";
import SignInButton from "../SignInButton";

interface Props {
  oi: string;
}

const VerifyForm = ({ oi }: Props) => {
  const { control, handleSubmit } = useForm();
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);

  const onSubmitHandler = async (data: FieldValues) => {
    setIsLoadingVerify(true);

    const response = await verifyService.post(
      {
        code: data.code,
      },
      oi
    );

    if (response.error) {
      setIsLoadingVerify(false);
      return toast.error("Verification failed", {
        description: response.error.message,
        position: "top-center",
      });
    }

    setIsLoadingVerify(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Controller
        name="code"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputGroup id="code" field={field} name="code" defaultValue={""} />
        )}
      />

      <Space styles="my-2" />
      <div className="w-40">
        <SignInButton
          disabled={isLoadingVerify}
          color={"light-blue"}
          text={isLoadingVerify ? "Verifying..." : "Submit"}
        />
      </div>
    </form>
  );
};

export default VerifyForm;
