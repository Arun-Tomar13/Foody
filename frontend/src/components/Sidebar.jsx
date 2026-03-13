import { useSelector } from "react-redux";
import { Link } from "react-router";
import { USER_ROLES } from "../constant";

const Sidebar = () => {
  const role = useSelector((state)=>state?.users?.user?.role)
  return (
        <ul className="d-flex flex-column gap-3 list-group text-black">
            <li>
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/"
              >
                Home
              </Link>
            </li>

            {role==USER_ROLES.admin &&  <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/restaurant"
              >
                Restaurant
              </Link>
            </li>}
            {role==USER_ROLES.customer && <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/orders"
              >
                orders
              </Link>
            </li>}
           {role==USER_ROLES.customer && <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/transactions"
              >
                transactions
              </Link>
            </li> }
          </ul>
  )
}

export default Sidebar