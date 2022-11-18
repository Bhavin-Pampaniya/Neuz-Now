const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const authUser = require("../middleware/authUser");

const success = false;

function userError(error, message) {
  this.error = error;
  this.message = message;
}

//CREATE USER
router.post(
  "/create",
  [
    body("name", "name should be atleast of 3 character").isLength({ min: 3 }), 
    body("email", "please enter a valid email").isEmail(),
    body("password", "length of password should be atleast 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success,
        message: errors.errors[0].msg,
        errors: errors.array(),
      });
    }
    try {
      let admin = await Admin.findOne({ email: req.body.email });
      console.log(admin);
      if (admin)
        return res
          .status(400)
          .json({ success, error: "Admin with this email already exists" });
      let password = req.body.password;
    //   let confirmpassword = req.body.confirmpassword;
    //   if (password !== confirmpassword)
    //     throw new userError(success, "Passwords are not matching");

      admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: password
      });
      console.log("here");
      const token = await admin.generateToken();
      console.log("this is token ", token);
      res.cookie("jwt", token, {
        httpOnly: true,
      });
      console.log("ye mera cookie hai", req.cookies.jwt);
      await admin.save();
      res.status(201).json({ success: true, token });
    } catch (error) {
      res.status(500).json({
        success,
        msg: "Internal Server error",
        message: error.message,
      });
    }
  }
);

//LOGIN USER
router.post(
  "/loginadmin",
  [
    body("email", "please enter a valid email").isEmail(),
    body("password", "length of password should be atleast 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res 
        .status(400)
        .json({ message: errors.errors[0].msg, errors: errors.array() });
    }

    try {
      let admin = await Admin.findOne({ email: req.body.email });
      if (!admin)
        return res.status(400).json({ success, error: "Invalid Details" });
      console.log(admin);
      // console.log("here");
      const token = await admin.generateToken();
      console.log("this is token ", token);
      res.cookie("jwt", token, {
        httpOnly: true,
      });
      console.log("ye mera login ka cookie hai", req.cookies.jwt);
      const passwordCheck = bcrypt.compare(req.body.password, admin.password);

      if (passwordCheck) {
        // res.status(201).json({ success: true, token });
        res.render("localArticles/articles",{login:true})
      } else {
        // throw new userError("ReferenceError", "Passwords are not matching");
        res
          .status(400)
          .json({ success: false, message: "passwords are not matching" });
      }
    } catch (error) {
      res.status(500).json({
        success,
        message: "Internal Server error",
        message: error.message,
      });
    }
  }
);

router.post("/getadmin", authUser, async (req, res) => {
  const _id = req._id;
  try {
    const admin = await Admin.findById(_id).select("-password -confirmpassword");
    res.status(200).json(admin);
  } catch (error) {
    res.status(401).json({
      success,
      error: "Internal server error",
      e: error.message,
    });
  }
});

module.exports = router;