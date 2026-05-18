export const FOODY_DATA_GRID_SX = {
  minHeight: 440,
  border: "none",
  fontSize: "0.875rem",
  "& .MuiDataGrid-columnHeaders": {
    minHeight: "48px !important",
    maxHeight: "48px !important",
  },
  "& .MuiDataGrid-columnHeader": {
    outline: "none !important",
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    outline: "none !important",
  },
  "& .MuiDataGrid-row": {
    transition: "background-color 0.15s ease",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#fffaf4",
  },
  "& .MuiDataGrid-footerContainer": {
    minHeight: 52,
    borderTop: "1px solid #f0ddce",
  },
  "& .MuiTablePagination-root": {
    color: "#7b6b63",
  },
  "& .MuiDataGrid-overlay": {
    backgroundColor: "rgba(255, 250, 244, 0.6)",
  },
};
