import { Alert, AlertTitle, Button, Stack } from "@mui/material";
import type { ReactNode } from "react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export default function ErrorAlert({
  title = "Ocurrió un error",
  message,
  actionLabel,
  onAction,
  children,
}: ErrorAlertProps) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert
        severity="error"
        action={
          actionLabel && onAction ? (
            <Button color="inherit" size="small" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
        {children}
      </Alert>
    </Stack>
  );
}