import { useForm } from "react-hook-form";
import TextInput from "../components/InputFields/TextInput";
import Radio_Input from "../components/InputFields/RadioInput";
import {
  country_optins,
  email_Regrex,
  gender_option,
  name_regrex,
  phone_regrex,
} from "../constant";
import AutoComplete from "../components/InputFields/AutoComplete";
import CustomButton from "../components/InputFields/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/slices/userSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Grid, Snackbar } from "@mui/material";
import SelectInput from "../components/InputFields/SelectInput";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import AFormProvider from "../components/FormProvider";
import { getRoles } from "../lib/api/userApi";
import CustomSnackbar from "../components/CustomSnackbar";

// yup
const schema = yup
  .object({
    name: yup
      .string()
      .typeError("Name is required")
      .required("Name is required")
      .matches(name_regrex, "enter a valid name"),
    gender: yup.string().required("select a gender"),
    role: yup.number().required("choose your role"),
    country: yup.string().required("select a country"),
    email: yup
      .string()
      .typeError("email is required")
      .required("email is required")
      .matches(email_Regrex, "enter a valid email"),
    password: yup
      .string()
      .typeError("password must be number")
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    age: yup
      .number("age must be number")
      .typeError("age is required")
      .positive("age must be number")
      .integer("age must be number")
      .required("please enter your age")
      .max(120, "enter a valid age"),
    phone: yup
      .string()
      .typeError("Contact Number must be number")
      .matches(phone_regrex, "please enter valid contact number")
      .required("please enter your Contact Number")
      .length(10),
  })
  .required("value is requied");

const Register = () => {
  const [roles, setRoles] = useState([]);
  const { error, loading } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  }, [error]);

  // resct form hook
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  console.log(errors);

  // get roles
  useEffect(() => {
    const getRole = async () => {
      const roles = await getRoles();
      setRoles(roles.data.data);
    };
    getRole();
  }, []);

  // onsubmit fn (Register)
  const onSubmit = async (data) => {
    let response = await dispatch(addUser(data));

    if (response.payload.success) navigate("/login");
  };

  return (
    // Main Container
    <Grid container p={10}>
      {/* Left Side - Form */}
      <Grid size={{ md: 6, sm: 12 }} p={5}>
        {/* Register Form */}
        <AFormProvider onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/*Signup Heading */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              <h1>Register</h1>
            </Grid>

            {/*Name */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextInput
                control={control}
                name="name"
                type="text"
                error={errors}
              />
            </Grid>

            {/* Role */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <SelectInput
                control={control}
                name="role"
                options={roles}
                error={errors}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextInput
                control={control}
                name="email"
                type="email"
                error={errors}
              />
            </Grid>

            {/* phone */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextInput
                control={control}
                name="phone"
                type="number"
                error={errors}
              />
            </Grid>

            {/* Gender */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <Radio_Input
                control={control}
                name="gender"
                options={gender_option}
                error={errors}
              />
            </Grid>

            {/* Age */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextInput
                control={control}
                name="age"
                type="number"
                error={errors}
              />
            </Grid>

            {/* Address */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextInput
                control={control}
                name="address"
                type="textarea"
                error={errors}
              />
            </Grid>

            {/* Country */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <AutoComplete
                control={control}
                name="country"
                options={country_optins}
                error={errors}
              />
            </Grid>

            {/* Password */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextInput
                control={control}
                name="password"
                type="password"
                error={errors}
              />
            </Grid>

            {/* Login link */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              <p>
                already have a account <Link to="/login"> Login</Link>
              </p>
            </Grid>

            {/* Submit button */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              {/* {!loading ? ( */}
              <CustomButton
                // control={control}
                name="Register"
                color="sucess"
                variant="contained"
              />

              {/* //   <Button size="small" color="primary" variant="contained" >
              //     <CircularProgress color="white" size="25px" />
              //     <div className="px-2 py-1" >Registering user</div>
              //   </Button> */}

              {/* <Button type="submit" >Submit</Button> */}
            </Grid>
          </Grid>
        </AFormProvider>
      </Grid>

      {/* Right Side - Image */}
      <Grid size={{ md: 6, sm: 12 }}>
        <img
          src="https://media.istockphoto.com/id/1397744355/vector/signing-up-for-a-course-isolated-cartoon-vector-illustrations.jpg?s=612x612&w=0&k=20&c=6eATmEGQYn5E0cKXemGPfZXLuo8_cN8Mkm1Ov2cdNio="
          alt="registering image"
        />
      </Grid>

      {error && (
        <CustomSnackbar
          type="error"
          variant="outlined"
          open={open}
          message={error.message}
        />
      )}
    </Grid>
  );
};

export default Register;
