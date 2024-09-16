const express = require("express");
const router = express.Router();

const {
  getCreateHisabController,
  postCreateHisabController,
  showHisabController,
  deleteHisabController,
  getEditHisabController,
  postEditHisabController,
  passcodeHisabController,
  viewHisabController,
} = require("../controllers/hisab-controller");

const { isLoggedIn } = require("../middlewares/login-middleware");

router.get("/", isLoggedIn, getCreateHisabController);

router.post("/create", isLoggedIn, postCreateHisabController);

router.get("/:hisabId", isLoggedIn, showHisabController);

router.get("/delete/:hisabId", isLoggedIn, deleteHisabController);

router.get("/edit/:hisabId", isLoggedIn, getEditHisabController);

router.post("/edit/update/:hisabId", isLoggedIn, postEditHisabController);

router.post("/verify/:hisabId", isLoggedIn, passcodeHisabController);

router.get("/verify/:hisabId", isLoggedIn, viewHisabController);

module.exports = router;
