import { ChevronLeft } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const BackButton = ({ className, ...props }: BackButtonProps) => {
  return (
    <button className={`flex ${className}`} {...props}>
      <ChevronLeft />
      Back
    </button>
  );
};

export default BackButton;
