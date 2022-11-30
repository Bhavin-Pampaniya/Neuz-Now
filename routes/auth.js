const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authUser = require("../middleware/authUser");
const Contact = require("../models/contact");
const success = false;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
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
      return res.status(400).render("articles/signup", {
        message: errors.errors[0].msg,
      });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user)
        return res
          .status(400)
          .render("articles/signup", {
            message: "user with this email already exists",
          });
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

          // const here = localStorage.getItem("token")
          // console.log(here);
          //   localStorage.setItem('jwt',"tokenhai ye");
          //   localStorage.getItem("mytoken",token);

          //   console.log("ye mera cookie hai", req.cookies.jwtcreate);

          await user.save();
          try {
            const response = await fetch(
              "https://newsapi.org/v2/top-headlines?country=in&apiKey=eff6c38fe8674e6f91eebd45259238b4"
            );
            const data = await response.json();
            // res.render("articles/index", {
            //   articles: data.articles,
            //   login: true,
            // });
          } catch (error) {
            console.log(error.message);
          }
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
        // const message = {
        //   msg: "passwords are not matching",
        // };
        res.render("articles/signup", {
          message: "passwords are not matching",
        });
        //   res.json({error:"passwords are not matching bro kuch kar"})
        console.log({ error: "passwords are not matching bro kuch kar" });
        // throw new userError(success, "Passwords are not matching");
      }
    } catch (error) {
      res.render("articles/signup", { message: error.message });
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
    const message = {
      msg: "Invalid Details",
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.errors[0].msg, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).render("articles/login", { message: message });
      console.log(user);
      // console.log("here");
      const token = await user.generateToken();
      console.log("this is token ", token);
      res.cookie("jwt", token, {
        httpOnly: true,
      });
      console.log("ye mera login ka cookie hai", req.cookies.jwt);
      const passwordCheck = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(passwordCheck);
      if (passwordCheck) {
        try {
          const response = await fetch(
            "https://newsapi.org/v2/top-headlines?country=in&apiKey=eff6c38fe8674e6f91eebd45259238b4"
          );
          const data = await response.json();
          // res.status(201).json({ success: true, token });
          //   res.render("articles/index", {
          //     articles: data.articles,
          //     login: true,
          //   });
          res.redirect("/");
        } catch (error) {
          console.log(error.message);
        }
      } else {
        // throw new userError("ReferenceError", "Passwords are not matching");
        res.status(400).render("articles/login", { message: message });
      }
    } catch (error) {
      const message = {
        msg: error.message,
      };
      res.render("articles/login", { message: message });
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

router.post(
  "/contact",
  [
    body("name", "name should be atleast of 3 character").isLength({ min: 3 }),
    body("email", "please enter a valid email").isEmail(),
  ],
  async (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
      console.log("token hai");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success,
          message: errors.errors[0].msg,
          errors: errors.array(),
        });
      }
      try {
        let contact = new Contact({
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
        });
        console.log(contact);
        await contact.save();
        res.redirect("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("token naahi hai");
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?country=in&apiKey=eff6c38fe8674e6f91eebd45259238b4"
      );
      const data = await response.json();
      res.render("articles/404", {
        message: "Please login first to send feedback",
      });
      // res.render("articles/index", {
      //   articles: data.articles,
      //   message: "Please login first to send feedback",
      // });
      // res.redirect("/");
    }
  }
);

module.exports = router;
