const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type:String,
    default:1
  },
  token: {
    type: String,
    required: true,
  }
});

adminSchema.methods.generateToken = async function () {
  try {
    // console.log("inside");
    const payload = {
      _id: this.id,
    };
    const token = jwt.sign(payload, process.env.PRIVATE_KEY);
    // this.tokens = this.tokens.concat({ token });
    this.token = token;
    await this.save();
    return token;
  } catch (error) {
    response.send({ error: "some error occurred", message: error.message });
  }
};

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

const Admin = new mongoose.model("Admin", adminSchema);

module.exports = Admin;
