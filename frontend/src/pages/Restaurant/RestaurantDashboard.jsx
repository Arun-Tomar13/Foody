import { Grid } from '@mui/material'
import AllRestaurantList from '../../components/AllRestaurantList'
import RestroOwner from './Restaurant'
import { useSelector } from 'react-redux'

const RestaurantDashboard = () => {
    const role = useSelector(state=>state?.users?.user?.role)
  return (
    <div>
        <Grid container spacing={2} className='d-flex flex-column' >

            <h1>Restaurant DashBoard</h1>

             <Grid >
             {role=='admin' && <AllRestaurantList/>}
             {role=='restaurant_owner' && <RestroOwner/>}
              </Grid>
        </Grid>
    </div>
  )
}

export default RestaurantDashboard