import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  size?: "xs" | "sm" | "md" | "lg";
  icon?: IconDefinition;
  iconPosition?: "left" | "right";
  notEnterable?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  disabled,
  onClick,
  className,
  type,
  size,
  children,
  icon,
  iconPosition,
  notEnterable,
}) => {

  const buttonClassName = React.useMemo(() => `px-2 py-1 rounded-md ${className} ${
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
  } ${
    size === "xs" ? "text-xs" : size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-md"
  } ${disabled ? "opacity-50 " : "hover:opacity-80"}`, [className, disabled, size, type]);

  const contentClassName = React.useMemo(() => `flex items-center justify-center gap-2 text-inherit ${
    icon && iconPosition === "right" ? "flex-row-reverse" : "flex-row"
  }`, [icon, iconPosition]);

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={buttonClassName}
      onKeyDown={
        !notEnterable && onClick
          ? (e) => {
              if (e.key === "Enter") {
                onClick();
              }
            }
          : undefined
      }
    >
      <div className={contentClassName}>
        {icon && <FontAwesomeIcon icon={icon}/>}
        {children}
      </div>
    </button>
  );
};

export default Button;
