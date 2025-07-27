const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const port = 7777;

app.use(express.json());
//POST user api

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    if (users.length === 0) {
      res.status(404).send("User not found!");
    } else res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

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
