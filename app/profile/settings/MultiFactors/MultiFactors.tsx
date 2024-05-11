"use client";

import useAuth from "@/app/auth/store/useAuth";
import mfsMethodService, {
  MFAMethodType,
  SupportMFAType,
} from "@/app/services/mfsMethodService";
import { useEffect, useState } from "react";
import { MdOutlineMailLock, MdOutlineQrCodeScanner } from "react-icons/md";
import useModal from "../store";
import MultiFactor from "./MultiFactor";
import MultiFactorDialog from "./MultiFactorDialog";
import supportMfsMethodService from "@/app/services/mfsMethodService";

const MultiFactors = () => {
  const [supportedMethods, setSupportedMethods] = useState<SupportMFAType[]>();
  // const [userMFAMethods, setUserMFAMethods] = useState<SupportMFAType[]>();
  const { userInfo } = useAuth();
  const { isOpen, open } = useModal();
  const [factorMethod, setFactorMethod] = useState("");

  useEffect(() => {
    const init = async () => {
      const mfs =
        (await supportMfsMethodService.fetchMany()) as SupportMFAType[];
      setSupportedMethods(mfs);
    };

    init();
  }, []);

  const handleOpen = (method: string) => {
    setFactorMethod(method);
    open();
  };

  console.log("UserINFO", userInfo);
  console.log(
    userInfo?.user.mfamethods?.map(({ method: usermethod }) => usermethod)
  );

  const methods =
    supportedMethods &&
    supportedMethods.map(({ method }, index) => {
      return {
        method,
        icon:
          method === "authenticator" ? (
            <MdOutlineQrCodeScanner size={32} />
          ) : method === "email" ? (
            <MdOutlineMailLock size={32} />
          ) : null,
        // This checks if user has ac
        message: userInfo?.user.mfamethods?.[index]
          ? userInfo?.user.mfamethods?.[index].option[method].message
          : `Add ${method} method`,
        // added:
        //   userInfo?.user.mfamethods?.some(
        //     ({ method: userMethod }) => userMethod.method === method
        //   ) || false,
        added:
          userInfo?.user.mfamethods?.some(
            ({ method: userMethod }) => userMethod.method === method
          ) || false,
      };
    });

  if (methods)
    return (
      <>
        {isOpen && <MultiFactorDialog method={factorMethod} />}
        <ul>
          {methods.map((mfamethod) => (
            <MultiFactor
              key={mfamethod.method}
              factor={mfamethod}
              open={handleOpen}
            />
          ))}
        </ul>
      </>
    );
};

export default MultiFactors;
