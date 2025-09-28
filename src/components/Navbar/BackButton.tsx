import { ChevronLeft } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
