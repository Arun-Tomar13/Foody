import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { Controller } from "react-hook-form";

import ShowError from "../ShowError";

function RadioInput({
  control,
  name,
  options = [],
  error,
  row = true,
  label,
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <FormControl
          fullWidth
          error={Boolean(
            error?.[name],
          )}
        >
          {/* LABEL */}
          {label && (
            <Typography
              sx={{
                mb: 1.2,
                fontWeight: 700,
                fontSize: "0.92rem",
                color: "#3b2f2a",
              }}
            >
              {label}
            </Typography>
          )}

          {/* RADIO WRAPPER */}
          <Box
            sx={{
              border:
                "1px solid #f5dfc9",

              borderRadius: "18px",

              background:
                "#fffaf5",

              px: 2,
              py: 1.2,

              transition:
                "all 0.25s ease",

              "&:hover": {
                borderColor:
                  "#fb923c",
              },
            }}
          >
            <RadioGroup
              {...field}
              row={row}
            >
              {options.map(
                (value) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    label={value}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color:
                            "#fb923c",

                          "&.Mui-checked":
                            {
                              color:
                                "#f97316",
                            },
                        }}
                      />
                    }
                    sx={{
                      mr: 2,

                      "& .MuiFormControlLabel-label":
                        {
                          fontSize:
                            "0.92rem",

                          fontWeight: 600,

                          color:
                            "#4b3b35",

                          textTransform:
                            "capitalize",
                        },
                    }}
                  />
                ),
              )}
            </RadioGroup>
          </Box>

          {/* ERROR */}
          {error?.[name] && (
            <ShowError
              message={
                error[name]
                  .message
              }
            />
          )}
        </FormControl>
      )}
    />
  );
}

export default RadioInput;