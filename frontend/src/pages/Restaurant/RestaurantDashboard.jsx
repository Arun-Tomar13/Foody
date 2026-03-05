import { Grid } from '@mui/material'
import AllRestaurantList from '../../components/AllRestaurantList'

const RestaurantDashboard = () => {
  // const {isLoading, error , list} = useSelector((state)=>state.common)
  // useEffect(()=>{console.log(isLoading)
  // },[])
  return (
    <div>
        <Grid container spacing={2} className='d-flex flex-column' >

            <h1>Restaurant DashBoard</h1>

             <Grid ><AllRestaurantList/></Grid>
        </Grid>
    </div>
  )
}

export default RestaurantDashboard