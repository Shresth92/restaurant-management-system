const Joi = require("joi");

exports.authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
});

exports.registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
});

exports.paginationSchema = Joi.object({
  limit: Joi.number().required(),
  page: Joi.number().required(),
});

exports.filterSchema = Joi.object({
  limit: Joi.number().required(),
  page: Joi.number().required(),
  role: Joi.string(),
});

exports.addressSchema = Joi.object({
  address: Joi.string().required(),
  lat: Joi.number().required().min(-90).max(90),
  long: Joi.number().required().min(-180).max(180),
});

exports.dishSchema = Joi.object({
  name: Joi.string().required(),
});

exports.restaurantSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required().max(50),
  lat: Joi.number().required().min(-90).max(90),
  long: Joi.number().required().min(-180).max(180),
});
