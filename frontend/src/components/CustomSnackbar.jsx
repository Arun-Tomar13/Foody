import { Alert, Snackbar } from "@mui/material";

const CustomSnackbar = ({
  open,
  type = "info",
  variant = "filled",
  message,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={type} variant={variant} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
