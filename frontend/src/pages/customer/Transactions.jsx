import { Button, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../../store/slices/transactionSlice";
import { useState } from "react";
import DialogBox from "../../components/InputFields/DialogBox";
import TopUp from "./TopUp";
import CustomSnackbar from "../../components/CustomSnackbar";

const Transaction = () => {
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();

  const { error,loading,transactionList, credit, debit, balance } = useSelector(
    (state) => state.transaction,
  );
console.log(openSnackbar);

  useEffect(() => {
      if (error) {
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 2000);
      }
    }, [error]);

  useEffect(() => {
    const fatchTransactions = async () => {
      const result = await dispatch(getAllTransactions());
      console.log(result);
    };
    fatchTransactions();
  }, []);

  const columns = [
    {
      field: "transaction_type",
      headerName: "For",
      sortable: false,
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      renderCell: (params) => (
        <div>{params.row.credit ? "credit" : "debit"}</div>
      ),
    },
    {
      field: "price",
      headerName: "Amount",
      sortable: false,
      renderCell: (params) => (
        <div>{params.row.credit ? params.row.credit : params.row.debit}</div>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      sortable: false,
      width: "100",
      renderCell: (params) => <div>{params.row.date.split("T")[0]}</div>,
    },
    {
      field: "time",
      headerName: "Time",
      sortable: false,
      width: "100",
      renderCell: (params) => (
        <div>{params.row.date.split("T")[1].split(".")[0]}</div>
      ),
    },
    {
      field: "transaction_id",
      headerName: "transaction id",
      sortable: false,
      width: "150",
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="d-flex flex-column justify-content-between">
      {transactionList && (
        <div className="d-flex flex-column gap-3">
            <Grid><h1 className="text-primary">Your transactions</h1></Grid>
          <div className="d-flex justify-content-between">
          <Grid container direction='column' spacing={1} >
            <Grid container >
              <h2 >Balance: ${balance}</h2>
            </Grid>
            <Grid container spacing={5} >
              <h4>Credit: ${credit}</h4> <h4>Debit: ${debit} </h4>
            </Grid>
          </Grid>
            <Grid>
                <Button onClick={handleClickOpen} variant="contained">
              Top Up
            </Button>
            <DialogBox
              open={open}
              onClose={handleClose}
              title="Cart"
              component={<TopUp close={handleClose} />}
            />
            </Grid>
            {/* Error Text */}
            {error && (
              <CustomSnackbar type='error' variant="filled" open={openSnackbar} message={error.message} />
            )}
          </div>
          <DataGrid
            rows={transactionList}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            disableColumnResize
          />
        </div>
      )}
    </div>
  );
};

export default Transaction;
