import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCartItem,
  decreaseCartItem,
  deleteAllCartItem,
  getAllCart,
} from "../../store/slices/cartSlice";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../store/slices/orderSlice";
import {
  addAddress,
  getAddressByUserId,
  removeAddressById,
} from "../../store/slices/addressSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormProvider from "../../components/FormProvider";
import TextInput from "../../components/InputFields/TextInput";
import { getAllTransactions } from "../../store/slices/transactionSlice";
import {
  AlertCircle,
  CheckCircle2,
  Leaf,
  MapPin,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Trash2,
  Wallet,
  Wheat,
  X,
} from "lucide-react";

const CartPage = ({ close }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemList, total, numberOfItems } = useSelector(
    (state) => state.cart,
  );
  const { loading } = useSelector((state) => state.order);
  const { balance } = useSelector((state) => state.transaction);
  const { addressList } = useSelector((state) => state.address);
  const [curentAddress, setCurentAddress] = useState("");
  const [isAdd, setIsAdd] = useState(false);

  const schema = yup
    .object({
      address: yup.string().required("address is required"),
    })
    .required();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const cartSummary = useMemo(() => {
    const safeBalance = Number(balance || 0);
    const safeTotal = Number(total || 0);

    return {
      safeBalance,
      safeTotal,
      canPay: safeBalance >= safeTotal,
      topUpAmount: Math.max(safeTotal - safeBalance, 0),
    };
  }, [balance, total]);

  useEffect(() => {
    dispatch(getAllCart());
    dispatch(getAllTransactions());
    dispatch(getAddressByUserId());
  }, [dispatch]);

  const handleOrder = async () => {
    const order = await dispatch(createOrder(curentAddress));

    if (order.payload?.success) {
      const result = await dispatch(deleteAllCartItem());

      if (result.payload?.success) {
        close?.();
        navigate(`/order/${order.payload?.data}`, {
          state: { successful: true },
        });
      }
    }
  };

  const onSubmitForAddress = async (data) => {
    const result = await dispatch(addAddress(data));
    if (result.payload?.success) {
      setIsAdd(false);
    }
  };

  const handleAddressDelete = async (id) => {
    await dispatch(removeAddressById(id));
    if (curentAddress) setCurentAddress("");
  };

  const handleTopUp = () => {
    close?.();
    navigate("/transactions");
  };

  const handleBrowseMenu = () => {
    close?.();
    navigate("/");
  };

  return (
    <div className="cart-shell">
      {itemList.length > 0 ? (
        <>
          <header className="cart-header">
            <div>
              <p className="dashboard-eyebrow">Your cart</p>
              <h2>Review your order</h2>
              <p className="foody-muted">
                Choose a delivery address, adjust quantities, and place the
                order when everything looks right.
              </p>
            </div>
            <div className="cart-header-badge">
              <ShoppingBag size={16} />
              {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
            </div>
            <IconButton
            onClick={()=> close?.()}
            size="small"
            sx={{
              width: 38,
              height: 38,

              borderRadius: "12px",

              background:
                "#fff7ed",

              border:
                "1px solid #fed7aa",

              color: "#f97316",

              transition:
                "all 0.22s ease",

              "&:hover": {
                background:
                  "#ffedd5",

                transform:
                  "rotate(90deg)",
              },
            }}
          >
            <X size={18} />
          </IconButton>
          </header>

          <div className="cart-grid">
            <section className="cart-panel">
              <div className="cart-panel-inner">
                <div className="cart-address-bar">
                  {addressList.length > 0 ? (
                    <FormControl fullWidth size="small">
                      <Select
                        displayEmpty
                        value={curentAddress}
                        name="address"
                        onChange={(e) => setCurentAddress(e.target.value)}
                        renderValue={(selected) =>
                          selected ? (
                            selected
                          ) : (
                            <span className="foody-muted">
                              Select delivery address
                            </span>
                          )
                        }
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                        }}
                      >
                        {addressList.map((option) => (
                          <MenuItem key={option.id} value={option.address}>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              gap={2}
                              width="100%"
                            >
                              <span>{option.address}</span>
                              <IconButton
                                size="small"
                                aria-label="Remove address"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleAddressDelete(option.id);
                                }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <div className="cart-address-warning">
                      <AlertCircle size={16} /> Add an address to continue.
                    </div>
                  )}

                  <label className="cart-address-toggle">
                    <Switch
                      checked={isAdd}
                      onChange={(e) => setIsAdd(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#f97316",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#f97316",
                          },
                      }}
                    />
                    Add address
                  </label>
                </div>

                {isAdd && (
                  <FormProvider onSubmit={handleSubmit(onSubmitForAddress)}>
                    <div className="cart-add-address">
                      <TextInput
                        type="text"
                        control={control}
                        error={errors}
                        name="address"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: "#2f2926",
                          "&:hover": { backgroundColor: "#1f1a17" },
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </FormProvider>
                )}

                <div className="cart-item-list">
                  {itemList.map((item) => {
                    const isVeg = item.type === "veg";

                    return (
                      <article className="cart-item" key={item.id}>
                        <div className="cart-item-thumb">
                          <img
                            src={`${import.meta.env.VITE_Image_URL}/${item.image}`}
                            alt={`${item.name} dish`}
                          />
                        </div>
                        <div className="cart-item-details">
                          <div className="cart-item-title-row">
                            <h3>{item.name}</h3>
                            <span
                              className={
                                isVeg
                                  ? "diet-badge diet-badge--veg"
                                  : "diet-badge diet-badge--nonveg"
                              }
                            >
                              {isVeg ? <Leaf size={12} /> : <Wheat size={12} />}
                              {isVeg ? "Veg" : "Non-veg"}
                            </span>
                          </div>
                          <div className="cart-item-meta">
                            <span>Rs. {item.price} each</span>
                            <span className="cart-line-total">
                              Line Rs. {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="cart-quantity" aria-label="Quantity">
                          <IconButton
                            size="small"
                            onClick={() => dispatch(decreaseCartItem(item.id))}
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={16} />
                          </IconButton>
                          <strong>{item.quantity}</strong>
                          <IconButton
                            size="small"
                            onClick={() => dispatch(addCartItem(item.item_id))}
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={16} />
                          </IconButton>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="cart-panel cart-summary">
              <div className="cart-panel-inner cart-summary-card">
                <div className="operator-chip">
                  <ReceiptText size={16} />
                  Order summary
                </div>
                <Divider sx={{ my: 2 }} />
                <div className="summary-line">
                  <span>Items</span>
                  <strong>{numberOfItems}</strong>
                </div>
                <div className="summary-line">
                  <span>Food total</span>
                  <strong>Rs. {cartSummary.safeTotal}</strong>
                </div>
                <div className="summary-line">
                  <span>Delivery</span>
                  <strong>Free</strong>
                </div>
                <div className="summary-line">
                  <span>
                    <Wallet size={15} /> Wallet balance
                  </span>
                  <strong>Rs. {cartSummary.safeBalance}</strong>
                </div>
                <div className="summary-total">
                  <span>To pay</span>
                  <strong>Rs. {cartSummary.safeTotal}</strong>
                </div>

                <Button
                  fullWidth
                  disabled={!curentAddress || !cartSummary.canPay || loading}
                  onClick={handleOrder}
                  variant="contained"
                  sx={{
                    mt: 2,
                    py: 1.25,
                    borderRadius: "8px",
                    backgroundColor: "#f97316",
                    fontWeight: 900,
                    "&:hover": { backgroundColor: "#c2410c" },
                  }}
                >
                  {!loading ? (
                    "Order now"
                  ) : (
                    <>
                      <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                      Ordering
                    </>
                  )}
                </Button>

                {!curentAddress && (
                  <div className="cart-address-warning">
                    <MapPin size={16} /> Select an address to order.
                  </div>
                )}

                {curentAddress && !cartSummary.canPay && (
                  <div className="cart-balance-warning">
                    <AlertCircle size={16} /> Wallet is short by Rs.{" "}
                    {cartSummary.topUpAmount}.
                    <Button onClick={handleTopUp} sx={{ ml: 1 }}>
                      Top up
                    </Button>
                  </div>
                )}

                {curentAddress && cartSummary.canPay && (
                  <div className="cart-ready-note">
                    <CheckCircle2 size={16} /> Address and wallet are ready.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <div className="cart-empty-icon" aria-hidden="true">
            <ShoppingBag size={42} />
          </div>
          <h2 className="foody-section-title">Your cart is empty</h2>
          <p className="foody-muted">
            Add a dish from the menu and your order review will appear here.
          </p>
          <Button
            variant="contained"
            onClick={handleBrowseMenu}
            sx={{
              mt: 2,
              borderRadius: "8px",
              backgroundColor: "#f97316",
              "&:hover": { backgroundColor: "#c2410c" },
            }}
          >
            Browse menu
          </Button>
        </div>
      )}

    </div>
  );
};

export default CartPage;
