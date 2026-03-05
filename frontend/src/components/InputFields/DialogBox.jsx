import { Dialog, DialogTitle, Grid } from "@mui/material";

const DialogBox = (props) => {
  const { onClose, open, title, component } = props;

  const handleClose = () => {
    onClose();
  };

  return (
      <Dialog onClose={handleClose} open={open} maxWidth>
        <DialogTitle>{title}</DialogTitle>
        {component}
      </Dialog>
  );
};

export default DialogBox;
