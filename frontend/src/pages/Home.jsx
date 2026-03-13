import { useSelector } from 'react-redux'
import CustomerPage from './customer/CustomerPage'
import Dashboard from '../components/charts/Dashboard'
import RestroOwner from './Restaurant/Restaurant'
import { USER_ROLES } from '../constant'
const Home = () => {
  const role = useSelector(state=>state?.users?.user?.role)
  return (
    <div>

   { role==USER_ROLES.customer && <CustomerPage/>}
   { role==USER_ROLES.restaurent_owner && <RestroOwner/>}
   { role==USER_ROLES.admin && <Dashboard/>}

    </div>
  )
}

export default Home