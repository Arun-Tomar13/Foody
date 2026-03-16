import { Grid } from '@mui/material'
import AllRestaurantList from '../../components/AllRestaurantList'
import RestroOwner from './Restaurant'
import { useSelector } from 'react-redux'
import { USER_ROLES } from '../../constant'

const RestaurantDashboard = () => {
    const role = useSelector(state=>state?.users?.user?.role)
  return (
    <div>
        <Grid container spacing={2} className='d-flex flex-column' >

            <h1>Restaurant DashBoard</h1>

             <Grid >
             {role==USER_ROLES.admin && <AllRestaurantList/>}
             {role==USER_ROLES.restaurent_owner && <RestroOwner/>}
              </Grid>
        </Grid>
    </div>
  )
}

export default RestaurantDashboard