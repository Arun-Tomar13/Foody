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
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../components/InputFields/TextInput";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/userSlice";
import AFormProvider from "../components/FormProvider";

const schema = yup
  .object({
    Email: yup
      .string()
      .typeError("email is required")
      .required("email is required"),
    Password: yup
      .string()
      .typeError("Password is required")
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const hasBearerToken = () => {
  const token = localStorage.getItem("Bearer")?.trim();

  return Boolean(token && token !== "null" && token !== "undefined");
};

const Login = () => {
  const { user, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && hasBearerToken()) navigate("/", { replace: true });
  }, [user, navigate]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    console.log("login result", result);

    if (result.payload?.success) {
      navigate("/");
    }
  };

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        background: "#fff3e0",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 6 },
        textAlign: "left",
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 0, md: 6 }}
        sx={{ maxWidth: 1120, width: "100%" }}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid #ffe0bf",
              borderRadius: "32px",
              background:
                "rgba(255,255,255,0.82)",
              backdropFilter: "blur(18px)",
              boxShadow:
                "0 28px 70px rgba(249,115,22,0.14)",
              maxWidth: 460,
              mx: "auto",
              px: { xs: 3, sm: 5 },
              py: { xs: 4, sm: 5 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 220,
                height: 220,
                borderRadius: "50%",
                background:
                  "rgba(249,115,22,0.08)",
                top: -90,
                right: -90,
              }}
            />
            <Stack spacing={3}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    component="img"
                    src="/foody.png"
                    alt="Foody"
                    sx={{
                      width: 74,
                      height: 74,
                      borderRadius: "16px",
                      objectFit: "contain",
                      background: "#fff7ed",
                      p: 1,
                      boxShadow:
                        "0 10px 24px rgba(249,115,22,0.12)",
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1.8rem",
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "#f97316",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      Foody
                    </Typography>

                    <Typography
                      sx={{
                        color: "#8b5e3c",
                        fontSize: "0.84rem",
                      }}
                    >
                      Taste delivered fast
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  component="h1"
                  sx={{
                    color: "#251814",
                    fontWeight: 900,
                    fontSize: "2.3rem",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    mb: 1.5,
                  }}
                >
                  Welcome Back 👋
                </Typography>

                <Typography
                  sx={{
                    color: "#7b6b63",
                    fontSize: "0.96rem",
                    lineHeight: 1.7,
                    maxWidth: 340,
                  }}
                >
                  Login and continue exploring
                  delicious meals from your
                  favourite restaurants.
                </Typography>
              </Box>

              <AFormProvider onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextInput
                      control={control}
                      name="Email"
                      type="email"
                      error={errors}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextInput
  control={control}
  name="Password"
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

                  <Grid size={{ xs: 12 }}>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ textAlign: { xs: "center", sm: "left" } }}
                    >
                      Don't have an account?{" "}
                      <Box
                        component={Link}
                        to="/register"
                        sx={{
                          color: "#ef6c00",
                          display: "inline",
                          fontWeight: 700,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Register
                      </Box>
                    </Typography>
                  </Grid>

                  <Grid
                    size={{ xs: 12 }}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      disabled={loading}
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        background:
                          "linear-gradient(135deg,#fb923c,#f97316)",
                        borderRadius: "18px",
                        fontWeight: 900,
                        minWidth: 190,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow:
                          "0 18px 36px rgba(249,115,22,0.24)",

                        "&:hover": {
                          background:
                            "linear-gradient(135deg,#f97316,#ea580c)",
                          transform: "translateY(-2px)",
                          boxShadow:
                            "0 22px 42px rgba(249,115,22,0.28)",
                        },

                        transition: "all 0.25s ease",
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            color="inherit"
                            size={20}
                            sx={{ mr: 1 }}
                          />
                          Logging in
                        </>
                      ) : (
                        "Login to Foody"
                      )}
                    </Button>
                  </Grid>

                </Grid>
              </AFormProvider>
            </Stack>
          </Paper>
        </Grid>

        <Grid
          size={{ md: 7 }}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 620,
              minHeight: 620,
              borderRadius: "36px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg,#fb923c 0%,#f97316 40%,#ea580c 100%)",
              boxShadow:
                "0 28px 80px rgba(249,115,22,0.28)",
              p: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* TOP BRAND */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
              }}
            >

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "4rem",
                  fontWeight: 900,
                  lineHeight: 0.95,
                  maxWidth: 460,
                  letterSpacing: "-0.06em",
                }}
              >
                Order your favourite food instantly.
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,0.86)",
                  fontSize: "1.05rem",
                  mt: 3,
                  maxWidth: 460,
                  lineHeight: 1.8,
                }}
              >
                Discover delicious meals from
                top restaurants around you with
                lightning fast delivery and a
                premium food experience.
              </Typography>
            </Box>

