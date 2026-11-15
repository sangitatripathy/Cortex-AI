import express from "express";
import { login, logout, updateUserPayment, deductCredits } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout",logout);
router.post("/update-plan",updateUserPayment);
router.post("/deduct-credits", deductCredits);
export default router;