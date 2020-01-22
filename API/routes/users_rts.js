const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_ctl");
const passport = require("passport");

// route   POST users/register
// desc    Register user
// access  Private
router.post("/register", usersController.userRegister);

// route   GET users/login
// desc    Login User / Returning JWT Token
// access  Public
router.post("/login", usersController.userLogin);

module.exports = router;
