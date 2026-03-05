import { Box, Grid } from "@mui/material";
import FormProvider from "../../components/FormProvider";
import * as yup from "yup";
import TextInput from "../../components/InputFields/TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Restro_type_Options } from "../../constant";
import AutoComplete from "../../components/InputFields/AutoComplete";
import CustomButton from "../../components/InputFields/CustomButton";
import { addRestaurant } from "../../store/slices/restaurantSlice";
import { useDispatch } from "react-redux";

const CreateRestaurantPage = ({close}) => {
  const schema = yup
    .object({
      name: yup.string().required("Name is required"),
      type: yup
        .string()
        .oneOf(["veg", "non-veg", "both"])
        .required("select a type of hotel"),
      address: yup.string().required("address a country"),
      openingTime: yup.string().required("openingTime a country"),
      closingTime: yup.string().required("closingTime a country"),
    })
    .required();

    const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    // console.log(data);

    const result  = await dispatch(addRestaurant(data))
    console.log('data',result);
    if(result.payload.success ) close()
    
  };

  return (
    <Box>
      <FormProvider onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction="column" padding={2} spacing={2}>
          {/* Name field */}
          <Grid>
            <TextInput
              control={control}
              name="name"
              type="text"
              error={errors}
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
            <AutoComplete
              control={control}
              name="type"
              options={Restro_type_Options}
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
            <CustomButton
              
                name="Register"
                color="blue"
                variant="outlined"
              />
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};

export default CreateRestaurantPage;
