const tableConstant={
    user:'users',
    role:'roles',
    restaurant:"restaurants",
    menu:"menu",
    category:"category",
    cart:"carts",
    cartItem:"cart_items",
    order:"orders",
    orderItem:"order_items",
    address:"address",
    transaction:'transactions',
    wallet:'user_wallet',
    module:"modules",
    permission:"permissions",
    action:"actions",
    offer:'offers'
}

const responseMessage = {
    restaurantCreated : "restaurant created succesfully",
    restaurantUpdated : "restaurant info updated sucessfuly",
    errorInCreatingRestaurant : "error while creating restaurant",
    errorInCreatingMenu : "error while creating menu",
    errorInUpdatingRestaurant : "error while updating the restaurant info",
    hadRestaurant : "user already has a restaurant",
    removeRestaurant : "restaurant removed",
    hadNotRestaurant : "user does not have restaurant",
    succesInRestaurantInfo : "succesfully fetched restaurant info",
}

function formatSqlTimestamp(sqlTimestamp) {
  const dateObj = new Date(sqlTimestamp);
 
  // Extract date components
  let day = dateObj.getDate();
  let month = dateObj.getMonth() + 1; // Month is 0-indexed (0-11)
  let year = dateObj.getFullYear();
 
  // Pad single-digit day/month with a leading zero
  day = String(day).padStart(2, "0");
  month = String(month).padStart(2, "0");
 
  // Concatenate into "dd-mm-yyyy" format
  return `${year}-${month}-${day}`;
}
const number_Regrex = new RegExp('[0-9]');

const menuBulkCSVFormateHeader = ['price','category','name','description','available','type','restaurant']
const categoryBulkCSVFormateHeader = ['name','description','restaurant']

const rolesConstant={
    admin:1,
    customer:2,
    delivery_partner:3,
    restaurant_owner:4,
}
const moduleConstant={
    user:1,
    restaurant:2,
    category:3,
    menu:4,
    cart:5,
    order:6,
    charts:7,
    transaction:8,
}

const actionConstant={
    create:1,
    read:2,
    update:3,
    delete:4,
    read_all:5,
    admin_only:6,
}

module.exports = {tableConstant,responseMessage,formatSqlTimestamp,number_Regrex,menuBulkCSVFormateHeader,categoryBulkCSVFormateHeader,rolesConstant,moduleConstant,actionConstant}