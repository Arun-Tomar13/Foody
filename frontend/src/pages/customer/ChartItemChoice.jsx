import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";

import React from "react";

import { useDispatch } from "react-redux";

import {
  addCartItem,
  deleteAllCartItem,
} from "../../store/slices/cartSlice";

import {
  AlertTriangle,
} from "lucide-react";

const ChartItemChoice = ({
  close,
  id,
}) => {
  const dispatch = useDispatch();

  const handleReplace =
    async () => {
      const emptyCart =
        await dispatch(
          deleteAllCartItem(),
        );

      if (
        emptyCart.payload?.success
      ) {
        const addItemToCart =
          await dispatch(
            addCartItem(id),
          );

        if (
          addItemToCart.payload
            ?.success
        ) {
          close();
        }
      }
    };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "24px",
        border:
          "1px solid #f5dfc9",
      }}
    >
      <Grid
        container
        direction="column"
        spacing={3}
      >
        {/* ICON + TEXT */}
        <Grid>
          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius:
                  "16px",
                background:
                  "#fff7ed",
                color:
                  "#f97316",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              <AlertTriangle
                size={24}
              />
            </Box>

            <Box>
              <Typography
                fontWeight={900}
                fontSize="1.1rem"
                color="#2f2926"
              >
                Replace Cart?
              </Typography>

              <Typography
                fontSize="0.88rem"
                color="#7b6b63"
              >
                Your cart contains
                items from another
                restaurant.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* ACTIONS */}
        <Grid>
          <Grid
            container
            spacing={2}
          >
            <Grid size={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={close}
                sx={{
                  height: 48,
                  borderRadius:
                    "14px",
                  textTransform:
                    "none",
                  fontWeight: 700,
                  borderColor:
                    "#fed7aa",
                  color:
                    "#f97316",
                }}
              >
                Cancel
              </Button>
            </Grid>

            <Grid size={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={
                  handleReplace
                }
                sx={{
                  height: 48,
                  borderRadius:
                    "14px",
                  textTransform:
                    "none",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg,#fb923c,#f97316)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#f97316,#ea580c)",
                  },
                }}
              >
                Replace
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Box
  sx={{
    mt: 1.5,
    p: 1.5,
    borderRadius: "12px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
  }}
>
  <Typography
    fontSize="0.8rem"
    color="#9a3412"
    lineHeight={1.5}
  >
    Replacing will remove all current
    cart items and add the new item
    from this restaurant.
  </Typography>
</Box>
      </Grid>
    </Paper>
  );
};

export default ChartItemChoice;
