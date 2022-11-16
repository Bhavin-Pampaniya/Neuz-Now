const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  const token = req.cookies.jwtlogin;
  if (!token) throw new Error({ message: "Please authenticate yourself" });
  try {
    const userId = jwt.verify(token, process.env.PRIVATE_KEY);
    console.log(userId);
    req._id = userId;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }
};


module.exports = authUser;