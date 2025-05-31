// import { addAdmin, addDoctor, loginAdmin } from "../controllers/adminController.js";
import { addAdmin, loginAdmin } from "../controllers/adminController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const adminrouter = express.Router();

adminrouter.post("/add-admin", addAdmin);
adminrouter.post('/admin-login', loginAdmin);



export default adminrouter;
