import { Controller, useForm } from "react-hook-form";
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
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/slices/userSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import SelectInput from "../components/InputFields/SelectInput";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import AFormProvider from "../components/FormProvider";
import { getRoles } from "../lib/api/userApi";
import { notifyError } from "../utils/feedback";

// yup
const schema = yup
  .object({
    name: yup
      .string()
      .typeError("Name is required")
      .required("Name is required")
      .matches(name_regrex, "enter a valid name"),
    gender: yup.string().required("select a gender"),
    role: yup.number().required("choose your role").typeError("role is required"),
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
      .positive("age cannot be negative")
      .integer("age must be number")
      .required("please enter your age")
      .max(120, "enter a valid age"),
    address:yup.string().required("please enter your address").typeError("Address must be a string"),
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
  const { user, loading } = useSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

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
      if (roles.data?.success) {
        setRoles(roles.data.data);
        return;
      }

      notifyError(roles.data, "Unable to load roles.");
    };
    getRole();
  }, []);

  // onsubmit fn (Register)
  const onSubmit = async (data) => {
    let response = await dispatch(addUser(data));

    if (response.payload?.success) navigate("/login");
  };

  return (
    <Box
      component="main"
      className="auth-register-page"
      sx={{
        alignItems: "center",
        background: "#fff3e0",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, md: 2 },
        textAlign: "left",
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 0, md: 4 }}
        className="auth-register-grid"
        sx={{ maxWidth: 1180, width: "100%" }}
      >
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            className="register-paper"
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid #ffe0bf",
              borderRadius: { xs: "34px", md: "28px" },
              background: "rgba(255,255,255,0.84)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 30px 80px rgba(249,115,22,0.14)",
              maxWidth: 820,
              mx: "auto",
              px: { xs: 3, sm: 4, md: 3 },
              py: { xs: 4, sm: 4, md: 2.5 },
              width: "100%",
            }}
          >
            <Box className="register-intro">
              <Box className="register-brand">
                <Box
                  component="img"
                  src="/foody.png"
                  alt="Foody"
                  sx={{
                    width: { xs: 68, md: 68 },
                    height: { xs: 68, md: 68 },
                    borderRadius: "16px",
                    objectFit: "contain",
                    background: "#fff7ed",
                    p: 1,
                    boxShadow: "0 10px 24px rgba(249,115,22,0.12)",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", md: "1.5rem" },
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "#f97316",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Foody
                  </Typography>
                  <Typography sx={{ color: "#8b5e3c", fontSize: "0.8rem" }}>
                    Taste delivered fast
                  </Typography>
                </Box>
              </Box>

              <Typography
                component="h1"
                className="register-title"
                sx={{
                  color: "#251814",
                  fontWeight: 900,
                  fontSize: { xs: "2.2rem", md: "1.75rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.05em",
                  mb: { xs: 1.5, md: 0.5 },
                }}
              >
                Create Account
              </Typography>

              <Typography
                className="register-subtitle"
                sx={{
                  color: "#7b6b63",
                  fontSize: { xs: "0.96rem", md: "0.84rem" },
                  lineHeight: 1.5,
                  maxWidth: 420,
                }}
              >
                Join Foody and start ordering from your favourite restaurants.
              </Typography>
            </Box>

            <Stack spacing={{ xs: 3, md: 1.5 }} className="register-form-stack">

              <AFormProvider onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={{ xs: 2.4, md: 1.5 }}
                  className="register-form-grid"
                  sx={{ mt: { xs: 0.5, md: 0 } }}
                >
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                      control={control}
                      name="name"
                      type="text"
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      control={control}
                      name="role"
                      options={roles}
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                      control={control}
                      name="email"
                      type="email"
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                      control={control}
                      name="phone"
                      type="number"
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Radio_Input
                      control={control}
                      name="gender"
                      options={gender_option}
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                      control={control}
                      name="age"
                      type="number"
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                      control={control}
                      name="address"
                      type="textarea"
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <AutoComplete
                      control={control}
                      name="country"
                      options={country_optins}
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
  control={control}
  name="password"
  label="Password"
  type={
    showPassword
      ? "text"
      : "password"
  }
  error={errors}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          edge="end"
          onClick={() =>
            setShowPassword(
              (current) =>
                !current,
            )
          }
          sx={{
            color: "#f97316",
          }}
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
                  </Grid>

                  <Grid
                    size={{ xs: 12, sm: 6 }}
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Already have an account?{" "}
                      <Box
                        component={Link}
                        to="/login"
                        sx={{
                          color: "#ef6c00",
                          display: "inline",
                          fontWeight: 700,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Login
                      </Box>
                    </Typography>
                  </Grid>

                  <Grid
                    size={{ xs: 12, sm: 12 }}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      disabled={loading}
                      size="medium"
                      type="submit"
                      variant="contained"
                      className="register-submit-btn"
                      sx={{
                        background:
                          "linear-gradient(135deg,#fb923c,#f97316)",
                        borderRadius: "14px",
                        fontWeight: 900,
                        minWidth: 200,
                        px: 3.5,
                        py: { xs: 1.5, md: 1.1 },
                        textTransform: "none",
                        fontSize: { xs: "1rem", md: "0.95rem" },
                        boxShadow: "0 18px 36px rgba(249,115,22,0.24)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg,#f97316,#ea580c)",
                        },
                      }}
                    >
  {loading ? (
    <>
      <CircularProgress
        color="inherit"
        size={20}
        sx={{ mr: 1 }}
      />
      Creating Account
    </>
  ) : (
    "Create Account"
  )}
</Button>
                  </Grid>
                </Grid>
              </AFormProvider>
            </Stack>
          </Paper>
        </Grid>

        <Grid
          size={{ md: 5 }}
          className="register-visual-col"
          sx={{
            alignItems: "center",
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            perspective: "1800px",
          }}
        >
          <Box className="register-visual-wrap">
            <Box className="register-visual-glow" />

            <Box className="register-visual-card">
              <Box className="register-visual-orb register-visual-orb--one" />
              <Box className="register-visual-orb register-visual-orb--two" />

              <Box
                component="img"
                src="/foody.png"
                alt="Foody"
                className="register-visual-image"
              />

              <Box className="register-visual-tag register-visual-tag--top">
                Hot & Fresh
              </Box>
              <Box className="register-visual-tag register-visual-tag--bottom">
                Premium Taste
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

    </Box>
  );
};

export default Register;
