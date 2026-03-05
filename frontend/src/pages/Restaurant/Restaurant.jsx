import { Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import FormProvider from "../../components/FormProvider";
import * as yup from "yup";
import { UserPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextInput from "../../components/InputFields/TextInput";
import {
  // getRestaurantInfo,
  updateRestaurant,
  getRestaurantInfoById,
} from "../../store/slices/restaurantSlice";
import { useParams } from "react-router";
import CustomButton from "../../components/InputFields/CustomButton";
import AllCategories from "../../components/AllCategoriesForm";
import GetAllMenu from "./GetAllMenu";

const RestroOwner = () => {
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

  const [readOnly, setReadOnly] = useState(true);
  const dispatch = useDispatch();
  const params = useParams();
  const [showCategory,setShowCategory] = useState(false)

  const {restaurant} = useSelector((state)=>state?.restaurant)
  
  const {
    control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({ resolver: yupResolver(schema), disabled: readOnly });
    
    // useEffect(()=>{reset(restaurant)},[restaurant])
    
    useEffect(() => {
      const getRestaurantData = async () => {
        const r=  await dispatch(getRestaurantInfoById(params.id));
        console.log(r);
        
  };
    getRestaurantData()
  }, []);

  useEffect(()=>{
    if(!restaurant) return;
    reset(restaurant)
  },[restaurant])

  const {id} = useParams()

  const onSubmit = async ({
    name,
    address,
    type,
    openingTime,
    closingTime,
  }) => {

    const payload = { id,name, address, type, openingTime, closingTime };

    const result = await dispatch(updateRestaurant(payload));
    
    setReadOnly((prev) => !prev);
  };

  return (
    <Grid className='d-flex flex-column gap-3' >
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
                type="text"
                error={errors}
              />
            </Grid>

            {/* ClosingingTime field */}
            <Grid>
              <TextInput
                control={control}
                name="closingTime"
                type="text"
                error={errors}
              />
            </Grid>

            {/* ClosingingTime field */}
            <Grid>
              {!readOnly && (
                <CustomButton color="green" name="submit" variant="outlined" />
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

      <Grid container direction='column' spacing={2} >
        <Grid container >
          <Button onClick={()=>setShowCategory(false)}  className={`${!showCategory ? 'text-secondary shadow bg-dark bg-opacity-10' : 'text-black '}`} >Menu</Button>
          <Button onClick={()=>setShowCategory(true)} className={`${showCategory ? 'text-secondary shadow bg-dark bg-opacity-10' : 'text-black '}`} >Category</Button>
        </Grid>

       { showCategory ? <AllCategories id={params.id}/> : <GetAllMenu/> }
      </Grid>

    </Grid>
  );
};

export default RestroOwner;
