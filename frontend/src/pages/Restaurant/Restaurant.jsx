import { Grid, Button, Switch, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import FormProvider from "../../components/FormProvider";
import * as yup from "yup";
import { Plus, UserPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextInput from "../../components/InputFields/TextInput";
import {
  // getRestaurantInfo,
  updateRestaurant,
  getRestaurantInfoById,
  changeRestaurantAvailability,
} from "../../store/slices/restaurantSlice";
import { useParams } from "react-router";
import CustomButton from "../../components/InputFields/CustomButton";
import AllCategories from "../../components/AllCategoriesForm";
import GetAllMenu from "./GetAllMenu";
import DialogBox from "../../components/InputFields/DialogBox";
import CreateRestaurantPage from "./CreateRestaurantPage";

const RestroOwner = () => {
  const schema = yup
    .object({
      name: yup
      .string()
      .typeError("name is required")
      .required("Name is required"),
      type: yup
        .string()
        .typeError("type is required")
        .oneOf(["veg", "non-veg", "both"])
        .required("select a type of hotel"),
      address: yup.string().typeError("address is required").required("address is required"),
      openingTime: yup.string().typeError("opening time is required").required("opening time is required"),
      closingTime: yup.string().typeError("closing time is required").required("closingTime is required"),
    })
    .required();

  const [readOnly, setReadOnly] = useState(true);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const [showCategory, setShowCategory] = useState(false);

  const { restaurant,loading } = useSelector((state) => state?.restaurant);
  const hasRestro = useSelector((state) => state?.restaurant?.hasRestro);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema), disabled: readOnly });

  useEffect(() => {
    const getRestaurantData = async () => {
      let r;

      if (params.id)
        r = await dispatch(getRestaurantInfoById({ id: params.id }));
      else r = await dispatch(getRestaurantInfoById({}));
      
    };
    getRestaurantData();
  }, []);

  useEffect(() => {
    if (!restaurant) return;
    reset(restaurant);
  }, [restaurant]);

  const { id } = useParams();

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async ({
    id,
    name,
    address,
    type,
    openingTime,
    closingTime,
  }) => {
    const payload = { id, name, address, type, openingTime, closingTime };

    const result = await dispatch(updateRestaurant(payload));

    setReadOnly((prev) => !prev);
  };

  return (
    <div>
      {hasRestro ? (
        <Grid container direction="column" spacing={3} alignItems="center">
          <Grid border={2} padding={1} borderRadius={5}  container justifyContent='center' alignItems='center' color={restaurant.isOpen ? "green" : "red"} >
             {restaurant.isOpen ? <span className="border py-1 px-2 rounded-pill border-success" >ON</span> : '' } 
            <Switch
              checked={!restaurant.isOpen}
              color={restaurant.isOpen ? "secondary" : "primary"}
              onChange={() => dispatch(changeRestaurantAvailability(restaurant.id))}
            />
            {!restaurant.isOpen ? <span className="border py-1 px-2 rounded-pill border-danger" >OFF</span> : '' }  
          </Grid>
          <Grid size={{ md: 12 }}>
            <FormProvider onSubmit={handleSubmit(onSubmit)}>
              <Grid container padding={2} spacing={2}>
                {/* Name field */}
                <Grid>
                  <TextInput
                    control={control}
                    name="name"
                    error={errors}
                    type="text"
                  />
                </Grid>

                {/* Address field */}
                <Grid>
                  <TextInput
                    control={control}
                    name="address"
                    type="text"
                    error={errors}
                  />
                </Grid>

                {/* Type field */}
                <Grid>
                  <TextInput
                    control={control}
                    name="type"
                    type="text"
                    error={errors}
                  />
                </Grid>

                {/* OpeningTime field */}
                <Grid>
                  <TextInput
                    control={control}
                    name="openingTime"
                    type="time"
                    error={errors}
                  />
                </Grid>

                {/* ClosingingTime field */}
                <Grid>
                  <TextInput
                    control={control}
                    name="closingTime"
                    type="time"
                    error={errors}
                  />
                </Grid>

                {/* ClosingingTime field */}
                <Grid>
                  {!readOnly && (
                    <CustomButton
                      color="green"
                      name="submit"
                      variant="outlined"
                    />
                  )}
                </Grid>

                {/* Toggle button for update */}
                <Grid>
                  <Button onClick={() => setReadOnly((prev) => !prev)}>
                    <UserPen />
                  </Button>
                </Grid>
              </Grid>
            </FormProvider>
          </Grid>

          <Grid container direction="column" spacing={2}>
            <Grid container>
              <Button
                onClick={() => setShowCategory(false)}
                className={`${!showCategory ? "text-secondary shadow bg-dark bg-opacity-10" : "text-black "}`}
              >
                Menu
              </Button>
              <Button
                onClick={() => setShowCategory(true)}
                className={`${showCategory ? "text-secondary shadow bg-dark bg-opacity-10" : "text-black "}`}
              >
                Category
              </Button>
            </Grid>

            {!showCategory ? (
              <GetAllMenu />
            ) : (
              <AllCategories id={id ? id : null} />
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid spacing={3} container direction='column' justifyContent='center' alignItems='center' >
          <video width='310px' src="/create_restaurant.mp4" autoPlay loop />
          Create Restaurant
          <Button
            variant="outlined"
            color="success"
            onClick={() => setOpen(true)}
          >
            <Plus /> Create
          </Button>
          <DialogBox
            open={open}
            onClose={handleClose}
            title="add Restaurant"
            component={<CreateRestaurantPage close={handleClose} />}
          />
        </Grid>
      )}
    </div>
  );
};

export default RestroOwner;
