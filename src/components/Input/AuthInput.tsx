import { Input } from "../ui/input";
import type { InputHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const AuthInput = ({ className, ...props }: AuthInputProps) => {
  return (
    <Input
      className={`bg-[#22373C] p-4 w-full rounded-md ${className ?? ""}`}
      {...props}
    />
  );
};

export default AuthInput;
