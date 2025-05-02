// lib/showToast.ts

import { toast } from "sonner";

type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface ToastProps {
  title?: string;
  description?: string;
  position?: ToastPosition;
}

export const showToast = ({
  title,
  description,
  position = "bottom-right",
}: ToastProps) => {
  toast(title ?? "Something went wrong, Please try again later", {
    description,
    position: position,
  });
};

export const handleFormError = ({
  setError,
  error,
}: {
  setError: any;
  error: any;
}) => {
  const responseData = error.response?.data;

  if (responseData?.errors) {
    // Laravel returns validation errors in "errors" object
    Object.entries(responseData.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        setError(field as any, {
          type: "server",
          message: messages[0], // Show the first error message
        });
      }
    });
  } else {
    showToast({ title: responseData?.message || "Registration failed" });
  }
};
