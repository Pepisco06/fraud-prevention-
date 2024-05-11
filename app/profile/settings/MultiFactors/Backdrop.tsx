import { PropsWithChildren } from "react";

interface Props {
  closeHandler: () => void;
}

const Backdrop = ({ closeHandler, children }: PropsWithChildren<Props>) => {
  return (
    <div
      onClick={closeHandler}
      className="fixed top-0 bottom-0 right-0 left-0 bg-black/70 z-10"
    >
      {children}
    </div>
  );
};

export default Backdrop;
