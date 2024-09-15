const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user-model");
const dbgr = require("debug")("development:isLoggedIn");

const isLoggedIn = async (req, res, next) => {
  try {
    let cookieToken = req.cookies.token;

    if (!cookieToken) {
      return res.redirect("/");
    }

    jwt.verify(
      cookieToken,
      process.env.JSON_WEB_TOKEN,
      async (err, decoded) => {
        if (err) {
          dbgr(`Token verification error: ${err.message}`);
          return res.redirect("/");
        }

        if (!decoded || !decoded.id || !decoded.email) {
          dbgr("Token is missing required properties (id, email).");
          return res.redirect("/");
        }

        let user = await userModel.findOne({ email: decoded.email });

        if (!user) {
          dbgr("User not found for the provided token.");
          return res.redirect("/");
        }

        req.user = user;
        next();
      }
    );
  } catch (err) {
    dbgr(`Error during token validation: ${err.message}`);
    return res.status(500).render("error", {
      err: "Internal server error during authentication.",
      status: 500,
    });
  }
};

const redirectIfLoggedIn = (req, res, next) => {
  const cookieToken = req.cookies.token;

  if (!cookieToken) {
    return next();
  }

  try {
    let decoded = jwt.verify(cookieToken, process.env.JSON_WEB_TOKEN);

    if (decoded && decoded.id && decoded.email) {
      return res.redirect("/profile");
    } else {
      return next();
    }
  } catch (err) {
    dbgr(`Token verification error in redirectIfLoggedIn: ${err.message}`);
    return next();
  }
};

module.exports = {
  isLoggedIn,
  redirectIfLoggedIn,
};
