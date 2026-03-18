import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { colors, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { USER_ROLES } from "../constant";
const Layout = ({showNavbar=true,showSidebar=true}) => {
  const user = useSelector((state) => state?.users?.user);
  
  if (!user?.error)
    return (
      <Grid container bgcolor={colors.orange[50]} direction='column'>
        {showNavbar && <Grid bgcolor={colors.orange[400]} className="vw-100 position-fixed" zIndex={120}>
          <Navbar />
        </Grid>}

        <Grid container size={{ md: 12 }} marginTop={7} >
          {showSidebar && user?.role != USER_ROLES.restaurent_owner && (
             <Grid
              size={{ md: 1.5 }}
              paddingX={1}
              paddingY={4}
              position='fixed'
              boxShadow={15}
              className="vh-100"
              bgcolor={colors.orange[50]}
            >
              <Sidebar />
            </Grid>
          )}

          <Grid
            size={{ md: 10.5 }}
            height='100%'
            marginLeft={
              user?.role != USER_ROLES.restaurent_owner ? "15%" : "5%"
            }
            padding={3}
          >
            <Outlet/>
          </Grid>
        </Grid>
      </Grid>
    );

   return <Navigate to="/login" />
};

export default Layout;
