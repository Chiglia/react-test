import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  onclick: () => void;
}

function Button({ children, onclick, color = "primary" }: Props) {
  return (
    <button className={"btn btn-" + color} onClick={onclick}>
      {children}
    </button>
  );
}

export default Button;
