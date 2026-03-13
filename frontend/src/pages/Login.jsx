import { Grid, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../components/InputFields/TextInput";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/userSlice";
import AFormProvider from "../components/FormProvider";
import CustomButton from "../components/InputFields/CustomButton";
import CustomSnackbar from "../components/CustomSnackbar";

const schema = yup
  .object({
    Email: yup.string().required("email is required"),
    Password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const Login = () => {
  const { error, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  }, [error]);

  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    console.log("login result", result);

    if (result.payload.success) {
      navigate("/");
    }
  };

  return (
    // Main container
    <Grid container p={10}>
      {/* Left Side */}
      <Grid size={{ md: 4, sm: 12 }} className="d-flex align-items-center">
        {/* Form */}
        <AFormProvider onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Email field */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              <TextInput
                control={control}
                name="Email"
                type="email"
                error={errors}
              />
            </Grid>

            {/* Password field */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              <TextInput
                control={control}
                name="Password"
                type="password"
                error={errors}
              />
            </Grid>

            {/* Register link */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              <p>
                don't have a account <Link to="/register"> Register</Link>
              </p>
            </Grid>

            {/* Login Button */}
            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
              {!loading ? (
                <CustomButton name="Login" variant="contained"></CustomButton>
              ) : (
                <Button size="small" color="primary" variant="contained">
                  <CircularProgress color="white" size="25px" />
                  <div className="px-2 py-1">Logging in</div>
                </Button>
              )}
            </Grid>
            {/* Error Text */}
            {error && (
              <CustomSnackbar
                type="error"
                variant="outlined"
                open={open}
                message={error.message}
              />
            )}
          </Grid>
        </AFormProvider>
      </Grid>

      {/* Right Side  */}
      <Grid size={{ md: 8, sm: 12 }}>
        <video width='65%' src="/home.mp4" autoPlay loop />
      </Grid>
    </Grid>
  );
};

export default Login;
