import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";

import {
  IndianRupee,
  Wallet,
  Sparkles,
} from "lucide-react";

import * as yup from "yup";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { useDispatch } from "react-redux";

import { topUp } from "../../store/slices/transactionSlice";

import FormProvider from "../../components/FormProvider";

import TextInput from "../../components/InputFields/TextInput";

const quickAmounts = [
  100,
  250,
  500,
  1000,
];

const TopUp = ({ close }) => {
  const schema = yup
    .object({
      amount: yup
        .number()
        .typeError(
          "Enter a valid amount",
        )
        .positive(
          "Amount must be greater than 0",
        )
        .required(
          "Amount is required",
        ),
    })
    .required();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: "",
    },
  });

  const amount = watch("amount");

  const onSubmit = async (data) => {
    const result = await dispatch(
      topUp(data),
    );

    if (result.payload?.success) {
      close();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "28px",
        overflow: "hidden",
        border:
          "1px solid #f4dfc8",
      }}
    >
      {/* TOP HEADER */}
      <Box
        sx={{
          p: 3,
          background:
            "linear-gradient(135deg,#fff7ed 0%,#fffaf5 100%)",
          borderBottom:
            "1px solid #f5dfc9",
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid>
            <Box
              sx={{
                width: 62,
                height: 62,
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg,#fb923c,#f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                color: "#fff",
                boxShadow:
                  "0 12px 30px rgba(249,115,22,0.25)",
              }}
            >
              <Wallet size={28} />
            </Box>
          </Grid>

          <Grid>
            <Typography
              fontWeight={900}
              fontSize="1.5rem"
              color="#2f2926"
            >
              Top Up Wallet
            </Typography>

            <Typography
              color="#7b6b63"
              fontSize="0.92rem"
            >
              Add balance instantly
              and continue ordering
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* FORM */}
      <Box p={3}>
        <FormProvider
          onSubmit={handleSubmit(
            onSubmit,
          )}
        >
          <Grid
            container
            direction="column"
            spacing={3}
          >
            {/* INPUT */}
            <Grid>
              <TextInput
                control={control}
                name="amount"
                type="number"
                error={errors}
                placeholder="Enter amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IndianRupee
                        size={18}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* QUICK SELECT */}
            <Grid>
              <Typography
                fontWeight={800}
                mb={1.5}
                color="#2f2926"
              >
                Quick Add
              </Typography>

              <Grid
                container
                spacing={1.5}
              >
                {quickAmounts.map(
                  (item) => (
                    <Grid key={item}>
                      <Button
                        variant={
                          Number(
                            amount,
                          ) === item
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          setValue(
                            "amount",
                            item,
                          )
                        }
                        sx={{
                          borderRadius:
                            "14px",
                          minWidth:
                            "90px",
                          py: 1,
                          textTransform:
                            "none",
                          fontWeight: 800,

                          ...(Number(
                            amount,
                          ) === item
                            ? {
                                background:
                                  "linear-gradient(135deg,#fb923c,#f97316)",
                                color:
                                  "#fff",
                              }
                            : {
                                borderColor:
                                  "#fed7aa",
                                color:
                                  "#f97316",
                                background:
                                  "#fff7ed",
                              }),
                        }}
                      >
                        ₹{item}
                      </Button>
                    </Grid>
                  ),
                )}
              </Grid>
            </Grid>

            {/* INFO CARD */}
            <Grid>
              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1.5,
                  p: 2,
                  borderRadius:
                    "18px",
                  background:
                    "#fff7ed",
                  border:
                    "1px solid #fed7aa",
                }}
              >
                <Sparkles
                  size={18}
                  color="#f97316"
                />

                <Typography
                  fontSize="0.88rem"
                  color="#7b6b63"
                >
                  Wallet balance can
                  be used for faster
                  checkout and instant
                  payments.
                </Typography>
              </Box>
            </Grid>

            {/* BUTTON */}
            <Grid>
              <Button
                type="submit"
                fullWidth
                disabled={
                  isSubmitting
                }
                sx={{
                  height: 54,
                  borderRadius:
                    "16px",
                  textTransform:
                    "none",
                  fontWeight: 900,
                  fontSize:
                    "1rem",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#fb923c,#f97316)",
                  boxShadow:
                    "0 16px 34px rgba(249,115,22,0.24)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#f97316,#ea580c)",
                  },
                }}
              >
                {isSubmitting
                  ? "Processing..."
                  : "Add Money"}
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Paper>
  );
};

export default TopUp;
