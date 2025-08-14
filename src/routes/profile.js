const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) throw new Error("Invalid Edit Fields");
    const LoggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (LoggedInUser[key] = req.body[key]));
    await LoggedInUser.save();
    res.send(
      `${LoggedInUser.firstName} ${LoggedInUser.lastName} Profile Updated Successfully`
    );
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit-password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      throw new Error("Both old and new password is required");

    const user = req.user;
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) throw new Error("Old Password is incorrect");
    if (oldPassword === newPassword)
      throw new Error("New Password cannot be same as the old password");
    if (!validator.isStrongPassword(newPassword))
      throw new Error("Enter Strong Password");

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password updated successfully ");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
