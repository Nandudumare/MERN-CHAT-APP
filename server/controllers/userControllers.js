const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const userModel = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the Feilds");
  }

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const newUser = new userModel({
    name,
    email,
    password,
    pic,
  });

  await newUser.save();

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the new User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const oldUser = await userModel.findOne({ email });

  if (oldUser && (await oldUser.matchPassword(password))) {
    res.json({
      _id: oldUser._id,
      name: oldUser.name,
      email: oldUser.email,
      isAdmin: oldUser.isAdmin,
      pic: oldUser.pic,
      token: generateToken(oldUser._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
