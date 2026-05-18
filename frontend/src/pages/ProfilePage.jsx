import { useEffect, useState } from "react";
import { UserPen } from "lucide-react";
import {
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextInput from "../components/InputFields/TextInput";
import {
  country_optins,
  email_Regrex,
  name_regrex,
  phone_regrex,
} from "../constant";
import AutoComplete from "../components/InputFields/AutoComplete";
import CustomButton from "../components/InputFields/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/userSlice";
import AFormProvider from "../components/FormProvider";

const schema = yup
  .object({
    name: yup
      .string()
      .typeError("name is required")
      .required("Name is required")
      .matches(
        name_regrex,
        "enter a valid name",
      ),

    gender: yup
      .string()
      .typeError("gender is required")
      .oneOf(["male", "female", "other"])
      .required("select a gender"),

    country: yup
      .string()
      .typeError("country is required")
      .required("select a country"),

    address: yup
      .string()
      .typeError("address is required")
      .required("address is required"),

    email: yup
      .string()
      .typeError("email is required")
      .required("email is required")
      .matches(
        email_Regrex,
        "enter a valid email",
      ),

    age: yup
      .number()
      .positive()
      .typeError("age is required")
      .integer()
      .required("please enter your age")
      .max(120, "enter a valid age"),

    phone: yup
      .string()
      .typeError(
        "contact number is required",
      )
      .matches(
        phone_regrex,
        "please enter valid contact number",
      )
      .required(
        "please enter your Contact Number",
      )
      .length(10),
  })
  .required();

const ProfilePage = ({ close }) => {
  const [readOnly, setReadOnly] =
    useState(true);

  const [file, setFile] = useState(null);

  const [previewImage, setPreviewImage] =
  useState(null);

  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    disabled: readOnly,
  });

  const { user, loading } =
    useSelector((state) => state.users);

  useEffect(() => {
    if (!user) return;

    reset(user);
  }, [user, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (file) {
      formData.append("user_image", file);
    }

    for (let key in data) {
      if (key === "role") continue;

      formData.append(key, data[key]);
    }

    const result = await dispatch(
      updateProfile(formData),
    );

    if (result) {
      setReadOnly((prev) => !prev);
    }

    if (result.payload?.success) {
      close();
    }
  };

  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-top-section">
              <div className="profile-avatar-wrapper">
                {previewImage ? (
  <img
    src={previewImage}
    alt="Preview"
    className="profile-avatar"
  />
) : user?.user_image ? (
  <img
    src={`${import.meta.env.VITE_Image_URL}/${user?.user_image}`}
    alt="User"
    className="profile-avatar"
  />
) : (
  <div className="profile-avatar-fallback">
    {user?.name
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase()}
  </div>
)}

                {!readOnly && (
                  <>
                    <label
                      htmlFor="profile-upload"
                      className="profile-edit-btn"
                    >
                      <UserPen size={16} />
                    </label>

                    <input
                      id="profile-upload"
                      type="file"
                      name="user_image"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
  const selectedFile =
    e.target.files[0];

  if (selectedFile) {
    setFile(selectedFile);

    setPreviewImage(
      URL.createObjectURL(selectedFile),
    );
  }
}}
                    />
                  </>
                )}
              </div>

              <div className="profile-user-details">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>
            </div>

            {readOnly && <Button
              className="profile-main-edit-btn"
              onClick={() =>
                setReadOnly((prev) => !prev)
              }
            >
              <UserPen size={18} />
Edit Profile
            </Button>}
          </div>

          <AFormProvider
            onSubmit={handleSubmit(onSubmit)}
          >
            {!readOnly && (
  <Grid
    container
    spacing={2}
    alignItems="center"
    sx={{ mt: 1 }}
  >
    <Grid>
      <Button
        variant="outlined"
        startIcon={<UserPen size={18} />}
        onClick={() =>
          setReadOnly((prev) => !prev)
        }
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          px: 2.5,
          py: 1,
          borderColor: "#fed7aa",
          color: "#f97316",
          backgroundColor: "#fff7ed",
          "&:hover": {
            borderColor: "#fdba74",
            backgroundColor: "#ffedd5",
          },
        }}
      >
        Cancel
      </Button>
    </Grid>

    <Grid>
      {!loading ? (
        <CustomButton
          color="blue"
          name="Update Profile"
          variant="contained"
        />
      ) : (
        <Button
          variant="contained"
          className="or"
          disabled
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 2.5,
            py: 1,
          }}
        >
          <CircularProgress
            color="inherit"
            size="20px"
          />

          <div className="px-2">
            Updating
          </div>
        </Button>
      )}
    </Grid>
  </Grid>
)}
            <Grid
              container
              spacing={2}
              className="profile-form-grid"
            >
              {!readOnly && <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  name="name"
                  readOnly={readOnly}
                  control={control}
                  error={errors}
                  type="text"
                />
              </Grid>}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  name="age"
                  readOnly={readOnly}
                  control={control}
                  error={errors}
                  type="number"
                />
              </Grid>

              {!readOnly &&  <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    name="email"
                    readOnly={readOnly}
                    control={control}
                    error={errors}
                    type="text"
                  />
                </Grid>}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  name="phone"
                  readOnly={readOnly}
                  control={control}
                  error={errors}
                  type="number"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextInput
                  name="address"
                  readOnly={readOnly}
                  control={control}
                  error={errors}
                  type="text"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  name="gender"
                  readOnly={readOnly}
                  control={control}
                  error={errors}
                  type="text"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <AutoComplete
                  name="country"
                  disabled={readOnly}
                  control={control}
                  error={errors}
                  options={country_optins}
                 />
                {/* <TextInput
                  name="country"
                  readOnly={readOnly}
                  control={control}
                  error={errors}
                  type="text"
                /> */}
              </Grid>

            </Grid>
          </AFormProvider>

        </div>
      ) : (
        <div className="profile-loading">
          <CircularProgress />

          <h5>Loading user profile</h5>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
