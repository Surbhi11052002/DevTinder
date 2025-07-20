const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("this is a test page");
});

app.use("/", (req, res) => {
  res.send("WElCOME");
});

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777..");
});
