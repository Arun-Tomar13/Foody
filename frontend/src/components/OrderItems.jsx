import { DataGrid } from "@mui/x-data-grid";
import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import {
  getOrderItemById,
} from "../store/slices/orderSlice";

import {
  CheckCircle2,
  Package,
  ShoppingBag,
} from "lucide-react";

const OrderItems = () => {
  const location = useLocation();

  const { successful = null } =
    location.state || {};

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { id } = useParams();

  const {
    orderItemList,
    total,
    numberOfItems,
  } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    const fetchOrderDetail =
      async () => {
        await dispatch(
          getOrderItemById(id),
        );
      };

    fetchOrderDetail();
  }, [dispatch, id]);

  useEffect(() => {
    if (successful) {
      setTimeout(() => {
        navigate("/");
      }, 4000);
    }
  }, [successful, navigate]);

  const columns = [
    {
      field: "image",
      headerName: "Item",
      sortable: false,
      minWidth: 220,
      flex: 1.4,

      renderCell: (params) => (
        <div className="order-food-cell">
          <img
            src={`${import.meta.env.VITE_Image_URL}/${params.row.image}`}
            className="order-food-image"
            alt="food"
          />

          <div className="order-food-info">
            <strong>
              {params.row.name}
            </strong>

            <span>
              {
                params.row
                  .restaurant_name
              }
            </span>
          </div>
        </div>
      ),
    },

    {
      field: "type",
      headerName: "Type",
      sortable: false,
      minWidth: 120,
      flex: 1,

      renderCell: (params) => (
        <div
          className={`food-type-chip ${
            params.value === "veg"
              ? "veg"
              : "nonveg"
          }`}
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "price",
      headerName: "Price",
      sortable: false,
      minWidth: 120,
      flex: 1,

      renderCell: (params) => (
        <strong>
          ₹{params.value}
        </strong>
      ),
    },

    {
      field: "quantity",
      headerName: "Qty",
      sortable: false,
      minWidth: 100,
      flex: 0.8,
    },

    {
      field: "itemTotal",
      headerName: "Total",
      sortable: false,
      minWidth: 120,
      flex: 1,

      renderCell: (params) => (
        <strong className="text-success">
          ₹
          {params.row.quantity *
            params.row.price}
        </strong>
      ),
    },
  ];

  return (
    <div className="order-items-page">
      {orderItemList && (
        <>
          {successful ? (
            <div className="order-success-card">
              <div className="success-animation">
                <CheckCircle2
                  size={90}
                />
              </div>

              <h2>
                Order Placed Successfully 🎉
              </h2>

              <p>
                Your delicious food is
                being prepared and will
                arrive soon.
              </p>
            </div>
          ) : (
            <div className="order-page-header">
              <div>
                <h2>
                  Order Details
                </h2>

                <p>
                  Review your ordered
                  food items
                </p>
              </div>
            </div>
          )}

          <div className="order-summary-grid">
            <div className="order-summary-card">
              <div className="summary-icon">
                <ShoppingBag
                  size={22}
                />
              </div>

              <div>
                <strong>
                  {numberOfItems}
                </strong>

                <span>
                  Total Items
                </span>
              </div>
            </div>

            <div className="order-summary-card">
              <div className="summary-icon orange">
                <Package
                  size={22}
                />
              </div>

              <div>
                <strong>
                  ₹{total}
                </strong>

                <span>
                  Total Amount
                </span>
              </div>
            </div>
          </div>

          <div className="order-table-wrapper">
            <div className="order-table-head">
              <div>
                <h3>
                  Ordered Items
                </h3>

                <span>
                  Freshly prepared for
                  you
                </span>
              </div>
            </div>

            <DataGrid
              rows={orderItemList}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel:
                    {
                      pageSize: 5,
                    },
                },
              }}
              pageSizeOptions={orderItemList.length <= 5 ? [5] : [5, 10]}
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              disableColumnResize
              className="foody-order-grid"
            />
          </div>
        </>
      )}

    </div>
  );
};

export default OrderItems;
