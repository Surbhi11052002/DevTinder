const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("Error saving the user" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid Email ID");

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials");
    else {
      const isPasswordValid = await user.validatePassword(password);

      if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send("Login Successful");
      } else {
        throw new Error("Invalid Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.send("Logged out successfully");
});

module.exports = authRouter;
