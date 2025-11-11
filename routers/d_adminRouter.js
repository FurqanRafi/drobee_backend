import express from "express";
import { loginAdmin } from "../controller/d_adminController.js";


const router = express.Router();

router.post("/login", loginAdmin);

export default router;
