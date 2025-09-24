"use client";

import BackButton from "./BackButton";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isUsernameVisible?: boolean;
}

const Navbar = ({ isUsernameVisible = false }: NavbarProps) => {
  const router = useRouter();

  return (
    <nav className="fixed font-medium w-full top-2 left-0 flex justify-between">
      <div className="w-1/3">
        <BackButton onClick={() => router.back()} />
      </div>
      <div className="w-1/3 place-self-center text-center">
        {isUsernameVisible && <p>@johndoe</p>}
      </div>
      <div className="w-1/3 text-right" />
    </nav>
  );
};

export default Navbar;
