const express = require("express");
const router = express.Router();
const accountControllers = require("../Controller/accountContrller");
//login admin page
const certificate = {
  email: "admin@123",
  password: "admin",
};
router.get("/", accountControllers.handelLogin);

router.post("/register-user", accountControllers.registerUser);

router.get("/register", accountControllers.handelRegister);

router.post("/login", accountControllers.loginUser);

router.get("/logout", accountControllers.logoutUser);

router.post("/v1/api/register", accountControllers.registerApi);

router.post("/v1/api/login", accountControllers.loginApi);

router.post("/v1/api/userData", accountControllers.userData);

module.exports = router;
