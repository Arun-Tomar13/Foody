import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { Controller } from "react-hook-form"
import ShowError from "../ShowError"

function SelectInput({ control, name,options,error }) {

    return (
        <FormControl className="w-100">
            <InputLabel  >{name}</InputLabel>
             <Controller
                name={name}
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <>
                    <Select {...field}  label={name} >
                        {options.map((option)=> <MenuItem value={option.id}>{option.name}</MenuItem> )}
                    </Select>
                    {error[name] &&  <ShowError message={error[name]?.message}/>}
                     </>
                )}
                />
                </FormControl>
    )
}

export default SelectInput