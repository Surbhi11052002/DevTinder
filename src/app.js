const express = require("express");

const app = express();
const port = 7777;

const { adminAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAlldata", (req, res) => {
  res.send("All data sent successfully");
});
app.delete("/admin/deleteuser", (req, res) => {
  res.send("User Data deleted successfully");
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
