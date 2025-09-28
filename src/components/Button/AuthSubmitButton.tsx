import { ButtonHTMLAttributes } from "react";

const AuthSubmitButton = ({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`bg-gradient-to-r cursor-pointer rounded-md py-2.5  from-[#61CCCA] to-[#4498DA] shadow-xl shadow-[#61CCCA]/40 disabled:shadow-none disabled:opacity-30 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default AuthSubmitButton;
