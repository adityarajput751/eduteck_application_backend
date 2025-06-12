import validator from "validator";
import bcrypt from "bcrypt";
// import adminModel from "../models/adminModal.js";
import jwt from 'jsonwebtoken';
import adminModel from "../models/admin/adminModel.js";
import dotenv from "dotenv";
dotenv.config();
const addAdmin = async (req, res) => {
  try {
    console.log(req.body.name, "helloooo");
    const {
      name,
      email,
      password
    } = req.body;
    const created_on = new Date();
    // console.log(!name || !email || !password);

    if (!name || !email || !password) {
      res.json({
        success: false,
        message: 'Please add all details'
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter valid email."
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please make your password strong."
      });
    }
    const existingAdmin = await adminModel.findOne({
      email
    });
    console.log(existingAdmin, 'existingAdminexistingAdmin');
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    if (existingAdmin) {
      return res.json({
        success: false,
        message: "Admin with this email already exists."
      });
    } else {
      const adminData = {
        name,
        email,
        password: hasedPassword,
        created_on
      };
      const newAdmin = new adminModel(adminData);
      await newAdmin.save();
      res.json({
        success: true,
        message: "Admin has been added successfully."
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};
const loginAdmin = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Fix: Use adminModel instead of 'admins'
    const admin = await adminModel.findOne({
      email
    });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }
    const token = jwt.sign({
      id: admin._id,
      email: admin.email,
      role: "admin"
    }, process.env.JWT_SECRET || "4r+MgDl67/94bAf42+MK+rhTTrA35KxGBaLd5T1HFIU=", {
      expiresIn: "24h"
    });
    const updatedAdmin = await adminModel.findByIdAndUpdate(admin._id, {
      token
    }, {
      new: true
    });
    console.log("Updated Admin with Token:", updatedAdmin);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
export { addAdmin, loginAdmin };