const { Router } = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const userRoutes = Router();

userRoutes.route("/").post(registerUser).get(protect, allUsers);
userRoutes.post("/login", authUser);

module.exports = userRoutes;
