import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  getAllCategories,
  getCategoryInfoById,
  removeCategory,
  updateCategory,
} from "../store/slices/categorySlice";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Eye, Pen, Plus, Trash2, Upload } from "lucide-react";
import AddCategoryForm from "./AddCategoryForm";
import DialogBox from "./InputFields/DialogBox";
import { Link } from "react-router";
import AddCategoryInBulk from "./AddCategoryInBulk";
import { FOODY_DATA_GRID_SX } from "../constants/dataGridConfig";

const AllCategories = ({ id = null }) => {
  const dispatch = useDispatch();

  const [openforAdd, setOpenforAdd] = useState(false);
  const [openforBulkUpload, setOpenforBulkUpload] = useState(false);
  const [openForUpdate, setOpenforUpdate] = useState(false);
  const { categoryList, loading, category } = useSelector(
    (state) => state.category,
  );

  const handleClose = () => {
    setOpenforAdd(false);
    setOpenforUpdate(false);
    setOpenforBulkUpload(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        await dispatch(getAllCategories({ id }));
        return;
      }

      await dispatch(getAllCategories({}));
    };

    fetchCategory();
  }, [dispatch, id]);

  const handleDelete = async (categoryId) => {
    await dispatch(removeCategory(categoryId));
  };

  const columns = [
    {
      field: "name",
      headerName: "Category",
      sortable: false,
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <span className="grid-cell-name">{params.row.name}</span>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      flex: 1.4,
      minWidth: 220,
    },
    {
      field: "isAvailable",
      headerName: "Status",
      sortable: false,
      minWidth: 120,
      renderCell: (params) => (
        <span className="grid-status-cell">
          <span
            className={`status-pill status-pill--compact ${
              params.row.isAvailable ? "open" : "closed"
            }`}
          >
            {params.row.isAvailable ? "available" : "paused"}
          </span>
        </span>
      ),
    },
    {
      field: "view",
      headerName: "Menu",
      sortable: false,
      minWidth: 110,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/restaurant${id ? `/${id}` : ""}/category/${params.row.id}`}
          size="small"
          startIcon={<Eye size={15} />}
          sx={{ color: "#c2410c", fontWeight: 800 }}
        >
          View
        </Button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      minWidth: 90,
      renderCell: (params) => (
        <button
          type="button"
          className="grid-action-btn grid-action-btn--edit"
          aria-label={`Edit ${params.row.name}`}
          onClick={async () => {
            await dispatch(getCategoryInfoById(params.row.id));
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
          onClick={() => handleDelete(params.row.id)}
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
          <p className="dashboard-eyebrow">Menu structure</p>
          <h3 className="foody-section-title">Categories</h3>
          <p className="foody-muted">
            Group dishes into clean customer-facing sections.
          </p>
        </div>
        <div className="dashboard-actions">
          <Button
            variant="outlined"
            startIcon={<Upload size={17} />}
            onClick={() => setOpenforBulkUpload(true)}
            sx={{ borderRadius: "999px", color: "#16803c", borderColor: "#16803c" }}
          >
            Bulk upload
          </Button>

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
            Category
          </Button>
        </div>

        <DialogBox
          open={openforBulkUpload}
          onClose={handleClose}
          title="Bulk upload categories"
          maxWidth="md"
          component={<AddCategoryInBulk close={handleClose} />}
        />

        <DialogBox
          open={openforAdd}
          onClose={handleClose}
          title="Add category"
          maxWidth="sm"
          component={
            <AddCategoryForm
              fn={addCategory}
              close={handleClose}
              data={{ name: "", description: "", isAvailable: 1 }}
              restaurant_id={id ? id : null}
            />
          }
        />
      </div>

      <DialogBox
        open={openForUpdate}
        onClose={handleClose}
        title="Update category"
        maxWidth="sm"
        component={
          <AddCategoryForm fn={updateCategory} data={category} close={handleClose} />
        }
      />

      <div className="foody-table-card">
        <DataGrid
          className="foody-data-grid"
          rows={categoryList || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          loading={loading}
          pageSizeOptions={[10]}
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

export default AllCategories;
