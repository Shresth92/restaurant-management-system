const express = require("express");

const router = express.Router();

const rmsController = require("../controllers/user_controller");
const middleware = require("../middleware/middleware");
const authController = require("../controllers/auth_controller");
const cmsController = require("../controllers/cms_controller");

router.post("/register", middleware.setuser, authController.Register);
router.post("/login", middleware.setuser, authController.Login);
router.get("/restaurants", cmsController.Restaurants);
router.get("/:res_id/dishes", cmsController.Dishes);
router.use("/", middleware.authenticateToken);
router.use("/", middleware.checkuser);
router.get("/address", cmsController.allAddress);
router.post("/add-address", rmsController.Address);
router.post("/logout", authController.Logout);

module.exports = router;
