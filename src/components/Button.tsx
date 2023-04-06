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
  const getTypeText = React.useCallback(() => {
    switch (type) {
      case ButtonType.Primary:
        return "bg-disc-blue text-white";
      case ButtonType.Secondary:
        return "bg-disc-blue/20 text-disc-blue";
      case ButtonType.Danger:
        return "bg-red-450 text-white";
      case ButtonType.Warning:
        return "bg-yellow-500 text-white";
      case ButtonType.Success:
        return "bg-green-500 text-white";
      case ButtonType.Info:
        return "bg-blue-500 text-white";
      default:
        return "bg-disc-blue text-white";
    }
  }, [type]);

  const getSizeText = React.useCallback(() => {
    switch (size) {
      case "xs":
        return "text-xs";
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      default:
        return "text-md";
    }
  }, [size]);

  const buttonClassName = React.useMemo(
    () => `px-2 py-1 rounded-md ${className} 
    ${getTypeText()} ${getSizeText()} 
    ${disabled ? "opacity-50 " : "hover:opacity-80"}`,
    [className, disabled, size, type]
  );

  const contentClassName = React.useMemo(
    () =>
      `flex items-center justify-center gap-2 text-inherit ${
        icon && iconPosition === "right" ? "flex-row-reverse" : "flex-row"
      }`,
    [icon, iconPosition]
  );

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
        {icon && <FontAwesomeIcon icon={icon} />}
        {children}
      </div>
    </button>
  );
};

export default Button;
