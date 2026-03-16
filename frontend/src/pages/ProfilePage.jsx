import { useEffect } from "react";
import { useState } from "react";
import { UserPen } from "lucide-react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../components/InputFields/TextInput";
import { email_Regrex, name_regrex, phone_regrex } from "../constant";
import CustomButton from "../components/InputFields/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/userSlice";
import AFormProvider from "../components/FormProvider";
import CustomSnackbar from "../components/CustomSnackbar";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .matches(name_regrex, "enter a valid name"),
    gender: yup.string().required("select a gender"),
    country: yup.string().required("select a country"),
    address: yup.string().required("address a country"),
    email: yup
      .string()
      .required("email is required")
      .matches(email_Regrex, "enter a valid email"),
    age: yup
      .number()
      .positive()
      .integer()
      .required("please enter your age")
      .max(120, "enter a valid age"),
    phone: yup
      .string()
      .matches(phone_regrex, "please enter valid contact number")
      .required("please enter your Contact Number")
      .length(10),
  })
  .required();

const ProfilePage = ({ close }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), disabled: readOnly });

  const { user, error, loading } = useSelector((state) => state.users);
  
  useEffect(() => {
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  }, [error]);

  useEffect(() => {
    if (!user) return;
    reset(user);
  }, [user]);

  const onSubmit = async (data) => {
    
    const formData = new FormData();
    if (file) formData.append("user_image", file);

    for (let key in data) {
      if(key=='role') continue
      formData.append(`${key}`, data[key]);
    }

    const result = await dispatch(updateProfile(formData));
    if (result) setReadOnly((pre) => !pre);

    if (result.payload?.success) close();
  };

  return (
    // main container
    <div>
      {user 
      ? (
        <Grid className="d-flex justify-content-center p-5 align-items-start gap-3">
      {/* left part */}
      <Grid className="d-flex flex-column gap-3">
        <Grid
          size={{ md: 12 }}
          className="d-flex justify-content-center align-items-center "
          width="110px"
        >
          <Grid>
            {!readOnly && (
              <input
                type="file"
                name="user_image"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            )}
            {/* { !readOnly &&  <TextInput type='file' name='user_image' control={control} error={errors} ></TextInput> } */}

            {readOnly && (
              <img
                src={
                  user?.user_image
                    ? `http://localhost:8000/${user?.user_image}`
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="user Img"
                width="50px"
              />
            )}
          </Grid>
        </Grid>

        <AFormProvider onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} className="d-flex flex-column">
            <Grid>
              <TextInput
                name="name"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="text"
              />
            </Grid>
            <Grid>
              <TextInput
                name="age"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="number"
              />
            </Grid>
            <Grid>
              <TextInput
                name="email"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="text"
              />
            </Grid>
            <Grid>
              <TextInput
                name="address"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="text"
              />
            </Grid>
            <Grid>
              <TextInput
                name="phone"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="number"
              />
            </Grid>

            <Grid>
              <TextInput
                name="gender"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="text"
              />
            </Grid>

            <Grid>
              <TextInput
                name="country"
                readOnly={readOnly}
                control={control}
                error={errors}
                type="text"
              />
            </Grid>

            {!readOnly && (
              <Grid>
                {!loading ? (
                  <CustomButton color="blue" name="Update" variant="outlined" />
                ) : (
                  <Button size="small" color="primary" variant="contained">
                    <CircularProgress color="white" size="25px" />
                    <div className="px-2 py-1">Updating</div>
                  </Button>
                )}
              </Grid>
            )}
          </Grid>
        </AFormProvider>

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

      <Grid>
        <Button onClick={() => setReadOnly((pre) => !pre)}>
          <UserPen />
        </Button>
      </Grid>
    </Grid>
      )
    : (
      <div className="p-5 d-flex flex-column text-secondary justify-content-center align-items-center gap-3"  >
        <CircularProgress/>
        <h5>Loading user profile</h5>
      </div>
    ) }
    </div>
  );
};

export default ProfilePage;
