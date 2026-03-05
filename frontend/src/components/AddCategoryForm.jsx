import React, { useEffect } from "react";
import AFormProvider from "./FormProvider";
import { Box, Grid } from "@mui/material";
import * as yup from "yup";
import TextInput from "./InputFields/TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "./InputFields/CustomButton";
import { useDispatch } from "react-redux";

const AddCategoryForm = ({data,fn,close}) => {
  

  const schema = yup
      .object({
        name: yup.string().required("Name is required"),
        description: yup.string('description must be in string').required("description a req"),
      })
      .required();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) });
  
  useEffect(()=>{
    reset(data)
  },[])

  const onSubmit = async (data) => {
    console.log('data',data);

    const result=await dispatch(fn(data));
    console.log(result);
    

    if(result.payload.success){
      close();
  }
  };
  
  return (
    <Box padding={2}>
      <AFormProvider onSubmit={handleSubmit(onSubmit)}  >
        <Grid container spacing={2} direction='column' className='d-flex' >
          
          <Grid>
            <TextInput
              control={control}
              name="name"
              type="text"
              error={errors}
            />
          </Grid>

          <Grid>
            <TextInput
              control={control}
              name="description"
              type="text"
              error={errors}
            />
          </Grid>

           <Grid className='align-self-center' >
              <CustomButton
                name="Submit"
                color="sucess"
                variant="contained"
              />
            </Grid>

        </Grid>
      </AFormProvider>
    </Box>
  );
};

export default AddCategoryForm;
