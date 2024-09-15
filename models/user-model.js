const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  profilePicture: {
    type: String,
    default: "default-profile.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
  hisab: [{ type: mongoose.Schema.Types.ObjectId, ref: "hisab" }],
});

function userValidate(data) {
  let schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    username: Joi.string().min(3).max(20).trim().required(),
    email: Joi.string().lowercase().trim().required(),
    password: Joi.string().min(4),
  });
  let { error } = schema.validate(data);
  return error;
}

const userModel = mongoose.model("users", userSchema);

module.exports = { userValidate, userModel };
