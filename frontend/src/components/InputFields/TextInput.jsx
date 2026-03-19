import ShowError from "../ShowError";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { Controller } from "react-hook-form";

export default function TextInput({ type, control, name, error }) {
  return (
    <>
      <FormControl fullWidth>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              {...error[name]}
              label={name}
              variant="outlined"
              type={type}
            />
          )}
        />
        {error[name] && <ShowError message={error[name]?.message} />}
      </FormControl>
    </>
  );
}
