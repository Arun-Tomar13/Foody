import { Link } from "react-router";

const Sidebar = () => {
  return (
        <ul className="d-flex flex-column gap-3 list-group text-black">
            <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/"
              >
                Home
              </Link>
            </li>

            <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/restaurant"
              >
                Restaurant
              </Link>
            </li>
            <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/orders"
              >
                orders
              </Link>
            </li>
            <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/transactions"
              >
                transactions
              </Link>
            </li>
            <li >
              <Link
                className="property-none link-opacity-100 text-decoration-none text-white"
                to="/charts"
              >
                charts
              </Link>
            </li>
          </ul>
  )
}

export default Sidebar