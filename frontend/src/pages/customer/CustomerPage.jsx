import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenu } from "../../store/slices/menuSlice";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { addCartItem } from "../../store/slices/cartSlice";
import { CircleDot, LoaderPinwheel } from "lucide-react";
import CustomSnackbar from "../../components/CustomSnackbar";
import ChartItemChoice from "./ChartItemChoice";
import DialogBox from "../../components/InputFields/DialogBox";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openForCartChoice, setOpenForCartChoice] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(async () => {
        dispatch(getAllMenu({ limit, searchQuery }));
      }, 500);
      return () => clearTimeout(getData);
    } else dispatch(getAllMenu({ limit }));
  }, [searchQuery]);

  const { menuList, error, loading } = useSelector((state) => state.menu);
  const errorFromCart = useSelector((state) => state.cart?.error);
  const user = useSelector((state) => state.users?.user);

  useEffect(() => {
    if (error || errorFromCart) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }, [error || errorFromCart]);

  const handleAddCartItem = async (id) => {
    const result = await dispatch(addCartItem(id));
    if (
      !result.payload.success &&
      result.payload.message == "item is from other restaurant"
    ) {
      
      setOpenForCartChoice(true);
      setItemId(id);
    }
  };

  const handleClose = () => {
    setOpenForCartChoice(false);
  };

  return (
    <div>
      {!loading ? (
        <Grid container direction="column">
          <Grid container justifyContent="space-between">
            {/* Search */}
            <h3> welcome {user?.name} wanna eat </h3>
            <TextField
              autoFocus={searchQuery ? true : false}
              className="px-5"
              placeholder="search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>

          {menuList && menuList.length > 0 ? (
            <Grid container direction="column">
              <Grid container spacing={5} padding={2}>
                {menuList.map((item) => (
                  <Grid key={item.id} boxShadow={3} width="180px">
                    <Card
                      key={item.id}
                      className="d-flex h-100 flex-column align-items-center"
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={`http://192.168.1.156:8000/${item.image}`}
                          alt={`${item.name} image`}
                        />
                        <CardContent>
                          <Typography>
                            {item.name}
                            <CircleDot
                              size={16}
                              strokeWidth={3}
                              absoluteStrokeWidth
                              color={item.type == "veg" ? "green" : "red"}
                            />
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {item.description.slice(0, 20)}
                          </Typography>
                        </CardContent>
                        <Typography>
                          <span className="bg-warning bg-opacity-75 px-4 py-2 rounded-5">
                            price : ₹{item.price}
                          </span>
                        </Typography>
                      </CardActionArea>

                      <CardActions>
                        <Button
                          color="primary"
                          disabled={
                            !item.isAvailable ||
                            !item.isRestaurantOpen ||
                            !item.isCategoryOpen
                              ? true
                              : false
                          }
                          variant="outlined"
                          onClick={() => handleAddCartItem(item.id)}
                        >
                          {!item.isAvailable ||
                          !item.isRestaurantOpen ||
                          !item.isCategoryOpen
                            ? "Not available"
                            : "Add to cart"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ) : (
            <Grid
              minHeight="80vh"
              container
              direction="column"
              alignItems="center"
            >
              <img
                className="w-50"
                src="https://static.vecteezy.com/system/resources/previews/023/833/970/non_2x/search-no-result-data-information-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                alt=""
              />
              <Typography>No result found for {searchQuery}</Typography>
            </Grid>
          )}

          {/* Cart item choice (discard/replace) */}
          <DialogBox
            open={openForCartChoice}
            onClose={handleClose}
            title={errorFromCart?.message}
            component={<ChartItemChoice id={itemId} close={handleClose} />}
          />

          {/* Error Text */}
          {(errorFromCart || error) && (
            <CustomSnackbar
              type={"error"}
              variant="filled"
              open={open}
              message={error ? error?.message : errorFromCart?.message}
            />
          )}
        </Grid>
      ) : (
        <Grid>
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
};

export default CustomerPage;
