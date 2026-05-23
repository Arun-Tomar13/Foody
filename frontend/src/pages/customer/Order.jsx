import { Button, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateCSVOdOrders,
  getAllOrder,
} from "../../store/slices/orderSlice";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  Download,
  IndianRupee,
  ShoppingBag,
} from "lucide-react";
import { USER_ROLES } from "../../constant";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderList, total, numberOfItems } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    dispatch(getAllOrder());
  }, [dispatch]);

  const spendThisMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return (orderList || []).reduce((sum, order) => {
      if (!order?.date) return sum;

      const orderDate = new Date(order.date);
      if (Number.isNaN(orderDate.getTime())) return sum;

      const isCurrentMonth =
        orderDate.getFullYear() === year && orderDate.getMonth() === month;

      return isCurrentMonth ? sum + Number(order.total || 0) : sum;
    }, 0);
  }, [orderList]);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <span>{params.value.split("T")[0]}</span>
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
          {params.row.date.split("T")[1].split(".")[0]}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      sortable: false,
      renderCell: (params) => {
        const status = String(params.value || "").toLowerCase();
        const chipClass =
          status === "delivered"
            ? "order-chip--delivered"
            : status === "cancelled"
              ? "order-chip--cancelled"
              : "order-chip--pending";

        return (
          <div className={`order-chip ${chipClass}`}>{role == USER_ROLES.customer ? status : (status == "placed" ? "Delivered" : "pending")}</div>
        );
      },
    },
    {
      field: "name",
      headerName: "Placed By",
      flex: 1,
      minWidth: 160,
      sortable: false,
    },
    {
      field: "total",
      headerName: "Amount",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => <strong>₹{params.value}</strong>,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1.4,
      minWidth: 220,
      sortable: false,
    },
    {
      field: "view",
      headerName: "Order",
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          className="order-view-btn"
          onClick={() => navigate(`/order/${params.row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const handleDownloadCSV = async () => {
    const result = await dispatch(generateCSVOdOrders());

    if (result.payload?.success) {
      navigate(result.payload.data);
    }
  };

  const user = useSelector((state) => state?.users?.user);
  const role = user?.role;
  const isCustomer = role === USER_ROLES.customer; // Assuming customer is 2 from USER_ROLES or similar
  // Or better, let's just use text conditionally based on role:
  const getHeaderTitle = () => {
    if (role === USER_ROLES.admin) return "Platform Orders";
    if (role === USER_ROLES.restaurent_owner) return "Restaurant Orders";
    return "Your Orders";
  };
  const getHeaderDesc = () => {
    if (role === USER_ROLES.admin) return "Monitor all orders across the platform";
    if (role === USER_ROLES.restaurent_owner) return "Track orders for your restaurant";
    return "Track and manage all your food orders";
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <Typography variant="h4" fontWeight={800}>
            {getHeaderTitle()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getHeaderDesc()}
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<Download size={18} />}
          onClick={handleDownloadCSV}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            backgroundColor: "#f97316",
            px: 2.5,
            py: 1.2,
            fontWeight: 700,
            "&:hover": { backgroundColor: "#ea580c" },
          }}
        >
          Download CSV
        </Button>
      </div>

      <div className="orders-stats">
        <Paper className="orders-stat-card">
          <div className="orders-stat-icon">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h3>{numberOfItems ?? 0}</h3>
            <p>Total Orders</p>
          </div>
        </Paper>

        <Paper className="orders-stat-card">
          <div className="orders-stat-icon orders-stat-icon--spend">
            <IndianRupee size={22} />
          </div>
          <div>
            <h3>₹{total ?? 0}</h3>
            <p>{role === USER_ROLES.restaurent_owner || role === USER_ROLES.admin ? "Total Revenue" : "Total Spend"}</p>
          </div>
        </Paper>

        <Paper className="orders-stat-card">
          <div className="orders-stat-icon orders-stat-icon--month">
            <CalendarDays size={22} />
          </div>
          <div>
            <h3>₹{spendThisMonth}</h3>
            <p>{role === USER_ROLES.restaurent_owner || role === USER_ROLES.admin ? "Revenue This Month" : "Spend This Month"}</p>
          </div>
        </Paper>
      </div>

      <Paper className="orders-table-wrapper">
        <div className="orders-table-head">
          <div>
            <h3>Recent Orders</h3>
            <span>{role === USER_ROLES.restaurent_owner || role === USER_ROLES.admin ? "Recent order history" : "Your food order history"}</span>
          </div>
        </div>

        <DataGrid
          rows={orderList || []}
          columns={columns}
          autoHeight
          pageSizeOptions={orderList?.length <= 5 ? [5] : [5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          className="foody-orders-grid"
        />
      </Paper>

    </div>
  );
};

export default Order;
