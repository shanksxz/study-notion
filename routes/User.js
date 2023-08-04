const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

//login
router.post("/login", login);

//signup
router.post("/signup", signup);

//confirmation - otp
router.post("/sendotp", sendotp);

//changing password
router.post("/changepassword", auth, changePassword);

//reset password token - mail lol
router.post("/reset-password-token", resetPasswordToken);

// actually reseting password
router.post("/reset-password", resetPassword);

module.exports = router;
