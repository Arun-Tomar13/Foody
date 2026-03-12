const { StatusCodes } = require("http-status-codes");
const restaurantService = require("../services/restaurant.service");
const categoryService = require("../services/category.service");
const {
  responseMessage,
  tableConstant,
  string_Regrex,
  number_Regrex,
  categoryBulkCSVFormateHeader,
} = require("../utils/constant");
const sendResponse = require("../utils/response");
const db = require("../config/db.config");
const fs = require("fs");
const csv = require("csv-parser");

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, description, restaurant_id } = req.body;

    const isRestaurant = await restaurantService.getRestaurantId(
      res,
      restaurant_id,
    );

    if (isRestaurant.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "restaurant does not exists",
        success: false,
      });
      
      const hasCategoryategory = await categoryService.getCategory(res,{name,restaurant_id})

      if (hasCategoryategory.length > 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "category already exists",
          success: false,
        });

    const add = await categoryService.createCategory(res,{name,description,restaurant_id})

    if (add.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while adding category",
        success: false,
      });

    const category = await categoryService.getCategory(res,{id:add[0]})

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "category added successfully",
      data: category,
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

// Add Category in bulk
const addCategoryInBulk = async (req, res) => {
  try {
    const file = req.file;
    const restaurant_id = req.query?.restaurant_id || null;

    if (!file)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "file does not exists",
        success: false,
      });

    if (restaurant_id) {
      const isRestaurant = await restaurantService.getRestaurantId(
        res,
        restaurant_id,
      );

      if (isRestaurant.length == 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "restaurant does not exists",
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
    let results = [];
    let categoriesFromCSV = [];
    let categoryCache = {};
    let categoriesFromDB = [];
    let restaurantCache = [];
    const inputData = [];
    let isError = false;

    let count = 2;
    for await (const row of parser) {
      let error = "";

      let name = row[Object.keys(row)[0]]?.toLowerCase().trim();
      let description = row[Object.keys(row)[1]].toLowerCase().trim();
      let restaurant;
      if (!restaurant_id)
        restaurant = row[Object.keys(row)[2]]?.toLowerCase().trim();

      if (count == 2) {
        for (let i in categoryBulkCSVFormateHeader) {
          
          if (!restaurant_id && i == 1) break;
          if (
            categoryBulkCSVFormateHeader[i] == undefined ||
            categoryBulkCSVFormateHeader[i] != Object.keys(row)[i].trim()
          ) {
            errors.push(
              `header ${Number(i) + 1} '${Object.keys(row)[i]}' cannot match format. it must be ${categoryBulkCSVFormateHeader[i]}, `,
            );
            isError = true;
          }
        }
      }
      if (!name || !description || (!restaurant_id && !restaurant)) {
        error += `empty fields in row ${count}, `;
        isError = true;
      }
      if (Object.keys(row).length > (restaurant_id ? 2 : 3)) {
        error += `extra fields in row ${count}, `;
        isError = true;
      }
      if (categoriesFromCSV.includes(name + restaurant_id ? "" : restaurant)) {
        error += `duplicate entry in row ${count}, `;
        isError = true;
      }
      if (
        number_Regrex.test(name) ||
        number_Regrex.test(description) ||
        (restaurant_id && number_Regrex.test(restaurant))
      ) {
        error += `data cannot be number,in row ${count}, `;
        isError = true;
      }
      if (error) errors.push(error);
      categoriesFromCSV.push(name + (restaurant_id ? "" : restaurant));
      count++;

      if (!isError)
        inputData.push({
          name,
          description,
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

    for (let i in inputData) {
      //getting restaurant
      let error = "",
        restaurantName = inputData[i].restaurant || null;

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
        if (!categoryCache[inputData[i].restaurant]) {
          let categoryData = await db(tableConstant.category)
            .where({ restaurant_id: inputData[i].restaurant })
            .select("name");

          for (let data of categoryData) {
            categoriesFromDB.push(data.name.toLowerCase());
          }

          if (categoriesFromDB.includes(inputData[i].name)) {
            error += `category ${inputData[i].name} already exists${restaurant_id ? "" : ` in ${restaurantName}`} at row ${count}, `;
          }
          categoryCache[inputData[i].restaurant] = categoriesFromDB;
          categoriesFromDB = [];
        }
      } else {
        if (
          categoryCache[inputData[i].restaurant].includes(inputData[i].name)
        ) {
          error += `category ${inputData[i].name} already exists${restaurant_id ? "" : ` in ${restaurantName}`} at row ${count}, `;
        }
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

    const ids = [];

    for (let row of inputData) {
      try {
        const id = await categoryService.createCategory(res,{
          name: row.name,
          description: row.description,
          restaurant_id: row.restaurant,
        });

        ids.push(id[0]);
      } catch (error) {
        console.log(error);
      }
    }

    if (ids.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while adding category",
        success: false,
      });

    if (restaurant_id) {
      for (let id of ids) {
        const data = await categoryService.getCategory(res,{id})
        results.push(data[0]);
      }
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "categories added successfully",
      data: restaurant_id ? "results" : [],
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

// Update
const updateCategory = async (req, res) => {
  try {
    const { id, name, description, isAvailable } = req.body;

    const isRestaurant = await categoryService.getCategory(res,{ id });

    if (isRestaurant.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "category does not exists",
        success: false,
      });

    const add = await categoryService.updateCategory(res,{id,name,description,isAvailable})
    if (add.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while updating category",
        success: false,
      });

    const category = await categoryService.getCategory(res,{id})

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "category updated successfully",
      data: category,
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

// Remove
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const isCategory = await categoryService.getCategory(res,{id});

    if (isCategory.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "category does not exists",
        success: false,
      });

    const add = await categoryService.removeCategoryById(res,{id})

    if (!add)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while deleting category",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "category removed successfully",
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

// get Category
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryService.getCategory(res,{id})

    if (category.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "category does not exists",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "category removed successfully",
      data: category[0],
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

const getAllCategorybyRestaurantId = async (req, res) => {
  try {
    const { id } = req.params;

    const isRestaurant = await restaurantService.getRestaurantId(res, id);

    if (isRestaurant.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "category does not exists",
        success: false,
      });

    const category = await categoryService.getCategory(res,{restaurant_id: id });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "category fetched successfully",
      data: category,
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
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategorybyRestaurantId,
  addCategoryInBulk,
};
