import React from "react";

const EditLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="pt-10">{children}</div>;
};

export default EditLayout;
