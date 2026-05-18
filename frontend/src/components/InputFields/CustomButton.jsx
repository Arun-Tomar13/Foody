import { Button } from "@mui/material";

function CustomButton({
  name,
  color = "primary",
  variant = "contained",
  type = "submit",
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  sx = {},
  onClick,
}) {
  return (
    <Button
      type={type}
      color={color}
      variant={variant}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      sx={{
        minHeight: 48,
        px: 3,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 800,
        fontSize: "0.95rem",
        transition: "all 0.25s ease",

        ...(variant ===
          "contained" && {
          background:
            "linear-gradient(135deg,#fb923c,#f97316)",
          boxShadow:
            "0 14px 30px rgba(249,115,22,0.22)",

          "&:hover": {
            background:
              "linear-gradient(135deg,#f97316,#ea580c)",
            transform:
              "translateY(-2px)",
          },
        }),

        ...(variant ===
          "outlined" && {
          borderColor: "#fed7aa",
          color: "#f97316",
          background:
            "#fff7ed",

          "&:hover": {
            borderColor:
              "#fb923c",
            background:
              "#ffedd5",
          },
        }),

        ...sx,
      }}
    >
      {loading
        ? "Loading..."
        : name}
    </Button>
  );
}

export default CustomButton;