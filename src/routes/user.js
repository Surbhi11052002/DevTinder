const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_INFO = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "skills",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const requestsReceived = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId");

    res.json({
      message: "Requests received",
      data: requestsReceived,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_INFO)
      .populate("toUserId", USER_SAFE_INFO);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId);
      hiddenUsersFromFeed.add(req.toUserId);
    });

    const usersOnFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_INFO)
      .skip(skip)
      .limit(limit);

    console.log(usersOnFeed);
    res.json({ data: usersOnFeed });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
