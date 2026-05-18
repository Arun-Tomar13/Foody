import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
} from "@mui/material";

import { X } from "lucide-react";

const DialogBox = ({
  onClose,
  open,
  title,
  component,
  maxWidth = "sm",
  fullWidth = true,
  showTitle = true,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          sx: {
            position: "relative",
            overflow: "hidden",

            borderRadius: "30px",

            background:
              "rgba(255,255,255,0.92)",

            backdropFilter:
              "blur(18px)",

            border:
              "1px solid #f5dfc9",

            boxShadow:
              "0 28px 70px rgba(249,115,22,0.14)",

            width: "100%",

            maxWidth:
              maxWidth === "lg"
                ? 920
                : maxWidth === "md"
                  ? 720
                  : maxWidth === "sm"
                    ? 520
                    : undefined,
          },
        },
      }}
    >
      {/* BG GLOW */}
      <Box
        sx={{
          position: "absolute",

          width: 220,
          height: 220,

          borderRadius: "50%",

          background:
            "rgba(249,115,22,0.08)",

          top: -90,
          right: -90,

          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      {showTitle && (
        <DialogTitle
          sx={{
            position: "relative",

            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",

            gap: 2,

            px: 3,
            pt: 3,
            pb: 1,

            fontWeight: 900,
            fontSize: "1.18rem",

            color: "#251814",
          }}
        >
          <span>{title}</span>

          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              width: 38,
              height: 38,

              borderRadius: "12px",

              background:
                "#fff7ed",

              border:
                "1px solid #fed7aa",

              color: "#f97316",

              transition:
                "all 0.22s ease",

              "&:hover": {
                background:
                  "#ffedd5",

                transform:
                  "rotate(90deg)",
              },
            }}
          >
            <X size={18} />
          </IconButton>
        </DialogTitle>
      )}

      {/* CONTENT */}
      <DialogContent
        sx={{
          position: "relative",

          px: {
            xs: 2,
            sm: 3,
          },

          pb: 3,

          pt: showTitle ? 1 : 3,
        }}
      >
        {component}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;