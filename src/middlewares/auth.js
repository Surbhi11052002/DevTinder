const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { request } = require("express");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token.");

    const data = await jwt.verify(token, "SURBHI@123#");

    const { _id } = data;
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
