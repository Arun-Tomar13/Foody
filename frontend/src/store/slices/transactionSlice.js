import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTransactionsApi, topUpApi } from "../../lib/api/transactionAPi";

const initialState = {
  transactionList: [],
  balance:0,
  debit:0,
  credit:0,
  error: null,
  loading:null,
  successMessage:null,
};

export const topUp = createAsyncThunk(
  "transaction/add",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    const res = await topUpApi(data);
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const getAllTransactions = createAsyncThunk(
  "transaction/get",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    const res = await getTransactionsApi(data);
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);


const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(topUp.pending, (state) => {
         state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(topUp.fulfilled, (state, action) => {
        state.loading = false;

        if(action.payload.success){ 
            state.successMessage=action.payload.message
            state.transactionList.push(action.payload.data[0])
            state.balance +=  action.payload.data[0].credit
            state.credit += action.payload.data[0].credit
        }
        else{
          state.error=action.payload
        }
      })
      .addCase(topUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        if(action.payload.success){
          state.transactionList=action.payload.data.transactions
          if(action.payload.data.transactions.length > 0){
            state.balance=Number(action.payload.data.total.balance),
            state.credit=Number(action.payload.data.total.credit),
            state.debit=Number(action.payload.data.total.debit)
          }
        }
        else{
          state.error=action.payload
        }
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error=action.payload
      })

      },
});

export default transactionSlice.reducer;
