const express = require("express");
const app = express();
const Joi = require("../helpers/validate");
const query = require("../helpers/db_query");
const ApiError = require("../error/errorClass");

app.use(express.json());

exports.all = async (req, res, next) => {
  try {
    const result = await Joi.filterSchema.validateAsync(req.query);
    const { limit, page, role } = result;
    console.log(req.role == "sub admin");
    if (req.role == "sub admin") {
      const role = "user";
    }
    const users = await query.all(limit, page, role);
    formatted_users = {
      totalRows: users[0].count,
      rows: users,
    };
    return res.status(200).send(formatted_users);
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const result = await Joi.restaurantSchema.validateAsync(req.body);
    const { name, address, lat, long } = result;
    const checkRestaurant = await query.checkRestaurant(name, address);
    if (checkRestaurant.length == 0) {
      await query.createRestaurant(req.id, name, address, lat, long);
      return res.status(201).send("Restaurant has been added");
    } else {
      const err = new Error("Restaurant details already exists in table.");
      return next(
        ApiError.error(409, "Restaurant already exists.", err.message)
      );
    }
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};

exports.createDishes = async (req, res, next) => {
  try {
    const result = await Joi.dishSchema.validateAsync(req.body);
    const { name } = result;
    const { res_id } = req.params;
    const dish = await query.checkDish(name, res_id);
    console.log("gg");
    if (dish.length == 0) {
      await query.createDish(res_id, name);
      return res.status(201).send("Dish has been added");
    } else {
      const err = new Error("Dish details already exists in table.");
      return next(ApiError.error(409, "Dish already exists.", err.message));
    }
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};

exports.Restaurants = async (req, res, next) => {
  try {
    const result = await Joi.paginationSchema.validateAsync(req.query);
    const { limit, page } = result;
    let id = null;
    if (req.role == "admin" || req.role == "sub admin") {
      id = req.id;
    }
    const search = await query.allRestaurants(limit, page, id);
    if (search.length == 0) {
      return res.send("No result");
    }
    const rest = {
      totalRows: search[0].count,
      rows: search,
    };
    return res.status(200).send(rest);
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};

exports.Dishes = async (req, res, next) => {
  try {
    const result = await Joi.paginationSchema.validateAsync(req.query);
    const { limit, page } = result;
    const { res_id } = req.params;
    const id = null;
    if (req.role == "admin" || req.role == "sub admin") {
      id = req.id;
    }
    const search = await query.allDishes(limit, page, res_id, id);
    if (search.length == 0) {
      return res.send("No result");
    }
    const dish = {
      totalRows: search[0].count,
      rows: search,
    };
    return res.status(200).send(dish);
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};

exports.allAddress = async (req, res, next) => {
  try {
    const result = await Joi.paginationSchema.validateAsync(req.query);
    const { limit, page } = result;
    const id = req.id;
    if ((req.role == "admin", req.role == "sub admin")) {
      id = null;
    }
    const search = await query.allAddress(id, limit, page);
    const addr = {
      totalRows: search[0].count,
      rows: search,
    };
    return res.status(200).send(addr);
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};
