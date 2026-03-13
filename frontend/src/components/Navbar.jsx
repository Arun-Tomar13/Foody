import { Link, Navigate, useNavigate } from "react-router";
import { Avatar, Button, Grid } from "@mui/material";
import { LogOut, ShoppingCartIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DialogBox from "./InputFields/DialogBox";
import ProfilePage from "../pages/ProfilePage";
import CartPage from "../pages/customer/CartPage";
import { getAllCart } from "../store/slices/cartSlice";
import { getProfile, logoutUser } from "../store/slices/userSlice";
import CustomSnackbar from "./CustomSnackbar";
import { USER_ROLES } from "../constant";

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { numberOfItems } = useSelector((state) => state.cart);
  const {user,error} = useSelector((state) => state.users);

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  }, [error]);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getAllCart());
  }, []);

  const handleClickOpenCart = () => {
    setOpenCart(true);
  };
  const handleClickOpenProfile = () => {
    setOpenProfile(true);
  };

  const handleClose = () => {
    setOpenCart(false);
    setOpenProfile(false);
  };

  const handleLogout = () => {
    const logout = async () => {
      const result = await dispatch(logoutUser());

      if (result.payload?.success) {
        localStorage.setItem("Bearer", "");
        navigate('/login')
      }
    };
    logout();
  };

  return (
    <div>
      <Grid
        className="d-flex justify-content-between px-5 py-2 bg-dark
"
      >
        <Grid size={{ md: 12 }}>
          <Link to="/" className="text-white text-decoration-none">
            Foody
          </Link>
        </Grid>
        <div>
          <Button onClick={() => handleClickOpenProfile(true)}>
            <Avatar
              src={
                user
                  ? `http://localhost:8000/${user?.user_image}`
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="user Img"
            />
          </Button>
          {/* profile dialogbox */}
          <DialogBox
            open={openProfile}
            onClose={handleClose}
            title="User Profile"
            component={<ProfilePage close={handleClose} />}
          />

          {user?.role==USER_ROLES.customer && <Button onClick={() => handleClickOpenCart(true)}>
            <ShoppingCartIcon color="green" />
            <sup className="text-success">{numberOfItems}</sup>
          </Button>}
          {/* cart dialogbox */}
          <DialogBox
            open={openCart}
            onClose={handleClose}
            title="Cart"
            component={<CartPage close={handleClose} />}
          />

          <Button onClick={handleLogout}>
            <LogOut />
          </Button>
        </div>
        {error && (
          <CustomSnackbar
            type="error"
            variant="filled"
            open={open}
            message={error.message}
          />
        )}
      </Grid>
    </div>
  );
};

export default Navbar;
