require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("../helpers/validate");
const query = require("../helpers/db_query");
const ApiError = require("../error/errorClass");

app.use(express.json());

exports.Register = async (req, res, next) => {
  try {
    const result = await Joi.registerSchema.validateAsync(req.body);
    const { name, email, password } = result;
    const users = await query.users(email);
    hashpass = await bcrypt.hash(password, 10);
    if (users.length == 0) {
      await query.registerUser(
        name,
        email,
        hashpass,
        req.setrole,
        req.created_by
      );
      return res.status(201).send("You have registered succesfully.");
    }
    let user_id = users[0].id;
    const roles = await query.checkRole(user_id, req.setrole);
    if (roles.length == 0) {
      await query.createRole(user_id, req.setrole, req.created_by);
      return res.status(201).send("You have registered succesfully.");
    } else {
      const err = new Error("User details already exists in table.");
      return next(ApiError.error(409, "Email already exists.", err.message));
    }
  } catch (error) {
    if (error.isJoi) {
      return next(ApiError.error(422, error.message, error));
    }
    return next(error);
  }
};

exports.Login = async (req, res, next) => {
  try {
    const result = await Joi.authSchema.validateAsync(req.body);
    const { email, password } = result;
    const users = await query.users(email);
    const user_id = users[0].id;
    const checkRole = await query.checkRole(user_id, req.setrole);
    if (users.length == 0 || checkRole.length == 0) {
      const err = new Error("User details already exists in table.");
      return next(ApiError.error(401, "Please register first.", err.message));
    } else {
      if (await bcrypt.compare(password, users[0].password)) {
        let session_id = await query.createSession(user_id);
        const accessToken = jwt.sign(
          {
            email: email,
            id: user_id,
            session_id: session_id,
            role: checkRole[0].role_name,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken: accessToken });
      } else {
        const err = new Error("Password user have entered did not match.");
        return next(ApiError.error(422, "Enter right password.", err.message));
      }
    }
  } catch (error) {
    if (error.isJoi == true) {
      return next(ApiError.error(422, error.message, error));
    }
    return next(error);
  }
};

exports.Logout = async (req, res, next) => {
  try {
    const session_id = req.session_id;
    await query.setSessionEnd(session_id);
    res.send("You are logged out succesfully.");
  } catch (error) {
    return next(error);
  }
};
