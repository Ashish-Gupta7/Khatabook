const { hisabModel, hisabValidate } = require("../models/hisab-model");
const { userModel } = require("../models/user-model");
const dbgr = require("debug")("development:hisabController");

const getCreateHisabController = (req, res) => {
  res.status(200).render("create");
};

const postCreateHisabController = async (req, res) => {
  try {
    let { title, description, passcode, encrypted, shareable, editPermission } =
      req.body;

    let err = hisabValidate({
      title,
      description,
      passcode,
      encrypted,
      shareable,
      editPermission,
    });
    if (err) {
      return res.status(400).render("error", { err: err.message, status: 400 });
    }

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editPermission = editPermission === "on" ? true : false;

    try {
      let newHisab = await hisabModel.create({
        title,
        description,
        passcode,
        user: req.user._id,
        encrypted,
        shareable,
        editPermission,
      });

      let user = await userModel.findOne({ email: req.user.email });
      user.hisab.push(newHisab._id);
      await user.save();
      return res.status(201).redirect("/profile");
    } catch (err) {
      dbgr(`Error during newHisab: ${err.message}`);
      return res.status(500).render("error", {
        err: "Something went wrong while creating your hisab.",
        status: 500,
      });
    }
  } catch (err) {
    dbgr(`Error during hisab creation: ${err.message}`);
    return res.status(500).render("error", {
      err: "Server error occurred, please try again.",
      status: 500,
    });
  }
};

const showHisabController = async (req, res) => {
  try {
    let hisabId = req.params.hisabId;
    let hisab = await hisabModel.findOne({ _id: hisabId });
    let encrypted = hisab.encrypted;
    if (encrypted) {
      return res.status(200).render("passcode", { hisabId });
    } else {
      return res.status(200).render("hisab", { hisab });
    }
  } catch (err) {
    dbgr(`Error During showHisabController: ${err.message}`);
    return res.status(500).render("error", {
      err: "Server error occurred, please try again.",
      status: 500,
    });
  }
};

const passcodeHisabController = async (req, res) => {
  try {
    let hisabId = req.params.hisabId;
    let hisab = await hisabModel.findOne({ _id: hisabId });
    let passcode = req.body.passcode;
    console.log(passcode);
    console.log("hisabId");
    console.log("hisab");
    console.log(passcode !== hisab.passcode);

    console.log("hhh");

    if (passcode !== hisab.passcode) {
      return res
        .status(401)
        .render("error", { err: "Incorrect passcode.", status: 401 });
    } else {
      console.log("check");

      return res.status(200).render("hisab", { hisab });
    }
  } catch (err) {
    dbgr(`Error during passcodeHisabController: ${err.message}`);
    return res.status(500).render("error", {
      err: "Server error occurred, please try again.",
      status: 500,
    });
  }
};

const deleteHisabController = async (req, res) => {
  try {
    let hisabId = req.params.hisabId;
    let user = req.user;
    let hisab = await hisabModel.findOne({ _id: hisabId });

    if (
      user.hisab.includes(hisabId) &&
      user._id.toString() === hisab.user.toString()
    ) {
      await hisabModel.deleteOne({
        _id: hisabId,
      });
      return res.status(200).redirect("/profile");
    } else {
      return res.status(403).render("error", {
        err: "You are not authorized to delete this hisab.",
        status: 403,
      });
    }
  } catch (err) {
    dbgr(`Error During deleteHisabController: ${err.message}`);
    return res.status(500).render("error", {
      err: "Server error occurred, please try again.",
      status: 500,
    });
  }
};

const getEditHisabController = async (req, res) => {
  try {
    let hisabId = req.params.hisabId;
    let user = req.user;
    let hisab = await hisabModel.findOne({ _id: hisabId });

    if (
      user.hisab.includes(hisabId) &&
      user._id.toString() === hisab.user.toString()
    ) {
      return res.status(200).render("edit", { hisab });
    } else {
      return res.status(403).render("error", {
        err: "You are not authorized to edit this hisab.",
        status: 403,
      });
    }
  } catch (err) {
    dbgr(`Error During getEditHisabController: ${err.message}`);
    return res.status(500).render("error", {
      err: "Server error occurred, please try again.",
      status: 500,
    });
  }
};

const postEditHisabController = async (req, res) => {
  try {
    let { title, description, encrypted, passcode, shareable, editPermission } =
      req.body;

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editPermission = editPermission === "on" ? true : false;

    let err = hisabValidate({
      title,
      description,
      passcode,
      encrypted,
      shareable,
      editPermission,
    });
    if (err) {
      return res.status(400).render("error", { err: err.message, status: 400 });
    }

    let hisab = await hisabModel.findOneAndUpdate(
      { _id: req.params.hisabId, user: req.user._id },
      { title, description, passcode, encrypted, shareable, editPermission }
    );

    if (!hisab) {
      return res.status(403).render("error", {
        err: "You are not authorized to edit this hisab.",
        status: 403,
      });
    }

    return res.status(200).redirect("/profile");
  } catch (err) {
    dbgr(`Error during postEditHisabController: ${err.message}`);
    return res.status(500).render("error", {
      err: "Something went wrong while updating your hisab.",
      status: 500,
    });
  }
};

const viewHisabController = async (req, res) => {
  try {
    let hisabId = req.params.hisabId;
    let hisab = await hisabModel.findOne({ _id: hisabId });
    let loggedInUser = req.user;
    let hisabsUser = hisab.user;
    if (loggedInUser || hisabsUser) {
      if (hisab.encrypted) {
        return res.render("viewerPass", { hisabId });
      }
    } else {
      return res.status(403).render("error", {
        err: "You are not authorized to view this hisab.",
        status: 403,
      });
    }
  } catch (err) {
    dbgr(`Error during viewHisabController: ${err.message}`);
    return res.status(500).render("error", {
      err: "Server error occurred, please try again.",
      status: 500,
    });
  }
};

module.exports = {
  getCreateHisabController,
  postCreateHisabController,
  showHisabController,
  deleteHisabController,
  getEditHisabController,
  postEditHisabController,
  passcodeHisabController,
  viewHisabController,
};
