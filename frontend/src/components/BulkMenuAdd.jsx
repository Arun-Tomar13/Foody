import { Button, Grid } from "@mui/material";
import { bulkUpload } from "../store/slices/categorySlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { CloudUpload, Cross, Delete, DeleteIcon, DrumstickIcon } from "lucide-react";
import { FILE_SIZE } from "../constant";
import { bulkMenuAdd } from "../store/slices/menuSlice";
import { useParams } from "react-router";

const BulkMenuAdd = ({ close }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const param = useParams()

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Accepted Files", acceptedFiles);
    // if(acceptedFiles.size >= FILE_SIZE) {
    //   "File size exceeded"
    // }
    // if(acceptedFiles.includes("")) {

    // }
    // else {
    //   "Invalid File"
    // }
    setFile(acceptedFiles[0]);
    
  }, []);
  const { getRootProps, getInputProps,isDragAccept } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) formData.append("menu", file);

    const result = await dispatch(bulkMenuAdd( param.id ? {formData,restaurant_id:param.id} : {formData}));

    if (result.payload.success) {
      close();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <Grid
      padding={3}
      spacing={2}
      container
      direction="column"
      justifyContent="center"
      alignContent="center"
    >
        <Grid>
          <Button variant="contained" {...getRootProps()}>
            <input className="bg-dark" {...getInputProps()} />
            <CloudUpload /> upload
          </Button>
          { file && <Button onClick={()=>setFile(null)} ><DeleteIcon/></Button>}

         <br/> {file ? file.name : ""}
          <br /> {!file && <p>drag and drop file</p>}
        </Grid>
        <Grid>
          {file && (
            <Button variant="contained" type="submit">
              Submit
            </Button>
          )}
        </Grid>
    </Grid>
      </form>
  );
};

export default BulkMenuAdd;
