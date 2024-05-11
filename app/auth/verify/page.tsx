"use client";

import Heading from "@/app/components/Heading";
import Space from "@/app/components/Space";
import VerifyForm from "./VerifyForm";

interface Props {
  searchParams: { oi: string };
}
const page = ({ searchParams }: Props) => {
  // const [tokenInfo, setTokenInfo] = useState<TokenType>();

  // useEffect(() => {
  //   const init = async () => {
  //     // const tokenInfo = await tokenService.fetchOne(searchParams.oi);
  //     // console.log("tokenInfo", tokenInfo);
  //     // setTokenInfo(tokenInfo);
  //   };

  //   init();
  // }, [tokenInfo]);

  return (
    <section className="w-1/2 m-auto">
      <Heading variant="h3" styles="font-semibold">
        Let&apos;s get your account secured
      </Heading>
      <Space styles="my-2" />
      <p className="text-sm text-gray-400">
        To keep your account secure we need to verify that it was you that is
        trying to login from a different address. Enter the code sent to your
        email
      </p>
      <VerifyForm oi={searchParams.oi} />
    </section>
  );
};

export default page;
