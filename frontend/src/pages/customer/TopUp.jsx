import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from 'react-redux';
import { topUp } from "../../store/slices/transactionSlice";
import FormProvider from "../../components/FormProvider";
import TextInput from "../../components/InputFields/TextInput";
import CustomButton from "../../components/InputFields/CustomButton";

const TopUp = ({close}) => {

    const schema = yup
      .object({
        amount: yup.string('enter a amount').required("amount is required"),
      })
      .required();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {

    const result= await dispatch(topUp(data));
    console.log("result",result);
    

    if(result.payload.success){
      close();
  }
  };

  return (
    <Box padding={2}>
      <FormProvider onSubmit={handleSubmit(onSubmit)}  >
        <Grid container spacing={2} direction='column' className='d-flex' >
          
          <Grid>
            <TextInput
              control={control}
              name="amount"
              type="number"
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
      </FormProvider>
    </Box>
  )
}

export default TopUp