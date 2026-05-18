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
import { PenBox } from "lucide-react";

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

    if (result.payload?.success) {
      close();
    }
  };
  

  return (
    <Box>
      <AFormProvider onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} direction="column">
           <Grid size={12} container direction='column' justifyContent='center' alignItems='center' >
            {/* IMAGE PREVIEW */}
<Box
  sx={{
    position: "relative",
    width: 130,
    height: 130,
  }}
>
  {/* SHOW IMAGE IF EXISTS */}
  {file || data?.image ? (
    <Box
      component="img"
      src={
        file
          ? URL.createObjectURL(file)
          : `${import.meta.env.VITE_Image_URL}/${data.image}`
      }
      alt="Food"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",

        borderRadius: "26px",

        border:
          "3px solid #fff",

        boxShadow:
          "0 18px 36px rgba(0,0,0,0.14)",

        background:
          "#fff7ed",
      }}
    />
  ) : (
    /* PLACEHOLDER */
    <Box
      sx={{
        width: "100%",
        height: "100%",

        borderRadius: "26px",

        background:
          "linear-gradient(135deg,#fff7ed,#ffedd5)",

        border:
          "2px dashed #fdba74",

        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        justifyContent: "center",

        gap: 1,

        color: "#ea580c",

        textAlign: "center",

        px: 2,
      }}
    >
      <Box
        sx={{
          fontSize: "2rem",
        }}
      >
        🍽️
      </Box>

      <Box
        sx={{
          fontWeight: 700,
          fontSize: "0.92rem",
        }}
      >
        Add Food Image
      </Box>

      <Box
        sx={{
          fontSize: "0.75rem",
          color: "#9a3412",
        }}
      >
        Upload preview
      </Box>
    </Box>
  )}

  {/* EDIT BUTTON */}
  <Box
    component="label"
    htmlFor="food-image"
    sx={{
      position: "absolute",

      bottom: -4,
      right: -4,

      width: 38,
      height: 38,

      borderRadius: "50%",

      background:
        "linear-gradient(135deg,#fb923c,#f97316)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: "#fff",

      cursor: "pointer",

      boxShadow:
        "0 10px 24px rgba(249,115,22,0.28)",

      transition:
        "all 0.25s ease",

      "&:hover": {
        transform:
          "scale(1.08)",
      },
    }}
  >
    <PenBox size={18} />
  </Box>

  {/* HIDDEN INPUT */}
  <input
    hidden
    id="food-image"
    type="file"
    name="image"
    accept="image/*"
    onChange={(e) =>
      setFile(
        e.target.files[0],
      )
    }
  />
</Box>
            {/* AVAILABILITY TOGGLE */}
  <Box
    sx={{
      width: "100%",
      maxWidth: 320,

      display: "flex",
      alignItems: "center",
      justifyContent:
        "space-between",

      px: 2.2,
      py: 1.6,

      borderRadius: "18px",

      background:
        available
          ? "linear-gradient(135deg,#ecfdf3,#dcfce7)"
          : "linear-gradient(135deg,#fff1f2,#ffe4e6)",

      border:
        available
          ? "1px solid #86efac"
          : "1px solid #fda4af",

      transition:
        "all 0.3s ease",
    }}
  >
    <Box>
      <Box
        sx={{
          fontWeight: 800,
          fontSize: "0.95rem",

          color: available
            ? "#166534"
            : "#9f1239",
        }}
      >
        {available
          ? "Available"
          : "Unavailable"}
      </Box>

      <Box
        sx={{
          fontSize: "0.78rem",

          color: available
            ? "#15803d"
            : "#be123c",
        }}
      >
        {available
          ? "Customers can order this item"
          : "Hidden from customers"}
      </Box>
    </Box>

    <Switch
      checked={Boolean(
        available,
      )}
      onChange={() =>
        setAvailable(
          (prev) =>
            prev ? 0 : 1,
        )
      }
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked":
          {
            color: "#16a34a",
          },

        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
          {
            backgroundColor:
              "#22c55e",
          },
      }}
    />
  </Box>

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
