const mongoose = require("mongoose");
const Joi = require("joi");

const hisabSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    shareable: {
      type: Boolean,
      default: false,
    },
    passcode: {
      type: String,
      default: "",
    },
    editPermission: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

function hisabValidate(data) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).trim().required(),
    description: Joi.string().trim().required(),
    encrypted: Joi.boolean().truthy("on").falsy(null, ""),
    shareable: Joi.boolean().truthy("on").falsy(null, ""),
    passcode: Joi.string().allow("").default(""),
    editPermission: Joi.boolean().truthy("on").falsy(null, ""),
  });

  const { error } = schema.validate(data);
  return error;
}

const hisabModel = mongoose.model("hisab", hisabSchema);

module.exports = { hisabModel, hisabValidate };
