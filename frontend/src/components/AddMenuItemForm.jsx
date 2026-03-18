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
      name: yup.string().typeError("name is required").required("Name is required"),
      // image: yup.string().required("image is required"),
      type: yup
        .string()
        .typeError("type is required")
        .oneOf(["veg", "non-veg"])
        .required("select a type of food item"),
      price: yup.string().typeError("price is required").required("price a required"),
      description: yup
        .string("description must be in string")
        .typeError("description is required")
        .required("description a country"),
    })
    .required();
  const param = useParams()
  
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [available, setAvailable] = useState(0);
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
    setAvailable(data.isAvailable)
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData()
    if(file) formData.append("image",file)

    data.isAvailable=available

    for(let key in data){
      formData.append(`${key}`,data[key])
    }
    let result;
    if(param.id) result = await dispatch(fn({formData,id:param.id}));
    else result = await dispatch(fn({formData}))
    console.log("menu add/update result", result);

    if (result.payload.success) {
      close();
    }
  };
  

  return (
    <Box padding={2}>
      <AFormProvider onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} direction="column">
           <Grid size={12} container direction='column' justifyContent='center' alignItems='center' >
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
                src={ `http://192.168.1.156:8000/${data?.image}`}
                alt="user Img"
                width="100px"
              />
            )}

            { !forAdd &&  <Switch onChange={(e)=>setUpdateImage(e.target.checked)} />}
            <Grid>
              {available ? 'Available' : "Not available"}
              <Switch
              value={available}
              onChange={()=>{setAvailable((prev)=> prev ? 0 : 1)}}
              name="isAvailable"
              color="secondary"
            />
            </Grid>
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
