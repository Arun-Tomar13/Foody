import { Button, colors, Grid } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { addCartItem, deleteAllCartItem } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ChartItemChoice = ({ close, id }) => {
  const dispatch = useDispatch();
  const handleReplace = async () => {
    const emptyCart = await dispatch(deleteAllCartItem());
    if (emptyCart.payload.success) {
      const addItemToCart = await dispatch(addCartItem(id));
      if (addItemToCart.payload.success) {
        toast.success("item replace succesfully");
        close();
      }
    }
  };

  return (
    <Grid
      padding={4}
      spacing={2}
      container
      direction='column'
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        spacing={2}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid>
          <Button variant="contained" color="error" onClick={() => close()}>
            Discard
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" onClick={handleReplace}>
            Replace
          </Button>
        </Grid>
      </Grid>
      <Grid>
        <Grid color={colors.orange[400]} >Discard: don't add item to add</Grid>
        <Grid color={colors.orange[400]} >Replace: replace item from all item in cart</Grid>
      </Grid>
    </Grid>
  );
};

export default ChartItemChoice;
