import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading:false,
}

const commonSlice = createSlice({
    name:'common',
    initialState,
    reducers:{
        startLoading:(state)=>{
            return {...state,loading:true};
        },
        stopLoading:(state)=>{
            return {...state,loading:false};
        },
    }
})

export const {startLoading,stopLoading} = commonSlice.actions;
export default commonSlice.reducer