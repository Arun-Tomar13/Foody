import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
} from "@mui/material";
import { DeleteIcon, Pen, Plus } from "lucide-react";
import {
  addMenu,
  getAllMenu,
  getMenuItemById,
  removeMenu,
  updateMenu,
} from "../../store/slices/menuSlice";
import { useNavigate, useParams } from "react-router";
import AddMenuItemForm from "../../components/AddMenuItemForm";
import DialogBox from "../../components/InputFields/DialogBox";
import { getAllCategories } from "../../store/slices/categorySlice";
import BulkMenuAdd from "../../components/BulkMenuAdd";
import CustomSnackbar from "../../components/CustomSnackbar";

const GetAllMenu = () => {
  const [openforAdd, setOpenforAdd] = useState(false);
  const [openForUpdate, setOpenforUpdate] = useState(false);
  const [openForBulkUpload, setOpenForBulkUpload] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setpage] = useState(0);
  const [limit, setLimit] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { menuItem, menuList, totalMenu, error, loading } = useSelector(
    (state) => state.menu,
  );
  const { categoryList } = useSelector((state) => state.category);

  const handleClose = () => {
    setOpenforAdd(false);
    setOpenforUpdate(false);
    setOpenForBulkUpload(false);
  };

  const removeMenuItem = async (id) => {
    const result = await dispatch(removeMenu(id));
  };

  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  }, [error]);

  
  const { categoryid, id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getCategories = async () => {
      let result;
      if (id) result = await dispatch(getAllCategories({ id }));
      else result = await dispatch(getAllCategories({}));
    };
    getCategories();
  }, []);

  useEffect(() => {
    let data;

    if (searchQuery) {
      const getData = setTimeout(async () => {
        data = await dispatch(
          getAllMenu({
            page,
            limit,
            restaurantid: id,
            categoryid: categoryid || categoryFilter,
            searchQuery,
          }),
        );
      }, 500);
      return () => clearTimeout(getData);
    } else {
      data = dispatch(
        getAllMenu({
          page,
          limit,
          restaurantid: id,
          categoryid: categoryid || categoryFilter,
        }),
      );
    }
  }, [page, limit, searchQuery, categoryFilter]);

  const columns = [
    {
      field: "image",
      headerName: "Image",
      sortable: false,
      renderCell: (params) => (
        <div>
          <img
            src={`http://192.168.1.156:8000/${params.row.image}`}
            className="img-fluid "
            alt="food Img"
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      sortable: false,
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
    },
    {
      field: "category_id",
      headerName: "Category",
      sortable: false,
    },
    {
      field: "price",
      headerName: "Price",
      sortable: false,
    },
    {
      field: "isAvailable",
      headerName: "Available",
      sortable: false,
      renderCell: (params) => <div>{params.row.isAvailable ? 'Yes' : "No"}</div>
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      renderCell: (params) => (
        <div>
          <Button
            onClick={async () => {
              dispatch(getMenuItemById(params.row.id));
              setOpenforUpdate(true);
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
      renderCell: (params) => (
        <Button onClick={() => removeMenuItem(params.row.id)}>
          <DeleteIcon color="red" />
        </Button>
      ),
    },
  ];

  const setPagination = (data) => {
    setpage(data.page);
    setLimit(data.pageSize);
  };

  return (
    <Grid className="d-flex flex-column gap-3">
      <Grid className="d-flex justify-content-between">
        <h3>Menu items</h3>
        <Grid className="d-flex gap-3">
          {/* Filter */}
          {categoryList.length > 0 && !categoryid && (
            <FormControl fullWidth>
              <InputLabel id="category-selection">Category</InputLabel>

              <Select
                id="category-selection"
                label="Category"
                defaultValue=""
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-100"
              >
                <MenuItem id="212jj2" value={null}>
                  None
                </MenuItem>
                {categoryList.map((option) => (
                  <MenuItem id={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Search */}
          <TextField
            className="w-100"
            placeholder="search by name"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {categoryid ? (
            <Button
              variant="outlined"
              color="success"
              onClick={() => setOpenforAdd(true)}
            >
              <Plus />
              Add
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                setOpenForBulkUpload(true);
              }}
            >
              <Plus />
              Menu upload
            </Button>
          )}
        </Grid>

        {/* bulk upload dialogbox */}
        <DialogBox
          open={openForBulkUpload}
          onClose={handleClose}
          title="bulk upload item"
          component={<BulkMenuAdd close={handleClose} />}
        />
        {/* add dialogbox */}
        <DialogBox
          open={openforAdd}
          onClose={handleClose}
          title="add item"
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
                isAvailable:1
              }}
            />
          }
        />
      </Grid>

      <Grid>
        {/* update dialogbox */}
        {menuItem && (
          <DialogBox
            open={openForUpdate}
            onClose={handleClose}
            title="update item"
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

        {/* MenuList */}
        <DataGrid
          rows={menuList}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: limit, page: page } },
          }}
          pageSizeOptions={[2, 4, 6, 8, 10, { value: totalMenu, label: "All" }]}
          pagination
          loading={loading}
          paginationMode="server"
          rowCount={totalMenu ? totalMenu : 5}
          onPaginationModelChange={setPagination}
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

export default GetAllMenu;
