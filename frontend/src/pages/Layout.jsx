import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
const Layout = () => {

  return (
    <Grid className="d-flex flex-column">
      <Grid className='vw-100 position-fixed' zIndex={120} >
      <Navbar/>
      </Grid>

      <Grid container size={{ md: 12 }} marginTop={8} >
        <Grid size={{ md: 1.5 }} padding={1} className="bg-secondary vh-100 position-fixed">
          <Sidebar/>
        </Grid>
        
        <Grid
          size={{ md: 10.5 }}
          marginLeft='15%'
          className="bg-warning bg-opacity-10"
          padding={3}
        >
          {<Outlet />}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Layout;
