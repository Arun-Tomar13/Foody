const tableConstant={
    user:'users',
    role:'roles',
    Permission:'permissions',
    restaurant:"restaurants",
    menu:"menu",
    category:"category",
    cart:"carts",
    cartItem:"cart_items",
    order:"orders",
    orderItem:"order_items",
    address:"address",
    transaction:'transactions',
    wallet:'user_wallet'
}

// const responseMessage = {
//     restaurantCreated : "restaurant created succesfully",
//     restaurantUpdated : "restaurant info updated sucessfuly",
//     errorInCreatingRestaurant : "error while creating restaurant",
//     errorInCreatingMenu : "error while creating menu",
//     errorInUpdatingRestaurant : "error while updating the restaurant info",
//     hadRestaurant : "user already has a restaurant",
//     removeRestaurant : "restaurant removed",
//     hadNotRestaurant : "user does not have restaurant",
//     succesInRestaurantInfo : "user does not have restaurant",
// }

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
 

module.exports = {tableConstant,responseMessage,formatSqlTimestamp,number_Regrex,menuBulkCSVFormateHeader,categoryBulkCSVFormateHeader}