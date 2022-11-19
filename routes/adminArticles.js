const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

router.get("/local", async (req, res) => {
  let success = false;
  let isAdmin = false;
  let articles = false;
  let admin = false;
  try {
    if(req.cookies.jwt){
      console.log("inside");
      const token = req.cookies.jwt;
      const _id = jwt.verify(token, process.env.PRIVATE_KEY);
      console.log(_id);
      admin = await Admin.findOne({_id});
      console.log("my admin ",admin.name);
      if(admin) {
        isAdmin = true
      }
    }
  articles = [
    {
      title: "my title",
      description: "my description",
      urlToImage: "../../images/img1.jpg",
    },
    {
      title: "my title",
      description: "my description",
      urlToImage: "../../images/img2.jpg",
    },
    {
      title: "my title",
      description: "my description",
      urlToImage: "../../images/img3.jpg",
    },
    {
      title: "my title",
      description: "my description",
      urlToImage: "../../images/img3.jpg",
    },
    {
      title: "my title",
      description: "my description",
      urlToImage: "../../images/img3.jpg",
    },
    {
      title: "my title",
      description: "my description",
      urlToImage: "../../images/img3.jpg",
    },
  ];
  res.render("localArticles/articles", { articles: articles,admin:isAdmin,name:admin.name });
} catch (error) {
    res.status(500).json({success,error:error.message})
}
});

module.exports = router;
