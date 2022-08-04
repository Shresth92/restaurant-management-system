const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const pool_conf = require("../database.json");
let pool = new Pool(pool_conf["dev"]);
const ApiError = require("../error/errorClass");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return next(ApiError.error(401, error.message, error));
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return next(ApiError.error(403, err.message, err));
    try {
      (async () => {
        let query = await pool.query(
          `SELECT end_at from session WHERE id='${payload.session_id}'`
        );
        if (payload.role == "admin" || payload.role == "sub admin") {
          req.created_by = payload.id;
        }
        if (!query.rows[0].end_at) {
          req.email = payload.email;
          req.session_id = payload.session_id;
          req.id = payload.id;
          req.role = payload.role;
          next();
        } else {
          const err = new Error("User already logged out");
          return next(ApiError.error(400, "Please login first", err));
        }
      })();
    } catch (error) {
      return next(error);
    }
  });
};

exports.checkuser = async (req, res, next) => {
  if (req.role == "user") {
    next();
  } else {
    const err = new Error("Cannot access user routes");
    return next(ApiError.error(403, "Forbidden", err));
  }
};

exports.checkadmin = async (req, res, next) => {
  if (req.role == "admin") {
    next();
  } else {
    const err = new Error("Cannot access admin routes");
    return next(ApiError.error(403, "Forbidden", err));
  }
};

exports.checksubadmin = async (req, res, next) => {
  if (req.role == "sub admin") {
    next();
  } else {
    const err = new Error("Cannot access sub admin routes");
    return next(ApiError.error(403, "Forbidden", err));
  }
};

exports.setadmin = async (req, res, next) => {
  req.setrole = "admin";
  next();
};

exports.setsubadmin = async (req, res, next) => {
  req.setrole = "sub admin";
  next();
};

exports.setuser = async (req, res, next) => {
  req.setrole = "user";
  next();
};
