const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const port = 7777;

//POST user api

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Surbhi",
    lastName: "Prasad",
    emailId: "surbhi@gmail.com",
    password: "surbhi@123",
  });

  try {
    user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("Error saving the user" + error.message);
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
