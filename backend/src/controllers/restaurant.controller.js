const { StatusCodes } = require("http-status-codes");
const restaurantService = require("../services/restaurant.service");
const { responseMessage, formatSqlTimestamp } = require("../utils/constant");
const sendResponse = require("../utils/response");

// Create Restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, address, type, openingTime, closingTime,owner } = req.body;
    const userid = req.user;

    const isUserAlreadyHasRestro =
      await restaurantService.getRestaurantbyOwnerId(res, userid);

    if (isUserAlreadyHasRestro.length > 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadRestaurant,
        success: false,
      });
      
    const restaurant = await restaurantService.createRestaurant(res, {
      name,
      address,
      type,
      openingTime,
      closingTime,
      owner_id: owner ? owner : userid,
    });

    const resData = await restaurantService.getRestaurantId(res, restaurant[0]);

    if (restaurant.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: responseMessage.errorInCreatingRestaurant,
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: responseMessage.restaurantCreated,
      data: resData,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

// Create By anyone
// const createRestaurantByAnyOne = async (req, res) => {
//   try {

//     const { name, address,type, openingTime, closingTime} = req.body;
//     const userid = req.user;

//     const restaurant = await restaurantService.createRestaurant(res,{
//       name,
//       address,
//       type,
//       openingTime,
//       closingTime,
//       owner_id: userid,
//     });

//     const resData = await restaurantService.getRestaurantId(res,restaurant[0])

//     if (restaurant.length == 0)
//       return sendResponse({
//         res,
//         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         message: responseMessage.errorInCreatingRestaurant,
//         success: false,
//       });

//     return sendResponse({
//       res,
//       statusCode: StatusCodes.CREATED,
//       message: responseMessage.restaurantCreated,
//       data : resData[0],
//     });
//   } catch (error) {
//     return sendResponse({
//       res,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: error.message,
//       success: false,
//     });
//   }
// };

// Update Restaurant
const updateRestaurant = async (req, res) => {
  try {
    const { name, address, type, openingTime, closingTime } = req.body;
    const { id } = req.params;

    const userHasRestro = await restaurantService.getRestaurantId(res, id);

    if (userHasRestro.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    const updatedRestaurantData = await restaurantService.updateRestaurantById(
      res,
      {
        id,
        name,
        openingTime,
        closingTime,
        address,
        type,
      },
    );

    // console.log(updatedRestaurantData);

    if (!updatedRestaurantData)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: responseMessage.errorInUpdatingRestaurant,
        success: false,
      });

    const updatedUser = await restaurantService.getRestaurantId(res, id);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: responseMessage.restaurantUpdated,
      data: updatedUser[0],
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

// remove by userid
const removeRestaurant = async (req, res) => {
  try {
    const userid = req.user;

    const userHasRestro = await restaurantService.getRestaurantbyOwnerId(
      res,
      userid,
    );

    if (userHasRestro.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    const result = await restaurantService.removeRestaurantByOwnerId(
      res,
      userid,
    );

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: responseMessage.removeRestaurant,
      data: result,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

// remove by id
const removeRestaurantById = async (req, res) => {
  try {
    // console.log(req.body);

    const { id } = req.params;

    const userHasRestro = await restaurantService.getRestaurantId(res, id);
    
    if (userHasRestro.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    const result = await restaurantService.removeRestaurantById(res, id);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: responseMessage.removeRestaurant,
      data: id,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

// get by userid
const changeAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    let restaurantInfo;

    if (id) restaurantInfo = await restaurantService.getRestaurantId(res, id);
    else {
      const userid = req.user;

      restaurantInfo = await restaurantService.getRestaurantbyOwnerId(
        res,
        userid,
      );
    }

    if (restaurantInfo.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    const isToggled = await restaurantService.toggleAvailabity(res, id);

    if (!isToggled)
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'error while toggling restro',
        success:false
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: 'restaurant availabity toggled',
      data: id,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

// get Restaurant Info by Id
const getRestaurantInfoById = async (req, res) => {
  try {
    const { id } = req.query;

    let restaurantInfo;

    if (id) restaurantInfo = await restaurantService.getRestaurantId(res, id);
    else {
      const userid = req.user;

      restaurantInfo = await restaurantService.getRestaurantbyOwnerId(
        res,
        userid,
      );
    }

    if (restaurantInfo.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: responseMessage.succesInRestaurantInfo,
      data: restaurantInfo[0],
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getAllRestaurant = async (req, res) => {
  try {
    const Allrestaurant = await restaurantService.getAllRestaurant(res);

    if (Allrestaurant.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: responseMessage.succesInRestaurantInfo,
      data: Allrestaurant,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getMenuCountPerRestaurant = async (req, res) => {
  try {
    const Data = await restaurantService.MenuPerRestaurant();
    console.log(Data);
    

    if (Data.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "no menu exists",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "menu count fetched successfully",
      data: Data,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const OrderCountPerRestaurant = async (req, res) => {
  try {
    const data = await restaurantService.OrdersPerRestaurant();

    if (data.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "no menu exists",
        success: false,
      });

    const formatedData = {};

    data.forEach((item) => {
      if (!formatedData[item.name]) formatedData[item.name] = {};
      if (!formatedData[item.name]) formatedData[item.name] = {};
      formatedData[item.name].order = (formatedData[item.name].order || 0) + 1;
      formatedData[item.name].revenue =
        (formatedData[item.name].revenue || 0) + Number(item.total);
    });

    let orderArray = [];
    let revenueArray = [];
    let restaurantArray = [];

    for (let restaurant in formatedData) {
      restaurantArray.push(restaurant);
      orderArray.push({ name: restaurant, y: formatedData[restaurant].order });
      revenueArray.push({
        name: restaurant,
        y: formatedData[restaurant].revenue,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "order and revenue fetched successfully",
      data: { restaurantArray, orderArray, revenueArray },
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const revenuePerRestaurantByDates = async (req, res) => {
  try {
    const data = await restaurantService.revenueByDatesOfRestaurant(res);

    if (data.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "no revenue",
        success: false,
      });

    let dateArr = [];
    const dataArr = [];
    const newData = [];

    for (let key in data) {
      data[key].date = formatSqlTimestamp(data[key].date);
      if (!dateArr.includes(data[key].date)) dateArr.push(data[key].date);
    }

    dateArr.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);

      return dateA - dateB;
    });

    data.forEach((item) => {
      let index = dataArr.findIndex((obj) => obj.name == item.name);

      if (index == -1) {
        dataArr.push({
          name: item.name,
          date: [item.date],
          revenue: [item.total],
        });
        newData.push({ name: item.name, data: [] });
      } else {
        dataArr[index].date.push(item.date);
        dataArr[index].revenue.push(item.total);
      }
    });

    let i = 0;
    dataArr.forEach((item) => {
      for (let date of dateArr) {
        if (item.date.includes(date)) {
          let amount = 0;
          for (let i in item.date) {
            if (item.date[i] == date) amount += item.revenue[i];
          }
          newData[i].data.push(amount);
        } else newData[i].data.push(0);
      }
      i++;
    });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "order and revenue fetched successfully",
      data: { revenueArray: newData, dates: dateArr },
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  createRestaurant,
  updateRestaurant,
  removeRestaurant,
  getAllRestaurant,
  removeRestaurantById,
  getRestaurantInfoById,
  getMenuCountPerRestaurant,
  OrderCountPerRestaurant,
  revenuePerRestaurantByDates,
  changeAvailability,
  // getRestaurantInfo,
  // createRestaurantByAnyOne,
};
