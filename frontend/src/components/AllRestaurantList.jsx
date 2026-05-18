import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurant,
  removeRestaurantById,
} from "../store/slices/restaurantSlice";
import { Button } from "@mui/material";
import { Eye, Plus, Trash2, Upload } from "lucide-react";
import { Link } from "react-router";
import DialogBox from "./InputFields/DialogBox";
import CreateRestaurantPage from "../pages/Restaurant/CreateRestaurantPage";
import BulkMenuAdd from "./BulkMenuAdd";
import { FOODY_DATA_GRID_SX } from "../constants/dataGridConfig";
import AddCategoryInBulk from "./AddCategoryInBulk";

const AllRestaurantList = () => {
  const [openRestaurant, setOpenRestaurant] = useState(false);
  const [openBulkMenu, setOpenBulkMenu] = useState(false);
  const [openBulkCategory, setOpenBulkCategory] = useState(false);

  const { restaurantList } = useSelector((state) => state?.restaurant);
  const dispatch = useDispatch();

  const removeRestro = async (id) => {
    await dispatch(removeRestaurantById(id));
  };

  useEffect(() => {
    dispatch(getAllRestaurant());
  }, [dispatch]);

  const handleClose = () => {
    setOpenRestaurant(false);
    setOpenBulkMenu(false);
    setOpenBulkCategory(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Restaurant",
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="grid-cell-name">{params.row.name}</span>
      ),
    },
    {
      field: "type",
      headerName: "Serves",
      sortable: false,
      minWidth: 110,
    },
    {
      field: "address",
      headerName: "Address",
      sortable: false,
      flex: 1.2,
      minWidth: 220,
    },
    {
      field: "isOpen",
      headerName: "Availability",
      sortable: false,
      minWidth: 130,
      renderCell: (params) => (
        <span className="grid-status-cell">
          <span
            className={`status-pill status-pill--compact ${
              params.row.isOpen ? "open" : "closed"
            }`}
          >
            {params.row.isOpen ? "open" : "closed"}
          </span>
        </span>
      ),
    },
    {
      field: "openingTime",
      headerName: "Opens",
      sortable: false,
      minWidth: 105,
    },
    {
      field: "closingTime",
      headerName: "Closes",
      sortable: false,
      minWidth: 105,
    },
    {
      field: "rating",
      headerName: "Rating",
      sortable: false,
      minWidth: 90,
    },
    {
      field: "view",
      headerName: "Details",
      sortable: false,
      minWidth: 120,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/restaurant/${params.row.id}`}
          size="small"
          startIcon={<Eye size={15} />}
          sx={{ color: "#c2410c", fontWeight: 800 }}
        >
          View
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Remove",
      sortable: false,
      minWidth: 90,
      renderCell: (params) => (
        <button
          type="button"
          className="grid-action-btn grid-action-btn--danger"
          aria-label={`Remove ${params.row.name}`}
          onClick={() => removeRestro(params.row.id)}
        >
          <Trash2 size={17} />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="dashboard-toolbar">
        <div>
          <p className="dashboard-eyebrow">Directory</p>
          <h2 className="foody-section-title">All restaurants</h2>
          <p className="foody-muted">
            Scan store status, timings, and owner setup in one table.
          </p>
        </div>

        <div className="dashboard-actions">
          <Button
            variant="outlined"
            startIcon={<Upload size={17} />}
            onClick={() => setOpenBulkCategory(true)}
            sx={{ borderRadius: "999px", color: "#16803c", borderColor: "#16803c" }}
          >
            Categories
          </Button>

          <Button
            variant="outlined"
            startIcon={<Upload size={17} />}
            onClick={() => setOpenBulkMenu(true)}
            sx={{ borderRadius: "999px", color: "#16803c", borderColor: "#16803c" }}
          >
            Menu bulk
          </Button>

          <Button
            variant="contained"
            startIcon={<Plus size={17} />}
            onClick={() => setOpenRestaurant(true)}
            sx={{
              borderRadius: "999px",
              backgroundColor: "#f97316",
              fontWeight: 850,
              "&:hover": { backgroundColor: "#c2410c" },
            }}
          >
            Restaurant
          </Button>
        </div>

        <DialogBox
          open={openBulkCategory}
          onClose={handleClose}
          title="Upload CSV file"
          maxWidth="md"
          component={<AddCategoryInBulk close={handleClose} />}
        />

        <DialogBox
          open={openBulkMenu}
          onClose={handleClose}
          title="Upload CSV file"
          maxWidth="md"
          component={<BulkMenuAdd close={handleClose} />}
        />

        <DialogBox
          open={openRestaurant}
          onClose={handleClose}
          title="Add restaurant"
          maxWidth="sm"
          component={<CreateRestaurantPage close={handleClose} />}
        />
      </div>

      <div className="foody-table-card">
        <DataGrid
          className="foody-data-grid"
          rows={restaurantList || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          rowHeight={58}
          sx={FOODY_DATA_GRID_SX}
        />
      </div>

    </>
  );
};

export default AllRestaurantList;
