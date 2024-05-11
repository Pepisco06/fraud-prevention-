import { PropsWithChildren } from "react";

interface Props {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  styles?: string;
  removeDefaultStyles?: boolean;
}

const Heading = ({
  variant,
  children,
  styles,
  removeDefaultStyles,
}: PropsWithChildren<Props>) => {
  switch (variant) {
    case "h1":
      return (
        <h1 className={`${styles} ${!removeDefaultStyles && "text-5xl"}`}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={`${styles} ${!removeDefaultStyles && "text-4xl"}`}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={`${styles} ${!removeDefaultStyles && "text-3xl"}`}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={`${styles} ${!removeDefaultStyles && "text-2xl"}`}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 className={`${styles} ${!removeDefaultStyles && "text-xl"}`}>
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 className={`${styles} ${!removeDefaultStyles && "text-lg"}`}>
          {children}
        </h6>
      );
  }
};

export default Heading;
