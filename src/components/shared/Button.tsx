import React from "react";
import { BUTTON_VARIANTS, PADDING, ROUNDED, SHADOW } from "../design";

interface ButtonProps {
  variant?: "solid" | "outline";
  type?: "button" | "submit" | "reset" | undefined;
  tabIndex?: number;
  border?: string;
  color?: string;
  children?: React.ReactNode;
  height?: string;
  onClick?: () => void;
  radius?: string;
  width?: string;
  className?: string;
  withShadow?: boolean;
  disabled?: boolean;
}

const Button = ({
  variant,
  color,
  width,
  height,
  border,
  radius,
  className,
  children,
  tabIndex,
  type,
  onClick,
  disabled,
  withShadow,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={
        (variant === "solid"
          ? BUTTON_VARIANTS.solid
          : variant === "outline"
          ? BUTTON_VARIANTS.outline
          : className) +
        (withShadow ? " " + SHADOW : "") +
        (className ? className : ` ${PADDING} ${ROUNDED} `)
      }
      onClick={onClick}
      tabIndex={tabIndex}
      disabled={disabled}
      style={{
        backgroundColor: color,
        border,
        borderRadius: radius,
        height,
        width,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
