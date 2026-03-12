import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCartItem,
  decreaseCartItem,
  deleteAllCartItem,
  getAllCart,
} from "../../store/slices/cartSlice";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteIcon, Minus, Plus } from "lucide-react";
import { Button, CircularProgress, Grid, MenuItem, Select, Switch } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../store/slices/orderSlice";
import {
  addAddress,
  getAddressByUserId,
  removeAddressById,
} from "../../store/slices/addressSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormProvider from "../../components/FormProvider";
import { useState } from "react";
import TextInput from "../../components/InputFields/TextInput";
import CustomButton from "../../components/InputFields/CustomButton";
import { getAllTransactions } from "../../store/slices/transactionSlice";
import CustomSnackbar from "../../components/CustomSnackbar";

const CartPage = ({ close }) => {
  const dispatch = useDispatch();
  const { itemList, total, numberOfItems, error } = useSelector(
    (state) => state.cart,
  );
  
  const { loading } = useSelector(
    (state) => state.order,
  );
  const { balance } = useSelector((state) => state.transaction);
  const { addressList } = useSelector((state) => state.address);
  const [curentAddress, setCurentAddress] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [open, setOpen] = useState(false);

  const schema = yup
    .object({
      address: yup.string().required("address is required"),
    })
    .required();

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  }, [error]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const columns = [
    {
      field: "image",
      headerName: "Image",
      sortable: false,
      renderCell: (params) => (
        <div>
          <img
            src={`http://localhost:8000/${params.row.image}`}
            className="img-fluid "
            alt="food Img"
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      sortable: false,
    },
    {
      field: "type",
      headerName: "type",
      sortable: false,
    },
    {
      field: "price",
      headerName: "price",
      sortable: false,
    },
    {
      field: "remove",
      headerName: "Remove",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="warning"
          onClick={() => dispatch(decreaseCartItem(params.row.id))}
        >
          <Minus color="black" />
        </Button>
      ),
    },
    {
      field: "quantity",
      headerName: "quantity",
      sortable: false,
    },
    {
      field: "add",
      headerName: "Add",
      sortable: false,
      renderCell: (params) => (
        <Button
          color="success"
          variant="contained"
          onClick={() => dispatch(addCartItem(params.row.item_id))}
        >
          <Plus color="black" />
        </Button>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleOrder = async () => {
    const order = await dispatch(createOrder(curentAddress));

    if (order.payload?.success) {
      const result = await dispatch(deleteAllCartItem());
      console.log("result o", result);

      if (result.payload?.success) {
        close();
        navigate(`/order/${order.payload?.data}`, {
          state: { successful: true },
        });
      }
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      dispatch(getAllTransactions());
      const address = await dispatch(getAddressByUserId());
      console.log("all address", address);
    };
    fetchAddress();
  }, []);

  const onSubmitForAddress = async (data) => {
    const result = await dispatch(addAddress(data));
    if (result.payload?.success) {
      setIsAdd(false);
    }
  };

  const handleAddressDelete = async (data) => {
    const result = await dispatch(removeAddressById(data));
    console.log("address delete", result);
  };

  return (
    <div className="p-2 d-flex flex-column justify-content-center">
      {itemList.length > 0 ? (
        <div>
          <div>
            <Grid container size={12}>
              {addressList.length > 0 && (
                <Grid size={6}>
                  <Select
                    fullWidth
                    defaultValue=""
                    name="address"
                    label="address"
                    onChange={(e) => setCurentAddress(e.target.value)}
                  >
                    {addressList.map((option) => (
                      <MenuItem key={option.id} value={option.address}>
                        <div className="d-flex justify-content-between">
                          <p>{option.address} </p>
                          <Button
                            onClick={() => {
                              handleAddressDelete(option.id);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )}
              <Grid size={6}>
                <Switch
                  checked={isAdd}
                  onChange={(e) => setIsAdd(e.target.checked)}
                />{" "}
                Add address
              </Grid>
            </Grid>
            {isAdd && (
              <FormProvider onSubmit={handleSubmit(onSubmitForAddress)}>
                <Grid container spacing={2} size={{ md: 12 }}>
                  <Grid size={{ md: 6 }}>
                    <TextInput
                      type="text"
                      control={control}
                      error={errors}
                      name="address"
                    />
                  </Grid>
                  <Grid size={{ md: 4 }}>
                    <CustomButton
                      name="submit"
                      color="blue"
                      variant="contained"
                    />
                  </Grid>
                </Grid>
              </FormProvider>
            )}
          </div>
          {itemList && (
            <>
              <DataGrid
                rows={itemList}
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
                <h4>total items{numberOfItems}</h4> <h3>total ${total}</h3>
              </div>

              <div className="d-flex justify-content-center">
                {!curentAddress == "" ? (
                  balance > total ? (
                    <div>
                      {!loading ? (
                        <Button onClick={handleOrder} variant="contained">
                          Order Now
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                        >
                          <CircularProgress color="white" size="25px" />
                          <div className="px-2 py-1">Ordering </div>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-black bg-danger bg-opacity-50 rounded px-3 py-1 shadow">
                      Your balance is low, please
                      <Button
                        onClick={() => {
                          close();
                          navigate("/transactions");
                        }}
                      >
                        Top Up ${total-balance}
                      </Button>
                      to order
                    </p>
                  )
                ) : (
                  <p className="text-danger bg-warning bg-opacity-25 px-3 py-1 shadow">
                    Select address to order
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <img
            src="https://media.istockphoto.com/id/861576608/vector/empty-shopping-bag-icon-online-business-vector-icon-template.jpg?s=612x612&w=0&k=20&c=I7MbHHcjhRH4Dy0NVpf4ZN4gn8FVDnwn99YdRW2x5k0="
            width="420px"
            alt="empty cart"
          />
          <p className="text-danger px-3 py-1 shadow">
            cart is empty. Please add items to order
          </p>
        </div>
      )}
       {error && (
          <CustomSnackbar
            type="error"
            variant="filled"
            open={open}
            message={error.message}
          />
        )}
    </div>
  );
};

export default CartPage;
