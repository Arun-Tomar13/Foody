import { Button, Grid } from "@mui/material";
import { bulkUpload } from "../store/slices/categorySlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { CloudUpload, DeleteIcon } from "lucide-react";
import { FILE_SIZE } from "../constant";
import { useParams } from "react-router";
import { toast } from "react-toastify";

const AddCategoryInBulk = ({ close }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const param = useParams()

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Accepted Files", acceptedFiles);
    if (acceptedFiles.size >= FILE_SIZE) {
          toast.warning("File size exceeded it must be between 12kb");
        } else {
          if (acceptedFiles[0].type != "text/csv") {
            toast.warning("File must be csv");
          } else {
            if (acceptedFiles.length > 1) {
              toast.warning("only one file allowed");
            } else {
               setFile(acceptedFiles[0]);
            }
          }
        }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) formData.append("categories", file);
    console.log(formData);

    const result = await dispatch(bulkUpload(param.id ? { file: formData, restaurant_id:param.id }: {file: formData}));
    console.log("category bulk result", result);

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

export default AddCategoryInBulk;
