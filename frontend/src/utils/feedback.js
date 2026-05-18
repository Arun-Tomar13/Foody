import { toast } from "react-toastify";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";
const DEFAULT_SUCCESS_MESSAGE = "Updated successfully.";

const pickMessage = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || fallback;

  const candidates = [
    value.message,
    value.error,
    value.data?.message,
    value.response?.data?.message,
    value.response?.data?.error,
  ];

  const message = candidates.find((candidate) => {
    if (Array.isArray(candidate)) return candidate.length > 0;
    return typeof candidate === "string" && candidate.trim();
  });

  if (Array.isArray(message)) return message.filter(Boolean).join(", ");
  return message || fallback;
};

export const getFeedbackMessage = (
  value,
  fallback = DEFAULT_ERROR_MESSAGE,
) => pickMessage(value, fallback);

export const getApiErrorPayload = (error) => {
  const responseData = error?.response?.data;
  const message = getFeedbackMessage(error, DEFAULT_ERROR_MESSAGE);

  return {
    ...(typeof responseData === "object" && responseData ? responseData : {}),
    success: false,
    message,
    status: error?.response?.status,
  };
};

export const notifyError = (value, fallback = DEFAULT_ERROR_MESSAGE) => {
  const message = getFeedbackMessage(value, fallback);

  toast.error(message, {
    toastId: `error-${message}`,
  });
};

export const notifySuccess = (value, fallback = DEFAULT_SUCCESS_MESSAGE) => {
  const message = getFeedbackMessage(value, fallback);

  toast.success(message, {
    toastId: `success-${message}`,
  });
};
