import { Link, useNavigate } from "react-router";
import { Avatar, Button } from "@mui/material";
import { LogOut, Menu, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DialogBox from "./InputFields/DialogBox";
import ProfilePage from "../pages/ProfilePage";
import CartPage from "../pages/customer/CartPage";
import { getAllCart } from "../store/slices/cartSlice";
import { logoutUser } from "../store/slices/userSlice";
import LogoutConfirm from "./LogoutConfirm";
import { USER_ROLES } from "../constant";

const Navbar = ({ showMenuButton = false, onMenuClick }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { numberOfItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    if (user?.role !== USER_ROLES.customer) return;

    dispatch(getAllCart());
  }, [dispatch, user?.role]);

  const handleClose = () => {
    setOpenCart(false);
    setOpenProfile(false);
    setOpenLogout(false);
  };

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (result.payload?.success) {
      localStorage.removeItem("Bearer");
      setOpenLogout(false);
      navigate("/login");
    }
  };

  return (
    <header className="app-navbar">
      <div className="app-navbar-start">
        {showMenuButton && (
          <Button
            className="navbar-menu-btn"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            title="Open menu"
          >
            <Menu size={22} strokeWidth={2.5} />
          </Button>
        )}
        <Link to="/" className="app-navbar-brand">
          <img src="/foody.png" width="42" height="42" alt="Foody logo" />
          <span>Foody</span>
        </Link>
      </div>

      <div className="app-navbar-actions">
        <Button
          className="navbar-icon-btn"
          onClick={() => setOpenProfile(true)}
          aria-label="Open profile"
        >
          <Avatar
            src={
              user
                ? `${import.meta.env.VITE_Image_URL}/${user?.user_image}`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Profile"
            sx={{ width: 36, height: 36 }}
          />
        </Button>

        <DialogBox
          open={openProfile}
          onClose={handleClose}
          title="User Profile"
          maxWidth="sm"
          component={<ProfilePage close={handleClose} />}
        />

        {user?.role === USER_ROLES.customer && (
          <>
            <Button
              className="navbar-cart-btn"
              onClick={() => setOpenCart(true)}
              aria-label={`Open cart, ${numberOfItems} items`}
            >
              <ShoppingCart size={20} />
              {numberOfItems > 0 && (
                <span className="navbar-cart-count">{numberOfItems}</span>
              )}
            </Button>

            <DialogBox
              open={openCart}
              onClose={handleClose}
              title=""
              showTitle={false}
              maxWidth="lg"
              component={<CartPage close={handleClose} />}
            />
          </>
        )}

        <Button
          className="navbar-icon-btn navbar-logout-btn"
          onClick={() => setOpenLogout(true)}
          aria-label="Log out"
        >
          <LogOut size={20} />
        </Button>

        <DialogBox
          open={openLogout}
          onClose={handleClose}
          title=""
          showTitle={false}
          maxWidth="sm"
          component={
            <LogoutConfirm
              close={handleClose}
              onConfirm={handleLogout}
            />
          }
        />
      </div>

    </header>
  );
};

export default Navbar;
