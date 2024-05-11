import useModal from "../store";
import AuthenticatorMultiFactor from "./AuthenticatorMultiFactor/AuthenticatorMultiFactor";
import Backdrop from "./Backdrop";
import EmailMultiFactor from "./EmailMultiFactor/EmailMultiFactor";

interface Props {
  method: string;
}
const MultiFactorDialog = ({ method }: Props) => {
  const { close } = useModal();

  return (
    <>
      <Backdrop closeHandler={close}>
        <section
          onClick={(e) => e.stopPropagation()}
          className="w-[70%] m-auto rounded-lg p-4 bg-white z-20 absolute 
          top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
        >
          {method === "email" ? (
            <EmailMultiFactor />
          ) : (
            <AuthenticatorMultiFactor />
          )}
        </section>
      </Backdrop>
    </>
  );
};

export default MultiFactorDialog;
