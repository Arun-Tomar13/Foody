require("dotenv").config();
const createTable = require("./models/user.model");
const createPermissionTable = require('./models/permission.model.js')
const express = require("express");
const app = express();
const knex = require("./config/db.config");
const roleTable = require("./models/role.model");
const cookieParser = require("cookie-parser");
const indexRoutes = require('./routes/index.js')

// Cors
const cors = require('cors');
const createRestaurantTable = require("./models/restaurant.model.js");
const createMenuTable = require("./models/menu.model.js");
const createCategoryTable = require("./models/category.model.js");
const createCartTable = require("./models/cart.model.js");
const createCartItemsTable = require("./models/cartItems.model.js");
const createOrderTable = require("./models/order.model.js");
const createOrderItemsTable = require("./models/orderItems.model.js");
const createAddressTable = require("./models/address.model.js");
const {fileCleanup} = require("./utils/fileCleanup.js");
const transactionTable = require("./models/transaction.model.js");
const moduleTable = require("./models/module.model.js");
const actionTable = require("./models/action.model.js");
const offerTable = require("./models/offer.model.js");
app.use(cors({
  origin:'*',
  withCredentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/api',indexRoutes)

// Routes
app.use("/public",express.static('public'));

const port = process.env.PORT;

// Cron file cleanup
fileCleanup()

app.listen(port, () => {
  console.log(`Server running at port : ${port}`);
  
  // knex
  //   .raw("SELECT 1")
  //   .then((data) => console.log("server is running : ", data))
  //   .catch((e) => console.log("error occur while connecting db : ", e));
  roleTable();
  createTable();
  createPermissionTable();
  createRestaurantTable()
  createCategoryTable()
  createMenuTable()
  createCartTable()
  createCartItemsTable()
  createOrderTable()
  createOrderItemsTable()
  createAddressTable()
  transactionTable()
  moduleTable()
  actionTable()
  offerTable()

});
 