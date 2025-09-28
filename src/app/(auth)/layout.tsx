"use client";

import Navbar from "@/components/Navbar";
import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    const isAuthenticated = async () => {
      const { data } = await supabase.auth.getClaims();

      if (data) return router.push("/");
      setIsAuthenticating(false);
    };
    isAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isAuthenticating) {
    return <p className="pt-10">loading...</p>;
  }
  return (
    <div className="pt-10">
      <Navbar />
      {children}
    </div>
  );
};

export default AuthLayout;
