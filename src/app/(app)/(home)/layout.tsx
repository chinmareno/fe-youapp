import React from "react";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="bg-[#09141A] h-screen w-screen pt-10">{children}</div>;
};

export default HomeLayout;
