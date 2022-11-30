const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    if (!token) throw new Error({ message: "Please authenticate yourself" });
    const userId = jwt.verify(token, process.env.PRIVATE_KEY);
    console.log(userId);
    req._id = userId;
    req.user = await User.findOne({ _id: userId });
    console.log(req.user);
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using valid token" });
    // res.send(  );

  }
};

module.exports = authUser;
