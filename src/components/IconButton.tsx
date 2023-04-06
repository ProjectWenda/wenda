import * as React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconButtonProps {
  icon: IconDefinition;
  onClick: (() => void) | undefined;
  className?: string;
  disabled?: boolean;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7x"
    | "8xl"
    | "9xl";
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, className, size, disabled }) => {
  const baseClassName = React.useMemo(
    () => `cursor-pointer ${disabled ? `opacity-40` : ""} ${className}`,
    [className, disabled, size]
  );
  const computedClassName = React.useMemo(
    () => (size ? `text-${size} ${baseClassName}` : `${baseClassName}`),
    [baseClassName, size]
  );

  return (
    <FontAwesomeIcon
      icon={icon}
      className={computedClassName}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onClick != null ? (e) => e.key === "Enter" && onClick() : undefined}
    />
  );
};

export default IconButton;
