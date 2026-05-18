import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Leaf, Plus, Search, Store, Wheat } from "lucide-react";
import { getAllMenu } from "../../store/slices/menuSlice";
import { addCartItem } from "../../store/slices/cartSlice";
import ChartItemChoice from "./ChartItemChoice";
import DialogBox from "../../components/InputFields/DialogBox";
import {
  CUSTOMER_HERO_SLIDES,
  HERO_ROTATE_MS,
} from "../../constants/customerHeroSlides";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [openForCartChoice, setOpenForCartChoice] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [limit] = useState(20);
  const hasLoadedOnce = useRef(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const { menuList, loading } = useSelector((state) => state.menu);
  const errorFromCart = useSelector((state) => state.cart?.error);
  const user = useSelector((state) => state.users?.user);

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        dispatch(getAllMenu({ limit, searchQuery }));
      }, 500);

      return () => clearTimeout(getData);
    }

    dispatch(getAllMenu({ limit }));
  }, [dispatch, limit, searchQuery]);

  useEffect(() => {
    if (!loading) hasLoadedOnce.current = true;
  }, [loading]);

  const activeHero = CUSTOMER_HERO_SLIDES[heroIndex];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % CUSTOMER_HERO_SLIDES.length);
    }, HERO_ROTATE_MS);

    return () => clearInterval(timer);
  }, []);

  const handleAddCartItem = async (id) => {
    const result = await dispatch(addCartItem(id));

    if (
      !result.payload?.success &&
      result.payload?.message === "item is from other restaurant"
    ) {
      setOpenForCartChoice(true);
      setItemId(id);
    }
  };

  const handleClose = () => {
    setOpenForCartChoice(false);
  };

  const getDescription = (description = "") => {
    if (!description) return "Freshly prepared and ready for your next order.";
    return description.length > 72
      ? `${description.slice(0, 72)}...`
      : description;
  };

  const showInitialLoader = loading && !hasLoadedOnce.current;

  return (
    <Box className="foody-page customer-dashboard">
      <section className="customer-hero">
        <div className="customer-hero-copy">
          <div className="customer-hero-head" key={activeHero.id}>
            <p className="dashboard-eyebrow customer-hero-eyebrow hero-slide-text">
              {activeHero.eyebrow}
            </p>
            <h1 className="hero-slide-text">{activeHero.title}</h1>
          </div>

          <div className="customer-search-row">
            <TextField
              fullWidth
              size="small"
              placeholder="Search biryani, pizza, dosa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  height: 42,
                },
              }}
            />
            <Button
              variant="contained"
              disabled={!searchQuery}
              onClick={() => setSearchQuery("")}
              sx={{
                minWidth: 88,
                height: 42,
                borderRadius: "8px",
                backgroundColor: "#2f2926",
                "&:hover": { backgroundColor: "#1f1a17" },
              }}
            >
              Clear
            </Button>
          </div>

          <p className="foody-muted customer-hero-welcome hero-slide-text" key={`${activeHero.id}-welcome`}>
            Welcome {user?.name || "food lover"}. {activeHero.welcome}
          </p>

        </div>

        <div className="customer-hero-visual customer-hero-visual--hungry">
          {CUSTOMER_HERO_SLIDES.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.imageAlt}
              className={index === heroIndex ? "is-active" : ""}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}

          <div className="customer-hero-hungry-card" key={`${activeHero.id}-badge`}>
            <span className="customer-hero-emoji hero-slide-text" aria-hidden="true">
              {activeHero.emoji}
            </span>
            <div className="hero-slide-text">
              <strong>{activeHero.badgeTitle}</strong>
              <p>{activeHero.badgeText}</p>
            </div>
          </div>

          <div className="customer-hero-dots" role="tablist" aria-label="Hero slides">
            {CUSTOMER_HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Show ${slide.badgeTitle}`}
                aria-selected={index === heroIndex}
                className={index === heroIndex ? "is-active" : ""}
                onClick={() => setHeroIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {showInitialLoader ? (
        <Box
          minHeight="40vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress sx={{ color: "#f97316" }} />
        </Box>
      ) : (
        <div className="menu-section">
          {menuList && menuList.length > 0 ? (
            <>
              <div className="menu-toolbar">
                <div>
                  <p className="dashboard-eyebrow">Menu</p>
                  <h2 className="foody-section-title">
                    {searchQuery
                      ? `Results for "${searchQuery}"`
                      : "Popular dishes"}
                  </h2>
                </div>
                <div className="operator-chip">
                  <Store size={16} />
                  Open kitchens update live
                </div>
              </div>

              <div className="menu-grid-wrap">
                {loading && (
                  <div className="menu-grid-overlay" aria-hidden="true">
                    <CircularProgress size={28} sx={{ color: "#f97316" }} />
                  </div>
                )}
                <div className={`menu-grid ${loading ? "is-loading" : ""}`}>
                  {menuList.map((item) => {
                    const isAvailable =
                      item.isAvailable &&
                      item.isRestaurantOpen &&
                      item.isCategoryOpen;
                    const isVeg = item.type === "veg";

                    return (
                      <article className="food-card" key={item.id}>
                        <div className="food-card-media">
                          <img
                            src={`${import.meta.env.VITE_Image_URL}/${item.image}`}
                            alt={`${item.name} dish`}
                          />
                          <span
                            className={`food-status-chip ${
                              isAvailable ? "open" : "closed"
                            }`}
                          >
                            {isAvailable ? "Available" : "Closed"}
                          </span>
                        </div>

                        <div className="food-card-body">
                          <div className="food-title-row">
                            <h3>{item.name}</h3>
                            <span
                              className={
                                isVeg
                                  ? "diet-badge diet-badge--veg"
                                  : "diet-badge diet-badge--nonveg"
                              }
                              title={isVeg ? "Vegetarian" : "Non vegetarian"}
                            >
                              {isVeg ? <Leaf size={12} /> : <Wheat size={12} />}
                              {isVeg ? "Veg" : "Non-veg"}
                            </span>
                          </div>
                          <p className="food-description">
                            {getDescription(item.description)}
                          </p>

                          <div className="food-card-footer">
                            <span className="food-price">
                              <small>Price</small>
                              Rs. {item.price}
                            </span>
                            <Button
                              className="food-add-btn"
                              disabled={!isAvailable}
                              variant="contained"
                              startIcon={isAvailable ? <Plus size={16} /> : null}
                              onClick={() => handleAddCartItem(item.id)}
                              sx={{
                                borderRadius: "999px",
                                backgroundColor: "#f97316",
                                color: "#fff",
                                fontWeight: 800,
                                textTransform: "none",
                                "&:hover": { backgroundColor: "#c2410c" },
                              }}
                            >
                              {isAvailable ? "Add" : "Unavailable"}
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state-panel">
              <img
                src="https://static.vecteezy.com/system/resources/previews/023/833/970/non_2x/search-no-result-data-information-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                alt="No menu results"
              />
              <h2 className="foody-section-title">No result found</h2>
              <p className="foody-muted">
                Try a different dish name or clear the search for the full menu.
              </p>
            </div>
          )}
        </div>
      )}

      <DialogBox
        open={openForCartChoice}
        onClose={handleClose}
        title={errorFromCart?.message}
        maxWidth="sm"
        component={<ChartItemChoice id={itemId} close={handleClose} />}
      />

    </Box>
  );
};

export default CustomerPage;
