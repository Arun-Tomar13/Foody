import { Alert, Snackbar } from "@mui/material";

const CustomSnackbar = ({open,type,variant,message, props={}}) => {
  return (
    <Snackbar open={open} autoHideDuration={2000}>
      <Alert severity={type} variant={variant}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
