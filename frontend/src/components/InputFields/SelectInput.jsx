import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { Controller } from "react-hook-form";

import ShowError from "../ShowError";

function SelectInput({
  control,
  name,
  options = [],
  error,
  label,
  disabled = false,
}) {
  return (
    <FormControl
      fullWidth
      error={Boolean(
        error?.[name],
      )}
    >
      <InputLabel>
        {label || name}
      </InputLabel>

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <Select
              {...field}
              disabled={disabled}
              label={
                label || name
              }
              displayEmpty
              sx={{
                borderRadius:
                  "16px",

                background:
                  "#fff",

                "& .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "#f3d4b2",
                  },

                "&:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "#fb923c",
                  },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "#f97316",
                    borderWidth: 2,
                  },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius:
                      "16px",

                    mt: 1,

                    boxShadow:
                      "0 18px 40px rgba(0,0,0,0.12)",

                    border:
                      "1px solid #f5dfc9",
                  },
                },
              }}
            >
              {options.map(
                (option) => (
                  <MenuItem
                    key={
                      option.id
                    }
                    value={
                      option.id
                    }
                    sx={{
                      borderRadius:
                        "10px",

                      mx: 1,
                      my: 0.5,

                      "&:hover":
                        {
                          background:
                            "#fff7ed",
                        },
                    }}
                  >
                    {
                      option.name
                    }
                  </MenuItem>
                ),
              )}
            </Select>

            {error?.[name] && (
              <ShowError
                message={
                  error[name]
                    ?.message
                }
              />
            )}
          </>
        )}
      />
    </FormControl>
  );
}

export default SelectInput;