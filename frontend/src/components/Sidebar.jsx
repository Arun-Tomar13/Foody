import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { USER_ROLES } from "../constant";
import { useEffect } from "react";
import { getAllOrder } from "../store/slices/orderSlice";
import { BadgeIndianRupee, BookCheck, Home, UtensilsCrossed } from "lucide-react";

const Sidebar = () => {

  const dispatch = useDispatch()
  
  const role = useSelector((state)=>state?.users?.user?.role)
  const orders = useSelector((state)=>state?.order?.orderList)
  useEffect(() => {
    if(role==USER_ROLES.customer) dispatch(getAllOrder());
  }, [role]);
  
  return (
        <ul className="d-flex flex-column gap-3 list-group text-black">
              <Link
                className="property-none link-opacity-100 text-decoration-none text-dark"
                to="/"
              >
                <Home/> Home
              </Link>

            {role==USER_ROLES.admin &&  <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-dark"
                to="/restaurant"
              >
                <UtensilsCrossed/> Restaurant
              </Link>
            </li>}
            {( orders.length>0 && role==USER_ROLES.customer) && <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-dark"
                to="/orders"
              >
               <BookCheck/>  orders
              </Link>
            </li>}
           {role==USER_ROLES.customer && <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-dark"
                to="/transactions"
              >
               <BadgeIndianRupee/> transactions
              </Link>
            </li> }
          </ul>
  )
}

export default Sidebar