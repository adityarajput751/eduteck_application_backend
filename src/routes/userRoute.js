import express from "express";
import { sendOtp } from "../controllers/userController.js";
// import { sendOtp } from "../controllers/userController";


const userRouter = express.Router();

userRouter.post("/send-otp", sendOtp);

export default userRouter;
