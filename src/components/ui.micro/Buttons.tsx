import { Button, ButtonProps } from "@mui/material";
import React from "react";

interface PrimaryButtonProps extends ButtonProps {
    children: React.ReactNode;
    onClick?: () => void; // Ensure onClick is optional and has no parameters
    css?: any;
  }

function PrimaryButton({
  children,
  onClick,
  css,
  ...rest
}: PrimaryButtonProps) {
  return (
    <Button
      variant={"contained"}
      onClick={onClick}
      sx={{ borderRadius: 50, ...css }}
      {...rest}
    >
      {children}
    </Button>
  );
}

interface OutlineButtonProps extends ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  css?: React.CSSProperties;
}

function OutlineButton({
  children,
  onClick,
  css,
  ...rest
}: OutlineButtonProps) {
  return (
    <Button
      variant={"outlined"}
      onClick={onClick}
      sx={{ borderRadius: 50 }}
      {...rest}
    >
      {children}
    </Button>
  );
}

export { PrimaryButton, OutlineButton };
