const express = require("express");
const router = express.Router();

const {
  getLoginController,
  getRegisterController,
  postRegisterController,
  postLoginController,
  logoutController,
  profileController,
} = require("../controllers/index-controller");

const {
  isLoggedIn,
  redirectIfLoggedIn,
} = require("../middlewares/login-middleware");

router.get("/", redirectIfLoggedIn, getLoginController);

router.get("/register", redirectIfLoggedIn, getRegisterController);

router.post("/register", postRegisterController);

router.post("/login", postLoginController);

router.get("/logout", isLoggedIn, logoutController);

router.get("/profile", isLoggedIn, profileController);

module.exports = router;
