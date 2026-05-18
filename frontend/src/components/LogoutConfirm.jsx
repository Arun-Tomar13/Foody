import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { AlertTriangle, LogOut } from "lucide-react";

const LogoutConfirm = ({ close, onConfirm }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "24px",
        border: "1px solid #f5dfc9",
      }}
    >
      <Grid container direction="column" spacing={3}>
        <Grid>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: "#fff7ed",
                color: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={24} />
            </Box>

            <Box>
              <Typography fontWeight={900} fontSize="1.1rem" color="#2f2926">
                Log out?
              </Typography>
              <Typography fontSize="0.88rem" color="#7b6b63">
                Are you sure you want to log out of your account?
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={close}
                sx={{
                  height: 48,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#fed7aa",
                  color: "#f97316",
                }}
              >
                Cancel
              </Button>
            </Grid>

            <Grid size={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LogOut size={18} />}
                onClick={onConfirm}
                sx={{
                  height: 48,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  background: "linear-gradient(135deg,#fb923c,#f97316)",
                  "&:hover": {
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                  },
                }}
              >
                Log out
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
          }}
        >
          <Typography fontSize="0.8rem" color="#9a3412" lineHeight={1.5}>
            You will need to sign in again to access your orders, cart, and
            wallet.
          </Typography>
        </Box>
      </Grid>
    </Paper>
  );
};

export default LogoutConfirm;
