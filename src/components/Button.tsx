import * as React from "react";

export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Warning = "warning",
  Success = "success",
  Info = "info",
}

type ButtonProps = React.PropsWithChildren & {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: ButtonType;
  size?: "sm" | "md" | "lg";
};

const Button: React.FC<ButtonProps> = ({ disabled, onClick, className, type, size, children }) => {
  const buttonClassName = `px-2 py-1 rounded-md ${className} ${
    type === ButtonType.Primary
      ? "bg-disc-blue text-white"
      : type === ButtonType.Secondary
      ? "bg-disc-blue/20 text-disc-blue"
      : type === ButtonType.Danger
      ? "bg-red-450 text-white"
      : type === ButtonType.Warning
      ? "bg-yellow-500 text-white"
      : type === ButtonType.Success
      ? "bg-green-500 text-white"
      : type === ButtonType.Info
      ? "bg-blue-500 text-white"
      : "bg-disc-blue text-white"
  } ${size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-md"}`;

  return (
    <button disabled={disabled} onClick={onClick} className={buttonClassName}>
      {children}
    </button>
  );
};

export default Button;
