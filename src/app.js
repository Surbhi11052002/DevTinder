const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
const port = 7777;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log("Logged in user is : " + user.firstName + user.lastName);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
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

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("connection established");
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => console.log("connection rejected"));
