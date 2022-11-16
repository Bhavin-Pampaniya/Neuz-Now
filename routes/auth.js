const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
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
      let user = await User.findOne({ email: req.body.email });
      if (user)
        return res
          .status(400)
          .json({ success, error: "user with this email already exists" });
      console.log(req.body.name);
      console.log(req.body.email);
      let password = req.body.password;
      let confirmpassword = req.body.confirmpassword;
      console.log(password, confirmpassword);
      if (password === confirmpassword) {
        try {
            
        
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: password,
            confirmpassword: confirmpassword,
          });
          // console.log("here");
          const token = await user.generateToken();
          console.log(token);
          console.log("this is token ", token);
          res.cookie("jwt", token, {
            httpOnly: true,
          });
          console.log("ye mera cookie hai", req.cookies.jwt);
          await user.save();
          //   res.render("index");
          res.redirect("/");
        } catch (error) {
            const message = {
                msg: error.message,
              };
              res.render("articles/signup", { message: message });
        }
          //   res.status(201).json({ success: true, token });
          // res.send("successfully created account");
        
      } else {
        const message = {
            msg: "passwords are not matching",
          };
          res.render("articles/signup", { message: message });
        //   res.json({error:"passwords are not matching bro kuch kar"})
          console.log({error:"passwords are not matching bro kuch kar"})
        // throw new userError(success, "Passwords are not matching");
        
      }
    } catch (error) {
      const message = {
        msg: error.message,
      };
      res.render("articles/signup", { message: message });
      //   res.status(500).send({
      //     success,
      //     message: "Internal Server error",
      //     message: error.message,
      //   });
    }
  }
);

//LOGIN USER
router.post(
  "/login",
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
      let user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).json({ success, error: "Invalid Details" });
      console.log(user);
      // console.log("here");
      const token = await user.generateToken();
      console.log("this is token ", token);
      res.cookie("jwtlogin", token, {
        httpOnly: true,
      });
      console.log("ye mera login ka cookie hai", req.cookies.jwtlogin);
      const passwordCheck = bcrypt.compare(req.body.password, user.password);

      if (passwordCheck) {
        // res.status(201).json({ success: true, token });
        //   res.render("articles/index");
        res.redirect("/");
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

router.post("/getuser", authUser, async (req, res) => {
  const _id = req._id;
  try {
    const user = await User.findById(_id).select("-password -confirmpassword");
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({
      success,
      error: "Internal server error",
      e: error.message,
    });
  }
});

module.exports = router;
