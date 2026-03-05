import { Controller } from "react-hook-form"
import { Autocomplete, TextField } from "@mui/material"
import ShowError from "../ShowError"

function AutoComplete({ control, name, options,error }) {
  
    return (
          <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
          <Autocomplete
            {...field}
            options={options}
            getOptionLabel={(option) => option}
            value=''
            onChange={(_, value) =>  field.onChange(value)}
            renderInput={(params) => (
              <TextField
              {...params}
                label={name}
              />
            )}
          />
          {error[name] && <ShowError message={error[name].message}/>}</>
        )}
      />
       
    )
}

export default AutoComplete