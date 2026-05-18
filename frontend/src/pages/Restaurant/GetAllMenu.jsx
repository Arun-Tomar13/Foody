import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ArrowLeft, Pen, Plus, Search, Trash2, Upload } from "lucide-react";
import {
  addMenu,
  getAllMenu,
  getMenuItemById,
  removeMenu,
  updateMenu,
} from "../../store/slices/menuSlice";
import { useParams } from "react-router";
import AddMenuItemForm from "../../components/AddMenuItemForm";
import DialogBox from "../../components/InputFields/DialogBox";
import { getAllCategories } from "../../store/slices/categorySlice";
import BulkMenuAdd from "../../components/BulkMenuAdd";
import { FOODY_DATA_GRID_SX } from "../../constants/dataGridConfig";

const GetAllMenu = () => {
  const [openforAdd, setOpenforAdd] = useState(false);
  const [openForUpdate, setOpenforUpdate] = useState(false);
  const [openForBulkUpload, setOpenForBulkUpload] = useState(false);
  const [page, setpage] = useState(0);
  const [limit, setLimit] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { menuItem, menuList, totalMenu, loading } = useSelector(
    (state) => state.menu,
  );
  const { categoryList } = useSelector((state) => state.category);
  const { categoryid, id } = useParams();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpenforAdd(false);
    setOpenforUpdate(false);
    setOpenForBulkUpload(false);
  };

  const removeMenuItem = async (menuId) => {
    await dispatch(removeMenu(menuId));
  };

  useEffect(() => {
    const getCategories = async () => {
      if (id) {
        await dispatch(getAllCategories({ id }));
        return;
      }

      await dispatch(getAllCategories({}));
    };

    getCategories();
  }, [dispatch, id]);

  useEffect(() => {
    const payload = {
      page,
      limit,
      restaurantid: id,
      categoryid: categoryid || categoryFilter,
      searchQuery,
    };

    if (searchQuery) {
      const getData = setTimeout(() => {
        dispatch(getAllMenu(payload));
      }, 500);

      return () => clearTimeout(getData);
    }

    dispatch(getAllMenu(payload));
  }, [categoryFilter, categoryid, dispatch, id, limit, page, searchQuery]);

  const columns = [
    {
      field: "image",
      headerName: "Dish",
      sortable: false,
      minWidth: 95,
      renderCell: (params) => (
        <img
          src={`${import.meta.env.VITE_Image_URL}/${params.row.image}`}
          className="menu-grid-thumb"
          alt={`${params.row.name} dish`}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      sortable: false,
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <span className="grid-cell-name">{params.row.name}</span>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            px: 1.6,
            py: 0.45,
            borderRadius: "999px",

            fontSize: "0.72rem",
            fontWeight: 800,

            textTransform: "uppercase",
            letterSpacing: "0.04em",

            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 30,

            minWidth: 72,

            background:
              params.row.type === "veg"
                ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                : "linear-gradient(135deg,#fee2e2,#fecaca)",

            color:
              params.row.type === "veg"
                ? "#166534"
                : "#991b1b",

            border:
              params.row.type === "veg"
                ? "1px solid #86efac"
                : "1px solid #fca5a5",

            boxShadow:
              params.row.type === "veg"
                ? "0 6px 14px rgba(34,197,94,0.12)"
                : "0 6px 14px rgba(239,68,68,0.12)",
          }}
        >
          {params.row.type === "veg"
            ? "🟢 Veg"
            : "🔴 Non Veg"}
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      flex: 1.4,
      minWidth: 230,
    },
    {
      field: "category_id",
      headerName: "Category",
      sortable: false,
      minWidth: 115,
    },
    {
      field: "price",
      headerName: "Price",
      sortable: false,
      minWidth: 95,
      renderCell: (params) => (
        <span className="grid-cell-price">Rs. {params.row.price}</span>
      ),
    },
    {
      field: "isAvailable",
      headerName: "Status",
      sortable: false,
      minWidth: 125,
      renderCell: (params) => (
        <span className="grid-status-cell">
          <span
            className={`status-pill status-pill--compact ${params.row.isAvailable ? "open" : "closed"
              }`}
          >
            {params.row.isAvailable ? "available" : "paused"}
          </span>
        </span>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      minWidth: 85,
      renderCell: (params) => (
        <button
          type="button"
          className="grid-action-btn grid-action-btn--edit"
          aria-label={`Edit ${params.row.name}`}
          onClick={async () => {
            await dispatch(getMenuItemById(params.row.id));
            setOpenforUpdate(true);
          }}
        >
          <Pen size={17} />
        </button>
      ),
    },
    {
      field: "remove",
      headerName: "Remove",
      sortable: false,
      minWidth: 100,
      renderCell: (params) => (
        <button
          type="button"
          className="grid-action-btn grid-action-btn--danger"
          aria-label={`Remove ${params.row.name}`}
          onClick={() => removeMenuItem(params.row.id)}
        >
          <Trash2 size={17} />
        </button>
      ),
    },
  ];

  const setPagination = (data) => {
    setpage(data.page);
    setLimit(data.pageSize);
  };

  return (
    <>
    {categoryid && (
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
      <div className="dashboard-toolbar">
        
        <div>
          <h3 className="foody-section-title">Menu items</h3>
          <p className="foody-muted">
            Keep dishes searchable, priced, and ready for customers.
          </p>
        </div>

        <div className="dashboard-actions menu-management-actions">
          {categoryList.length > 0 && !categoryid && (
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel id="category-selection">Category</InputLabel>
              <Select
                id="category-selection"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              >
                <MenuItem value="">All</MenuItem>
                {categoryList.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            size="small"
            placeholder="Search dish"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={16} />,
            }}
            sx={{
              minWidth: 180,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "8px",
                gap: 1,
              },
            }}
          />

          {categoryid ? (
            <Button
              variant="contained"
              startIcon={<Plus size={17} />}
              onClick={() => setOpenforAdd(true)}
              sx={{
                borderRadius: "999px",
                backgroundColor: "#f97316",
                fontWeight: 850,
                "&:hover": { backgroundColor: "#c2410c" },
              }}
            >
              Dish
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<Upload size={17} />}
              onClick={() => setOpenForBulkUpload(true)}
              sx={{ borderRadius: "999px", color: "#16803c", borderColor: "#16803c" }}
            >
              Menu upload
            </Button>
          )}
        </div>

        <DialogBox
          open={openForBulkUpload}
          onClose={handleClose}
          title="Bulk upload items"
          maxWidth="md"
          component={<BulkMenuAdd close={handleClose} />}
        />
        <DialogBox
          open={openforAdd}
          onClose={handleClose}
          title="Add item"
          maxWidth="sm"
          component={
            <AddMenuItemForm
              fn={addMenu}
              forAdd={true}
              close={handleClose}
              data={{
                name: "",
                description: "",
                type: "",
                price: "",
                category_id: categoryid,
                isAvailable: 1,
              }}
            />
          }
        />
      </div>

      {menuItem && (
        <DialogBox
          open={openForUpdate}
          onClose={handleClose}
          title="Update item"
          maxWidth="sm"
          component={
            <AddMenuItemForm
              forAdd={false}
              fn={updateMenu}
              data={menuItem}
              close={handleClose}
            />
          }
        />
      )}

      <div className="foody-table-card">
        <DataGrid
          className="foody-data-grid"
          rows={menuList || []}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: limit, page } },
          }}
          pageSizeOptions={menuList.length <= 5 ? [5] : [2, 4, 6, 8, 10, { value: totalMenu, label: "All" }]}
          pagination
          loading={loading}
          paginationMode="server"
          rowCount={totalMenu ? totalMenu : 5}
          onPaginationModelChange={setPagination}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          rowHeight={64}
          sx={FOODY_DATA_GRID_SX}
        />
      </div>

    </>
  );
};

export default GetAllMenu;
