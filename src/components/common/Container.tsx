import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={`mx-auto w-full max-w-[1400px] ${className}`}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "clamp(32px, 7vw, 110px)",
        paddingRight: "clamp(32px, 7vw, 110px)",
      }}
    >
      {children}
    </div>
  );
};

export default Container;