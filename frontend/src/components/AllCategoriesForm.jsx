import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  getAllCategories,
  getCategoryInfoById,
  removeCategory,
  updateCategory,
} from "../store/slices/categorySlice";
import { Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteIcon, Pen, Plus } from "lucide-react";
import AddCategoryForm from "./AddCategoryForm";
import DialogBox from "./InputFields/DialogBox";
import { Link, useParams } from "react-router";
import AddCategoryInBulk from "./AddCategoryInBulk";
import CustomSnackbar from "./CustomSnackbar";

const AllCategories = ({ id=null }) => {
  const dispatch = useDispatch();

  const [openforAdd, setOpenforAdd] = useState(false);
  const [openforBulkUpload, setOpenforBulkUpload] = useState(false);
  const [openForUpdate, setOpenforUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const {categoryList, error,loading } = useSelector((state) => state.category);

  const handleClickOpenForAdd = () => {
    setOpenforAdd(true);
  };
  const handleClickOpenForUpdate = () => {
    setOpenforUpdate(true);
  };

  const handleClose = () => {
    setOpenforAdd(false);
    setOpenforUpdate(false);
    setOpenforBulkUpload(false);
  };

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  }, [error]);

  useEffect(() => {
    const fetchCategory = async () => {
      let result;
      
      if(id) result = await dispatch(getAllCategories({id}));
      else result = await dispatch(getAllCategories({}));
      
    };
    fetchCategory();
  }, []);

  const handleDelete = async (id) => {
    const result = await dispatch(removeCategory(id));
  };

  const { category } = useSelector((state) => state.category);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      sortable: false,
      width: "100",
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      width: "200",
    },
    {
      field: "isAvailable",
      headerName: "Available",
      sortable: false,
      width: "100",
      renderCell: (params) => params.row.isAvailable ? 'yes' : 'no'
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      width: "100",
      renderCell: (params) => (
        <div>
          <Button
            onClick={async () => {
              // setValue(params.row);
              await dispatch(getCategoryInfoById(params.row.id));
              handleClickOpenForUpdate();
            }}
          >
            <Pen />
          </Button>
        </div>
      ),
    },
    {
      field: "remove",
      headerName: "Remove",
      sortable: false,
      width: "100",
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon color="red" />
        </Button>
      ),
    },
    {
      field: "view",
      headerName: "see menu",
      sortable: false,
      width: "100",
      renderCell: (params) => (
        <Link to={`/restaurant${id ? `/${id}` : ''}/category/${params.row.id}`}>menu</Link>
      ),
    },
  ];

  return (
    <Grid container direction="column" spacing={2}>
      <Grid className="d-flex justify-content-between">
        <h3>Categories</h3>
        <div className="d-flex gap-3">
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              setOpenforBulkUpload(true);
            }}
          >
            <Plus />
            Bulk Upload
          </Button>

          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              handleClickOpenForAdd();
            }}
          >
            <Plus />
            Add
          </Button>
        </div>

        {/* bulk upload dialogbox */}
        <DialogBox
          open={openforBulkUpload}
          onClose={handleClose}
          title="bulk upload of categories"
          component={<AddCategoryInBulk close={handleClose} />}
        />

        {/* add dialogbox */}
        <DialogBox
          open={openforAdd}
          onClose={handleClose}
          title="add category"
          component={
            <AddCategoryForm
              fn={addCategory}
              close={handleClose}
              data={{ name: "", description: "",isAvailable:1 }}
              restaurant_id= {id ? id : null}
            />
          }
        />
      </Grid>

      <Grid>
        {/* update dialogbox */}
        <DialogBox
          open={openForUpdate}
          onClose={handleClose}
          title="update category"
          component={
            <AddCategoryForm
              fn={updateCategory}
              data={category}
              close={handleClose}
            />
          }
        />
        <DataGrid
          rows={categoryList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          loading={loading}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Grid>
      {/* Error Text */}
      {error && (
        <CustomSnackbar
          type="error"
          variant="filled"
          open={open}
          message={error.message}
        />
      )}
    </Grid>
  );
};

export default AllCategories;
