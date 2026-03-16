import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurant,
  removeRestaurantById,
} from "../store/slices/restaurantSlice";
import { Grid, Button, Box } from "@mui/material";
import { DeleteIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import DialogBox from "./InputFields/DialogBox";
import CreateRestaurantPage from "../pages/Restaurant/CreateRestaurantPage";
import BulkMenuAdd from "./BulkMenuAdd";
import CustomSnackbar from "./CustomSnackbar";
import AddCategoryInBulk from "./AddCategoryInBulk";

const AllRestaurantList = () => {
  const [openRestaurant, setOpenRestaurant] = useState(false);
  const [openBulkMenu, setOpenBulkMenu] = useState(false);
  const [openBulkCategory, setOpenBulkCategory] = useState(false);
  const [open, setOpen] = useState(false);

  const { restaurantList } = useSelector((state) => state?.restaurant);
  const error = useSelector((state) => state?.menu?.error);
  const categoryrror = useSelector((state) => state?.category?.error);
  const dispatch = useDispatch();

  const removeRestro = async (id) => {
    const result = await dispatch(removeRestaurantById(id));
  };

    useEffect(() => {
      if (error || categoryrror ) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 8000);
      }
    }, [error,categoryrror]);

  useEffect(() => {
    dispatch(getAllRestaurant());
  }, []);

  const handleClose = () => {
    setOpenRestaurant(false);
    setOpenBulkMenu(false);
    setOpenBulkCategory(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      sortable: false,
    },
    {
      field: "type",
      headerName: "Serves",
      sortable: false,
    },
    {
      field: "address",
      headerName: "Address",
      sortable: false,
    },
    {
      field: "isOpen",
      headerName: "Availability",
      sortable: false,
      renderCell:(params)=> params.row.isOpen ? 'open' : 'close'
    },
    {
      field: "openingTime",
      headerName: "Opens at",
      sortable: false,
    },
    {
      field: "closingTime",
      headerName: "Closes at",
      sortable: false,
    },
    {
      field: "rating",
      headerName: "Rating",
      sortable: false,
    },

    {
      field: "delete",
      headerName: "Remove",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => removeRestro(params.row.id)}>
          <DeleteIcon color="red" />
        </Button>
      ),
    },
    {
      field: "view",
      headerName: "see details",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/restaurant/${params.row.id}`}>see details</Link>
      ),
    },
  ];

  return (
    <Grid container direction="column" spacing={2}>
      <Grid className="d-flex justify-content-between">
        <h3>All Restaurant</h3>

        <Grid container spacing={1} >

          {/* Add category in Bulk Button */}
          <Button
            variant="outlined"
            color="success"
            onClick={() => setOpenBulkCategory(true)}
          >
            <Plus /> Add Categories
          </Button>

          {/* Add menu in Bulk Button */}
          <Button
            variant="outlined"
            color="success"
            onClick={() => setOpenBulkMenu(true)}
          >
            <Plus /> Add Menu Bulk
          </Button>

          {/* Add Restaurant Button */}
          <Button
            variant="outlined"
            color="success"
            onClick={() => setOpenRestaurant(true)}
          >
            <Plus /> Add
          </Button>
        </Grid>

        {/*Bulk Category Upload Dialog Box  */}
        <DialogBox
          open={openBulkCategory}
          onClose={handleClose}
          title="upload CSV file"
          component={<AddCategoryInBulk close={handleClose} />}
        />

        {/*Bulk Menu Upload Dialog Box  */}
        <DialogBox
          open={openBulkMenu}
          onClose={handleClose}
          title="upload CSV file"
          component={<BulkMenuAdd close={handleClose} />}
        />

        {/*Add Restaurant Dialog Box */}
        <DialogBox
          open={openRestaurant}
          onClose={handleClose}
          title="add Restaurant"
          component={<CreateRestaurantPage close={handleClose} />}
        />

      </Grid>

      {/* List of All Restaurant */}
      <DataGrid
        rows={restaurantList}
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
      />

      {/* Error Text */}
            {(error || categoryrror) && (
              <CustomSnackbar type='error' variant="filled" open={open} message={error ? error.message : categoryrror.message} />
            )}
    </Grid>
  );
};

export default AllRestaurantList;
