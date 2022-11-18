const express = require("express");
const router = express.Router();

router.get("/local", (req, res) => {
    
  const articles = [
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
  res.render("localArticles/articles", { articles: articles });
});

module.exports = router;