{/* FLOATING CARDS */}
<Box
  sx={{
    position: "relative",
    zIndex: 2,
    height: 220,
  }}
>
  {/* CARD 1 */}
  <Box
    sx={{
      position: "absolute",
      top: 10,
      left: 10,
      background:
        "rgba(255,255,255,0.16)",
      backdropFilter: "blur(18px)",
      border:
        "1px solid rgba(255,255,255,0.18)",
      borderRadius: "24px",
      px: 3,
      py: 2,
      color: "#fff",
      fontWeight: 700,
      boxShadow:
        "0 20px 40px rgba(0,0,0,0.12)",
      animation:
        "floatCard1 6s ease-in-out infinite",
      transformStyle: "preserve-3d",
    }}
  >
    🍔 10k+ Happy Customers
  </Box>

  {/* CARD 2 */}
  <Box
    sx={{
      position: "absolute",
      top: 90,
      right: 20,
      background:
        "rgba(255,255,255,0.16)",
      backdropFilter: "blur(18px)",
      border:
        "1px solid rgba(255,255,255,0.18)",
      borderRadius: "24px",
      px: 3,
      py: 2,
      color: "#fff",
      fontWeight: 700,
      boxShadow:
        "0 20px 40px rgba(0,0,0,0.12)",
      animation:
        "floatCard2 7s ease-in-out infinite",
      transformStyle: "preserve-3d",
    }}
  >
    ⚡ Delivery under 25 mins
  </Box>

  {/* CARD 3 */}
  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      left: 100,
      background:
        "rgba(255,255,255,0.16)",
      backdropFilter: "blur(18px)",
      border:
        "1px solid rgba(255,255,255,0.18)",
      borderRadius: "24px",
      px: 3,
      py: 2,
      color: "#fff",
      fontWeight: 700,
      boxShadow:
        "0 20px 40px rgba(0,0,0,0.12)",
      animation:
        "floatCard3 8s ease-in-out infinite",
      transformStyle: "preserve-3d",
    }}
  >
    ⭐ Rated 4.9 by food lovers
  </Box>
</Box>

{/* ANIMATED BG CIRCLES */}
<Box
  sx={{
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.08)",
    top: -100,
    right: -100,
    filter: "blur(2px)",
    animation:
      "moveCircle1 18s linear infinite",
  }}
/>

<Box
  sx={{
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.06)",
    bottom: -60,
    left: -60,
    filter: "blur(2px)",
    animation:
      "moveCircle2 20s linear infinite",
  }}
/>

<Box
  sx={{
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.05)",
    top: "40%",
    left: "35%",
    animation:
      "moveCircle3 22s linear infinite",
  }}
/>

{/* KEYFRAMES */}
<style>
  {`
    @keyframes floatCard1 {
      0%,100% {
        transform: translateY(0px) rotate3d(1,1,0,0deg);
      }
      50% {
        transform: translateY(-14px) rotate3d(1,1,0,6deg);
      }
    }

    @keyframes floatCard2 {
      0%,100% {
        transform: translateY(0px) translateX(0px) rotate3d(1,0,1,0deg);
      }
      50% {
        transform: translateY(12px) translateX(-8px) rotate3d(1,0,1,-6deg);
      }
    }

    @keyframes floatCard3 {
      0%,100% {
        transform: translateY(0px) rotate3d(0,1,1,0deg);
      }
      50% {
        transform: translateY(-10px) translateX(8px) rotate3d(0,1,1,6deg);
      }
    }

    @keyframes moveCircle1 {
      0% {
        transform: translate(0,0);
      }
      50% {
        transform: translate(-60px,80px);
      }
      100% {
        transform: translate(0,0);
      }
    }

    @keyframes moveCircle2 {
      0% {
        transform: translate(0,0);
      }
      50% {
        transform: translate(80px,-50px);
      }
      100% {
        transform: translate(0,0);
      }
    }

    @keyframes moveCircle3 {
      0% {
        transform: translate(0,0);
      }
      50% {
        transform: translate(-40px,-70px);
      }
      100% {
        transform: translate(0,0);
      }
    }
  `}
</style>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
