import express from "express";
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  changePassword,
  changeEmail,
  forgotPassword,
  resetPassword,
  getUsersCount,
  getUsers,
} from "../controller/d_userController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile/update", authMiddleware, updateUserProfile);
router.delete("/profile/delete", authMiddleware, deleteUserProfile);

router.put("/profile/change-password", authMiddleware, changePassword);
router.put("/profile/change-email", authMiddleware, changeEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/users/count", getUsersCount);
router.get("/users", getUsers);

export default router;
