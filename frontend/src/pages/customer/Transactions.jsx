import {
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../../store/slices/transactionSlice";
import DialogBox from "../../components/InputFields/DialogBox";
import TopUp from "./TopUp";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Plus,
} from "lucide-react";

const Transaction = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const {
    transactionList,
    credit,
    debit,
    balance,
  } = useSelector(
    (state) => state.transaction,
  );

  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  const columns = [
    {
      field: "transaction_type",
      headerName: "For",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) =><div>{params.row.transaction_type === "top-up" ? "Wallet Top-up" : "Order Payment"}</div>
    },
   {
  field: "type",
  headerName: "Type",
  flex: 1,
  minWidth: 120,
  sortable: false,
  renderCell: (params) => (
    <div
      className={`transaction-chip ${
        params.row.credit
          ? "transaction-chip--credit"
          : "transaction-chip--debit"
      }`}
    >
      {params.row.credit ? "Credit" : "Debit"}
    </div>
  ),
},
    {
      field: "price",
      headerName: "Amount",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <strong>
          ₹
          {params.row.credit
            ? params.row.credit
            : params.row.debit}
        </strong>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <span>
          {params.row.date.split("T")[0]}
        </span>
      ),
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <span>
          {
            params.row.date
              .split("T")[1]
              .split(".")[0]
          }
        </span>
      ),
    },
    {
      field: "transaction_id",
      headerName: "Transaction ID",
      flex: 1.4,
      minWidth: 220,
      sortable: false,
    },
  ];

  const user = useSelector((state) => state?.users?.user);
  const role = user?.role;
  const isCustomer = role === 2;

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <Typography
            variant="h4"
            fontWeight={800}
          >
            {role === 1 ? "Platform Revenue" : role === 4 ? "Restaurant Revenue" : "Wallet & Transactions"}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            {role === 1 || role === 4 ? "Track your payout history" : "Manage your wallet and track transaction history"}
          </Typography>
        </div>

        {isCustomer && (
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              backgroundColor: "#f97316",
              px: 2.5,
              py: 1.2,
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#ea580c",
              },
            }}
          >
            Top Up
          </Button>
        )}
      </div>

      <div className="transactions-stats">
        <Paper className="transactions-stat-card">
          <div className="transactions-stat-icon">
            <Wallet size={22} />
          </div>

          <div>
            <h3>₹{balance}</h3>
            <p>Wallet Balance</p>
          </div>
        </Paper>

        <Paper className="transactions-stat-card">
          <div className="transactions-stat-icon credit">
            <ArrowUpCircle size={22} />
          </div>

          <div>
            <h3>₹{credit}</h3>
            <p>Total Credit</p>
          </div>
        </Paper>

        <Paper className="transactions-stat-card">
          <div className="transactions-stat-icon debit">
            <ArrowDownCircle size={22} />
          </div>

          <div>
            <h3>₹{debit}</h3>
            <p>Total Debit</p>
          </div>
        </Paper>
      </div>

      <Paper className="transactions-table-wrapper">
        <div className="transactions-table-head">
          <div>
            <h3>Recent Transactions</h3>
            <span>
              Your wallet activity history
            </span>
          </div>
        </div>

        <DataGrid
          rows={transactionList || []}
          columns={columns}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={transactionList?.length <= 5 ? [5] : [5, 10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          className="foody-transactions-grid"
        />
      </Paper>

      <DialogBox
        open={open}
        onClose={() => setOpen(false)}
        title="Top up wallet"
        maxWidth="sm"
        component={
          <TopUp close={() => setOpen(false)} />
        }
      />

    </div>
  );
};

export default Transaction;
