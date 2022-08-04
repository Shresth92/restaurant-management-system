const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth_controller");
const cmsController = require("../controllers/cms_controller");
const middleware = require("../middleware/middleware");

router.post("/login", middleware.setsubadmin, authController.Login);
router.use("/", middleware.authenticateToken);
router.use("/", middleware.checksubadmin);
router.get("/restaurants", cmsController.Restaurants);
router.get("/:res_id/dishes", cmsController.Dishes);
router.post("/add-restaurants", cmsController.createRestaurant);
router.post("/:res_id/add-dishes", cmsController.createDishes);
router.post("/add-user", middleware.setuser, authController.Register);
router.get("/all", cmsController.all);
router.post("/logout", authController.Logout);

module.exports = router;
