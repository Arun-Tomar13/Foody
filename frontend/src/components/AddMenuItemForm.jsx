import React, { useEffect } from "react";
import AFormProvider from "./FormProvider";
import { Box, FormControl, Grid, Input, Switch, TextField } from "@mui/material";
import * as yup from "yup";
import TextInput from "../components/InputFields/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { food_type_Options } from "../constant";
import AutoComplete from "../components/InputFields/AutoComplete";
import CustomButton from "../components/InputFields/CustomButton";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ShowError from "./ShowError";
import {  useParams } from "react-router"

const AddMenuItemForm = ({forAdd, data, fn, close }) => {

  const schema = yup
    .object({
      name: yup.string().required("Name is required"),
      // image: yup.string().required("image is required"),
      type: yup
        .string()
        .oneOf(["veg", "non-veg"])
        .required("select a type of food item"),
      price: yup.string().required("price a required"),
      description: yup
        .string("description must be in string")
        .required("description a country"),
    })
    .required();
  const {id} = useParams()
  
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [updateImage, setUpdateImage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
console.log(errors);

  useEffect(() => {
    reset(data);
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    
    
    const formData = new FormData()
    if(file) formData.append("image",file)

    for(let key in data){
      formData.append(`${key}`,data[key])
    }

    const result = await dispatch(fn({formData,id}));
    console.log("menu add/update result", result);

    if (result.payload.success) {
      close();
    }
  };

  return (
    <Box padding={2}>
      <AFormProvider onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} direction="column" className="d-flex">
           <Grid size={{md:6}} className='d-flex flex-column' >
            { (forAdd || updateImage) && (

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            )}

            {!forAdd && !updateImage &&  (
              <img
                src={ `http://localhost:8000/${data?.image}`}
                alt="user Img"
                width="100px"
                className="contains"
              />
            )}

            { !forAdd &&  <Switch onChange={(e)=>setUpdateImage(e.target.checked)} />}
          </Grid> 

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
              name="price"
              type="number"
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

          <Grid>
            <AutoComplete
              control={control}
              name="type"
              options={food_type_Options}
              error={errors}
            />
          </Grid>

          <Grid className="align-self-center">
            <CustomButton name="Submit" color="sucess" variant="contained" />
          </Grid>
        </Grid>
      </AFormProvider>
    </Box>
  );
};

export default AddMenuItemForm;
