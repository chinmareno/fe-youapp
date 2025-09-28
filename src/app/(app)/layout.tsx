"use client";

import Navbar from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSupabaseClient } from "@/lib/supabase";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [username, setUsername] = useState("user");

  const router = useRouter();

  const pathname = usePathname();
  const isUsernameVisible = pathname !== "/edit/interest";
  const supabase = createSupabaseClient();

  useEffect(() => {
    const isAuthenticated = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");
      const userEmail = data.user?.email;
      const { data: profileData } = await supabase
        .from("profile")
        .select("username")
        .eq("email", userEmail)
        .single();
      setUsername(profileData?.username || "user");
      setIsAuthenticating(false);
    };
    isAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAuthenticating) {
    return <p className="pt-10">loading...</p>;
  }
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar isUsernameVisible={isUsernameVisible} username={"@" + username} />
      {children}
    </QueryClientProvider>
  );
};

export default AppLayout;
