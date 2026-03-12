const { StatusCodes } = require("http-status-codes");
const restaurantService = require("../services/restaurant.service");
const menuService = require("../services/menu.service");
const {
  responseMessage,
  tableConstant,
  menuBulkCSVFormName,
  menuBulkCSVFormateHeader,
  number_Regrex,
} = require("../utils/constant");
const sendResponse = require("../utils/response");
const db = require("../config/db.config");
const dbConfig = require("../config/db.config");
const fs = require("fs");
const csv = require("csv-parser");
const { type } = require("os");

// Add category
const addItemToMenu = async (req, res) => {
  try {
    const { name, description, type, price, category_id } = req.body;
    const { restaurant_id } = req.params;

    const hasRestraurant = await restaurantService.getRestaurantId(
      res,
      restaurant_id,
    );

    if (hasRestraurant.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    const result = await menuService.addMenuItem(res, {
      name,
      description,
      type,
      price,
      restaurant_id,
      category_id,
      image: req.file.path,
    });

    if (result.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: responseMessage.errorInCreatingMenu,
        success: false,
      });

    const user = await menuService.getMenuItemById(res, result[0]);

    if (user.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: responseMessage.errorInCreatingMenu,
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "menu added successfully",
      data: user[0],
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

// Add category
const bulkUploadItemToMenu = async (req, res) => {
  try {
    const file = req.file;
    const restaurant_id = req.query?.restaurant_id || null;

    if (restaurant_id) {
      const hasRestraurant = await restaurantService.getRestaurantId(
        res,
        restaurant_id,
      );

      if (hasRestraurant.length == 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: responseMessage.hadNotRestaurant,
          success: false,
        });
    }

    const parser = fs
      .createReadStream(`../backend/${file.path}`)
      .pipe(csv({ delimiter: ",", from_line: 2 }));

    if (parser.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "empty file",
        success: false,
      });

    let errors = [];
    let restaurantCache = {};
    let categoryCache = {};
    let menuFromCSV = [];
    const inputData = [];
    let isError = false;

    let count = 2;
    for await (const row of parser) {
      let error = "";

      let price = row[Object.keys(row)[0]]?.toLowerCase().trim();
      let category = row[Object.keys(row)[1]]?.toLowerCase().trim();
      let name = row[Object.keys(row)[2]]?.toLowerCase().trim();
      let description = row[Object.keys(row)[3]]?.toLowerCase().trim();
      let available = row[Object.keys(row)[4]]?.toLowerCase().trim();
      let type = row[Object.keys(row)[5]]?.toLowerCase().trim();
      
      let restaurant;
      if (!restaurant_id)
        restaurant = row[Object.keys(row)[6]]?.toLowerCase().trim();

      if (count == 2) {
        for (let i in menuBulkCSVFormateHeader) {
          if (restaurant_id && i == 6) break;
          if (
            menuBulkCSVFormateHeader[i] == undefined ||
            menuBulkCSVFormateHeader[i] != Object.keys(row)[i].trim()
          ) {
            errors.push(
              `header ${Number(i) + 1} '${Object.keys(row)[i]}' cannot match format. it must be ${menuBulkCSVFormateHeader[i]}, `,
            );
            isError = true;
          }
        }
      }
      if (
        !price ||
        !category ||
        !description ||
        !name ||
        !type ||
        !available ||
        (!restaurant_id && !restaurant)
      ) {
        error += `empty fields in row ${count}, `;
        isError = true;
      }
      if (Object.keys(row).length > (restaurant_id ? 6 : 7)) {
        error += `extra fields in row ${count}, `;
        isError = true;
      }
      if (
        menuFromCSV.includes(name + category + restaurant_id ? "" : restaurant)
      ) {
        error += `duplicate entry in row ${count}, `;
        isError = true;
      }
      if (
        number_Regrex.test(name) ||
        number_Regrex.test(description) ||
        number_Regrex.test(available) ||
        number_Regrex.test(category) ||
        (restaurant_id && number_Regrex.test(restaurant))
      ) {
        error += `numerical value at row ${count}, `;
        isError = true;
      }
      if (!number_Regrex.test(price)) {
        error += `price must be number at row ${count}, `;
        isError = true;
      }
      if (type != "veg" && type != "non-veg") {
        error += `type must be 'veg or non-veg' at row ${count}, `;
        isError = true;
      }
      if (error) errors.push(error);
      menuFromCSV.push(name + category + (restaurant_id ? "" : restaurant));
      count++;

      if (!isError)
        inputData.push({
          price,
          category,
          name,
          description,
          available,
          type,
          restaurant: restaurant_id ? restaurant_id : restaurant,
        });
    }

    if (errors.length) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: errors,
        success: false,
      });
    }

    errors = [];
    count = 2;

    for (let i in inputData) {
      //getting restaurant
      let error = "",
        restaurantName = inputData[i].restaurant || null,
        categoryName = inputData[i].category || null;

      if (!restaurant_id) {
        if (!restaurantCache[inputData[i].restaurant]) {
          const restaurantResult = await restaurantService.getRestaurantByName(
            res,
            inputData[i].restaurant,
          );

          if (restaurantResult.length == 0)
            error += `restaurant ${inputData[i].restaurant} does not exists at row ${count}, `;
          else {
            restaurantCache[inputData[i].restaurant] = restaurantResult[0].id;
            inputData[i] = {
              ...inputData[i],
              restaurant: restaurantResult[0].id,
            };
          }
        } else {
          inputData[i] = {
            ...inputData[i],
            restaurant: restaurantCache[inputData[i].restaurant],
          };
        }
      }

      //getting category
      if (!error) {
        if (!categoryCache[inputData[i].category + inputData[i].restaurant]) {
          const categoryResult = await db(tableConstant.category).where({
            name: inputData[i].category,
            restaurant_id: inputData[i].restaurant,
          });

          if (categoryResult.length == 0)
            error += `category ${inputData[i].category} does not exists${restaurant_id ? "" : ` in ${restaurantName}`} at row ${count}, `;
          else {
            categoryCache[inputData[i].category + inputData[i].restaurant] =
              categoryResult[0].id;
            inputData[i] = { ...inputData[i], category: categoryResult[0].id };
          }
        } else {
          inputData[i] = {
            ...inputData[i],
            category:
              categoryCache[inputData[i].category + inputData[i].restaurant],
          };
        }
      }

      //checking menu
      if (!error) {
        const menuResult = await menuService.getMenuByName(
          res,
          inputData[i].name,
          inputData[i].restaurant,
          inputData[i].category,
        );

        if (menuResult.length)
          error += `menu item ${inputData[i].name} already exists in ${categoryName}, at row ${count}, `;
      }

      if (error) errors.push(error);

      i++;
      count++;
    }

    if (errors.length) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: errors,
        success: false,
      });
    }

    let ids=[],results=[];

    for (let data of inputData) {
      try {
        const result = await menuService.addMenuItem(res, {
          name: data.name,
          description: data.description,
          price: data.price,
          category_id: data.category,
          restaurant_id: data.restaurant,
          isAvailable: data.available == "yes" ? true : false,
          type: data.type,
        });

        if (result.length == 0)
          return sendResponse({
            res,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: responseMessage.errorInCreatingMenu,
            success: false,
          });
          else{
            ids.push(result[0])
          }
      } catch (error) {
        return sendResponse({
          res,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
          success: false,
        });
      }
    }

    if(restaurant_id) {
      for(let id of ids){
      let data = await menuService.getMenuItemById(res,id)
      results.push(data[0])
    }
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "menu added successfully",
      data: restaurant_id ? results : []
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


// Update Menu
const updateMenuItem = async (req, res) => {
  try {
    // const userid = req.user;
    let { id, name, description, type, price, image } = req.body;
    console.log(req.body);
    

    // const hasRestraurant =
    //   await restaurantService.getRestaurantbyOwnerId(userid);
    // // console.log(hasRestraurant);

    // if (hasRestraurant.length == 0)
    //   return sendResponse({
    //     res,
    //     statusCode: StatusCodes.BAD_REQUEST,
    //     message: responseMessage.hadNotRestaurant,
    //     success: false,
    //   });

    if (!req.file) {
      const item = await menuService.getMenuItemById(res, id);
      image = item[0].image;
      console.log("menu", item[0]);
    } else {
      console.log("image before", image);
      image = req.file.path;
    }
    console.log("image after", image);

    const isitemUpdat = await menuService.updateMenuItem(res, {
      id,
      name,
      price,
      description,
      type,
      image,
    });

    if (!isitemUpdat)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while updating menu item",
        success: false,
      });

    const updatedItem = await menuService.getMenuItemById(res, id);

    if (updatedItem.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while updating menu item",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "menu updated successfully",
      data: updatedItem,
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

// Remove menu item
const removeMenuItem = async (req, res) => {
  try {
    // const userid = req.user;
    const { id } = req.params;

    // console.log(id);

    // const hasRestraurant =
    //   await restaurantService.getRestaurantbyOwnerId(userid);
    // // console.log(hasRestraurant);

    // if (hasRestraurant.length == 0)
    //   return sendResponse({
    //     res,
    //     statusCode: StatusCodes.BAD_REQUEST,
    //     message: responseMessage.hadNotRestaurant,
    //     success: false,
    //   });

    const removeitem = await menuService.removeMenuItem(res, id);
    // console.log("remove", removeitem);

    if (!removeitem)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while removing menu item",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "item removed successfully",
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

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const hasMenu = await menuService.getMenuItemById(res, id);

    if (hasMenu.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: responseMessage.hadNotRestaurant,
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "menu fetched successfully",
      data: hasMenu[0],
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

// get All menu for restaurant
const getMenuItem = async (req, res) => {
  try {
    const data = req.query;

    if (data.category_id) {
      const hasCategory = await db(tableConstant.category).where({
        id: data.category_id,
      });

      if (hasCategory.length == 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "category does not exists",
          success: false,
        });
    }

    if (data.restaurant_id) {
      const hasRestraurant = await restaurantService.getRestaurantId(
        res,
        data.restaurant_id,
      );
      // console.log("has restro", hasRestraurant);

      if (hasRestraurant.length == 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: responseMessage.hadNotRestaurant,
          success: false,
        });
    }

    const totalPages = await await db(tableConstant.menu).where(function () {
      if (data.category_id) {
        this.where("category_id", data.category_id);
      }
      if (data.restaurant_id) {
        this.where("restaurant_id", data.restaurant_id);
      }
      if (data.query) {
        this.where("name", "like", `%${data.query}%`);
      }
    });

    const totalMenu = totalPages.length;

    menu = await menuService.getAllMenuItem(res, data);

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "menu fetched successfully",
      data: { menu, totalMenu },
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
  addItemToMenu,
  getMenuItem,
  removeMenuItem,
  updateMenuItem,
  getMenuItemById,
  bulkUploadItemToMenu,
};
