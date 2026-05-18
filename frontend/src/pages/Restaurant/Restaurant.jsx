import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, MapPin, Pencil, Plus, Store, UtensilsCrossed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantInfoById,
} from "../../store/slices/restaurantSlice";
import { useParams } from "react-router";
import AllCategories from "../../components/AllCategoriesForm";
import GetAllMenu from "./GetAllMenu";
import DialogBox from "../../components/InputFields/DialogBox";
import CreateRestaurantPage from "./CreateRestaurantPage";
import EditRestaurantForm from "../../components/EditRestaurantForm";

const RestroOwner = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const dispatch = useDispatch();
  // const params = useParams();
  const { id } = useParams();

  const { restaurant, loading, hasRestro } = useSelector(
    (state) => state?.restaurant,
  );

  useEffect(() => {
    const getRestaurantData = async () => {
      if (id) {
        await dispatch(getRestaurantInfoById({id }));
        return;
      }

      await dispatch(getRestaurantInfoById({}));
    };

    getRestaurantData();
  }, [dispatch,id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  if (loading && hasRestro === null) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress sx={{ color: "#f97316" }} />
      </Box>
    );
  }

  return (
    <Box className="restaurant-owner-page">
      {id && (
      <Button
        onClick={() => window.history.back()}
        startIcon={<ArrowLeft size={18} />}
        variant="outlined"
        sx={{
          alignSelf: "flex-start",

    borderRadius: "14px",

    textTransform: "none",

    fontWeight: 700,

    px: 2.2,
    py: 1,

    color: "#f97316",

    borderColor: "#fed7aa",

    background: "#fff7ed",

    transition: "all 0.25s ease",

    "&:hover": {
      background: "#ffedd5",
      borderColor: "#fb923c",

      transform:
        "translateX(-2px)",
    },
  }}
>
  Back
</Button>)}
      {hasRestro ? (
        <div className="restaurant-owner-main">
          <section className="restaurant-owner-hero">
            <div>
              <div className="restaurant-hero-heading">
                <div>
                  <p className="dashboard-eyebrow">Restaurant control</p>
                  <h1>{restaurant?.name || "Your restaurant"}</h1>
                </div>
                <IconButton
                  className="restaurant-edit-btn"
                  aria-label="Edit restaurant details"
                  onClick={() => setOpenEdit(true)}
                >
                  <Pencil size={18} />
                </IconButton>
              </div>
              <p className="foody-muted" style={{ maxWidth: 620 }}>
                Manage kitchen status, menu items, and categories from one
                dashboard.
              </p>
            </div>

            <div className="restaurant-status-strip">
              <span className="operator-chip">
                <Store size={16} />
                {restaurant?.type || "menu"}
              </span>
              <span className="operator-chip">
                <MapPin size={16} />
                {restaurant?.address || "Address pending"}
              </span>
              <span className="operator-chip">
                <Clock3 size={16} />
                {restaurant?.openingTime} - {restaurant?.closingTime}
              </span>
              <span
                className={`status-pill ${restaurant?.isOpen ? "open" : "closed"}`}
              >
                {restaurant?.isOpen ? "open" : "closed"}
              </span>
            </div>
          </section>

          <section className="restaurant-dashboard-shell">
            <div className="dashboard-toolbar">

              <div className="restaurant-tabs">
                <Button
                  onClick={() => setShowCategory(false)}
                  className={`restaurant-tab-button ${
                    !showCategory ? "active" : ""
                  }`}
                  startIcon={<UtensilsCrossed size={16} />}
                >
                  Menu
                </Button>
                <Button
                  onClick={() => setShowCategory(true)}
                  className={`restaurant-tab-button ${
                    showCategory ? "active" : ""
                  }`}
                  startIcon={<Store size={16} />}
                >
                  Category
                </Button>
              </div>
            </div>

            <div className="cart-panel-inner">
              {!showCategory ? <GetAllMenu /> : <AllCategories id={id || null} />}
            </div>
          </section>

          <DialogBox
            open={openEdit}
            onClose={handleCloseEdit}
            title="Edit restaurant"
            maxWidth="sm"
            component={<EditRestaurantForm close={handleCloseEdit} />}
          />
        </div>
      ) : (
        <div className="create-restaurant-empty">
          <video src="/create_restaurant.mp4" autoPlay loop muted />
          <div>
            <p className="dashboard-eyebrow">First setup</p>
            <h1 className="foody-section-title">Create your restaurant</h1>
            <p className="foody-muted">
              Add your store profile once, then start managing menus and
              categories from the dashboard.
            </p>
          </div>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: "999px",
              backgroundColor: "#f97316",
              fontWeight: 850,
              "&:hover": { backgroundColor: "#c2410c" },
            }}
          >
            Create
          </Button>
          <DialogBox
            open={open}
            onClose={handleClose}
            title="Add restaurant"
            maxWidth="sm"
            component={<CreateRestaurantPage close={handleClose} />}
          />
        </div>
      )}
    </Box>
  );
};

export default RestroOwner;
