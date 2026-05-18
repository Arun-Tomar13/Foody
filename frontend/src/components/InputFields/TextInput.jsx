import {
  FormControl,
  TextField,
  InputAdornment,
} from "@mui/material";

import { Controller } from "react-hook-form";

export default function TextInput({
  type = "text",
  control,
  name,
  error,
  label,
  placeholder,
  multiline = false,
  rows = 4,
  disabled = false,
  InputProps,
  sx = {},
}) {
  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            disabled={disabled}
            type={type}
            label={label || name}
            placeholder={
              placeholder ||
              `Enter ${name}`
            }
            multiline={multiline}
            rows={
              multiline
                ? rows
                : undefined
            }
            variant="outlined"
            error={Boolean(
              error?.[name],
            )}
            helperText={
              error?.[name]
                ?.message
            }
            InputProps={{
              ...InputProps,
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius:
                    "18px",

                  background:
                    "#fff",

                  transition:
                    "all 0.25s ease",

                  "& fieldset": {
                    borderColor:
                      "#f3d4b2",
                  },

                  "&:hover fieldset":
                    {
                      borderColor:
                        "#fb923c",
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
                    "#8b5e3c",
                },

              "& .MuiInputLabel-root.Mui-focused":
                {
                  color:
                    "#f97316",
                },

              "& .MuiFormHelperText-root":
                {
                  marginLeft: "4px",
                  fontWeight: 500,
                },

              ...sx,
            }}
          />
        )}
      />
    </FormControl>
  );
}