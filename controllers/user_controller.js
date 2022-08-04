const express = require("express");
const app = express();
const Joi = require("../helpers/validate");
const query = require("../helpers/db_query");
const ApiError = require("../error/errorClass");

app.use(express.json());

exports.Address = async (req, res, next) => {
  try {
    const result = await Joi.addressSchema.validateAsync(req.body);
    const { address, lat, long } = result;
    const user_id = req.id;
    if (query.checkAddress(user_id, lat, long)) {
      await query.addAddress(user_id, address, lat, long);
      return res.status(201).send("Address added succesfully");
    } else {
      const err = new Error("Address details already exists in table.");
      return next(ApiError.error(409, "Address already exists.", err.message));
    }
  } catch (error) {
    if (error.isJoi == true)
      return next(ApiError.error(422, error.message, error));
    return next(error);
  }
};
