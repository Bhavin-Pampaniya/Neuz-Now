const express = require("express");
const router = express.Router();
// const {fetch} = require("../server");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.get("/international", async (req, res) => {
    try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/international",{articles:data.articles});
      } catch (error) {
          console.log(error.message);
      }
})




module.exports = router;