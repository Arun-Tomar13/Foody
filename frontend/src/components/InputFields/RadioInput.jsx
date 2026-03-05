import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material"
import { Controller } from "react-hook-form"
import { useId } from "react"
import ShowError from "../ShowError";

function RadioInput({ control, name,options,error }) {

    const id= useId();

    return (
                
                 <Controller
                 name={name}
                 control={control}
                 render={({ field }) => (
                     <>
                     <RadioGroup aria-label={name} {...field} row >
                        {options.map((value)=>
                            <FormControlLabel key={id+value} value={value} control={<Radio  size='small'/>} label={value} />)}
                    </RadioGroup> 
                    {error[name] &&  <ShowError message={error[name].message}/>}</>
                )}
                />
             
    )
}

export default RadioInput