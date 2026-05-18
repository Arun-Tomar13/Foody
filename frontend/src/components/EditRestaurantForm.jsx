import { useEffect } from "react";
import { Button, CircularProgress, Grid, Switch } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormProvider from "./FormProvider";
import TextInput from "./InputFields/TextInput";
import {
  changeRestaurantAvailability,
  updateRestaurant,
} from "../store/slices/restaurantSlice";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    type: yup
      .string()
      .oneOf(["veg", "non-veg", "both"])
      .required("Select restaurant type"),
    address: yup.string().required("Address is required"),
    openingTime: yup.string().required("Opening time is required"),
    closingTime: yup.string().required("Closing time is required"),
  })
  .required();

const EditRestaurantForm = ({ close }) => {
  const dispatch = useDispatch();
  const { restaurant, loading } = useSelector((state) => state.restaurant);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!restaurant) return;
    reset(restaurant);
  }, [restaurant, reset]);

  const onSubmit = async ({
    id: restaurantId,
    name,
    address,
    type,
    openingTime,
    closingTime,
  }) => {
    const result = await dispatch(
      updateRestaurant({
        id: restaurantId,
        name,
        address,
        type,
        openingTime,
        closingTime,
      }),
    );

    if (result.payload?.success) close?.();
  };

  return (
    <div className="dialog-form-shell">
      <div className="restaurant-dialog-availability">
        <span
          className={`status-pill ${restaurant?.isOpen ? "open" : "closed"}`}
        >
          {restaurant?.isOpen ? "open" : "closed"}
        </span>
        <Switch
          checked={Boolean(restaurant?.isOpen)}
          disabled={!restaurant?.id}
          onChange={() =>
            dispatch(changeRestaurantAvailability(restaurant.id))
          }
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#16803c" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#16803c",
            },
          }}
        />
        <span className="foody-muted">Kitchen availability</span>
      </div>

      <FormProvider onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextInput control={control} name="name" error={errors} type="text" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextInput
              control={control}
              name="address"
              error={errors}
              type="text"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput control={control} name="type" error={errors} type="text" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextInput
              control={control}
              name="openingTime"
              error={errors}
              type="time"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextInput
              control={control}
              name="closingTime"
              error={errors}
              type="time"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className="dialog-form-actions">
            <Button variant="outlined" onClick={close} sx={{ borderRadius: "8px" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: "8px",
                backgroundColor: "#16803c",
                fontWeight: 850,
                "&:hover": { backgroundColor: "#14532d" },
              }}
            >
              {!loading ? (
                "Save changes"
              ) : (
                <>
                  <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                  Saving
                </>
              )}
            </Button>
            </div>
          </Grid>
        </Grid>
      </FormProvider>

    </div>
  );
};

export default EditRestaurantForm;
