import { Button, colors } from "@mui/material";
import { Controller } from "react-hook-form"

function CustomButton({ name, color, variant }) {
  return (
    // <Controller
    //   name={name}
    //   control={control}
    //   defaultValue=""
    //   render={({ field }) => (
        <Button colors={color} variant={variant} type="Submit">
          {name}
        </Button>
      // )}
    // />
  );
}

export default CustomButton;
