import { Controller } from "react-hook-form";

import {
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";

import ShowError from "../ShowError";

function AutoComplete({
  control,
  name,
  options = [],
  error,
  placeholder,
  disabled = false,
  sx = {},
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field }) => (
        <Box>
          <Autocomplete
            options={options}
            disabled={disabled}
            value={field.value || null}
            onChange={(_, value) =>
              field.onChange(value)
            }
            isOptionEqualToValue={(
              option,
              value,
            ) => option === value}
            getOptionLabel={(option) =>
              option || ""
            }
            fullWidth
            autoHighlight
            clearOnEscape

            sx={{
              "& .MuiAutocomplete-popupIndicator":
                {
                  color: "#f97316",
                  transition:
                    "0.3s ease",
                },

              "& .MuiAutocomplete-popupIndicator:hover":
                {
                  background:
                    "rgba(249,115,22,0.1)",
                },

              "& .MuiAutocomplete-clearIndicator":
                {
                  color: "#f97316",
                },
            }}

            renderInput={(params) => (
              <TextField
                {...params}
                label={name}
                placeholder={
                  placeholder ||
                  `Select ${name}`
                }
                error={Boolean(
                  error?.[name],
                )}

                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      borderRadius:
                        "20px",

                      background:
                        "rgba(255,255,255,0.9)",

                      backdropFilter:
                        "blur(10px)",

                      minHeight: "56px",

                      transition:
                        "all 0.3s ease",

                      boxShadow:
                        "0 8px 20px rgba(249,115,22,0.08)",

                      "& fieldset": {
                        borderColor:
                          "#fed7aa",
                        borderWidth: "1.5px",
                      },

                      "&:hover": {
                        transform:
                          "translateY(-2px)",

                        boxShadow:
                          "0 12px 24px rgba(249,115,22,0.15)",
                      },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#fb923c",
                        },

                      "&.Mui-focused":
                        {
                          background:
                            "#fff",

                          boxShadow:
                            "0 0 0 4px rgba(249,115,22,0.15)",
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            "#f97316",
                          borderWidth: 2,
                        },
                    },

                  "& .MuiInputLabel-root":
                    {
                      color:
                        "#9a6b46",
                      fontWeight: 500,
                    },

                  "& .MuiInputLabel-root.Mui-focused":
                    {
                      color:
                        "#f97316",
                    },

                  "& .MuiOutlinedInput-input":
                    {
                      color:
                        "#3b2a1a",
                      fontWeight: 500,
                    },

                  "& .MuiFormHelperText-root":
                    {
                      marginLeft: "6px",
                      marginTop: "6px",
                      fontWeight: 500,
                    },

                  ...sx,
                }}
              />
            )}

            slotProps={{
              paper: {
                elevation: 8,
                sx: {
                  mt: 1,

                  borderRadius: "18px",

                  overflow: "hidden",

                  backdropFilter:
                    "blur(12px)",

                  background:
                    "rgba(255,255,255,0.95)",

                  border:
                    "1px solid rgba(255,255,255,0.3)",

                  boxShadow:
                    "0 18px 40px rgba(0,0,0,0.12)",

                  "& .MuiAutocomplete-option":
                    {
                      minHeight: 50,

                      fontWeight: 500,

                      transition:
                        "all 0.2s ease",

                      "&:hover": {
                        background:
                          "rgba(249,115,22,0.12)",
                      },

                      '&[aria-selected="true"]':
                        {
                          background:
                            "rgba(249,115,22,0.18)",
                        },
                    },
                },
              },
            }}
          />

          {error?.[name] && (
            <ShowError
              message={
                error[name].message
              }
            />
          )}
        </Box>
      )}
    />
  );
}

export default AutoComplete;