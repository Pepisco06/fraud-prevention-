"use client";

import useAuth from "@/app/auth/store/useAuth";
import Space from "@/app/components/Space";
import APIClient from "@/app/services/apiClient";
import { useEffect, useState } from "react";
import Image from "next/image";
import generateService from "@/app/services/generateService";
import useModal from "../../store";

interface Props {
  nextHandler: (step: number) => void;
}

const AuthAppStepOne = ({ nextHandler }: Props) => {
  const { userInfo } = useAuth();
  const [dataURL, setDataURL] = useState<string | undefined>(undefined);
  const { close } = useModal();

  useEffect(() => {
    const init = async () => {
      const res = await generateService(
        userInfo?.user._id || "",
        "authenticator"
      ).post({});

      setDataURL(res.dataURL || "");
    };

    init();
  }, [userInfo]);

  return (
    <section>
      <ul>
        <li className="ml-2 my-2">
          Download google authenticator or any other authenticator app
        </li>

        <li className="ml-2 my-2">
          In the authenticator app tap the plus icon or similar button
        </li>

        <li className="ml-2 my-2">Choose scan a QR code</li>
      </ul>
      <Space />
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-[150px] w-[150px] flex items-center justify-center">
            {dataURL ? (
              <Image alt={""} width={150} height={150} src={dataURL} />
            ) : (
              <p>Generating QR ...</p>
            )}
          </div>

          <p>Use your authenticator app to scan the QR Code and click Next</p>
        </div>
      </div>
      <Space />
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={close}
          className="text-blue-600 hover:text-gray-500 duration-300"
        >
          Cancel
        </button>
        <button
          type="button"
          className="text-blue-600 hover:text-gray-500 duration-300 disabled:cursor-not-allowed"
          onClick={() => nextHandler(2)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AuthAppStepOne;
