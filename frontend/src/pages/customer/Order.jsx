import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateCSVOdOrders,
  getAllOrder,
  getOrderItemById,
} from "../../store/slices/orderSlice";
import { useNavigate } from "react-router";
import CustomSnackbar from "../../components/CustomSnackbar";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(()=>{dispatch(getAllOrder())},[])

  const { orderList, total, numberOfItems, downloadLink,error } = useSelector(
    (state) => state.order,
  );

    useEffect(() => {
      if (error) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }
    }, [error]);

  const columns = [
    {
      field: "date",
      headerName: "date",
      sortable: false,
      width: "110",
      renderCell: (params) => <div>{params.value.split("T")[0]}</div>,
    },
    {
      field: "time",
      headerName: "time",
      sortable: false,
      width: "110",
      renderCell: (params) => (
        <div>{params.row.date.split("T")[1].split(".")[0]}</div>
      ),
    },
    {
      field: "status",
      headerName: "status",
      sortable: false,
    },
    {
      field: "name",
      headerName: "placed_by",
      sortable: false,
    },
    {
      field: "total",
      headerName: "total price",
      sortable: false,
    },
    {
      field: "address",
      headerName: "address",
      sortable: false,
    },
    {
      field: "view",
      headerName: "view order",
      sortable: false,
      width: "110",
      renderCell: (params) => (
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            // dispatch(getOrderItemById(params.row.id));
            navigate(`/order/${params.row.id}`);
          }}
        >
          details
        </Button>
      ),
    },
  ];

  const handleDownloadCSV = async () => {
    const result = await dispatch(generateCSVOdOrders());

    if (result.payload?.success) {
      console.log(downloadLink);
      
      navigate(result.payload.data);
    }
  };

  return (
    <div className="p-2 d-flex flex-column">
      {orderList && (
        <div className="d-flex flex-column justify-content-center gap-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-primary">Your orders</h2>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadCSV}
            >
              Download
            </Button>
          </div>
          <div className="d-flex flex-column gap-3">
            <DataGrid
              rows={orderList}
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
            <div className="d-flex justify-content-between">
              <h4>total orders : {numberOfItems}</h4>
              <h3>total spend : ₹{total}</h3>
            </div>
          </div>
        </div>
      )}
      {/* Error Text */}
            {error && (
              <CustomSnackbar type='error' variant="filled" open={open} message={error.message} />
            )}
    </div>
  );
};

export default Order;
