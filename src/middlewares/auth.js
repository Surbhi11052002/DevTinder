const adminAuth = (req, res, next) => {
  console.log("Admin is getting checked!");
  const token = "xyz";
  const isAuthorized = token === "xyz";

  if (!isAuthorized) {
    console.log("unauthorized");
    res.status(401).send("Admin is unauthorized");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
