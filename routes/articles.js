const express = require("express");
const router = express.Router();

// const {fetch} = require("../server");
const fetch = (...args) =>
import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.get("/international", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/international",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})

router.get("/health", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
            "https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        console.log(data);
        // console.log(data);
        res.render("articles/health",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})
router.get("/science", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=in&category=science&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/science",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})
router.get("/sports", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/sports",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})
router.get("/technology", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/technology",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})
router.get("/business", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/business",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})
router.get("/entertainment", async (req, res) => {
    try {
        let flag = false;
        const cookie = req.cookies.jwt;
        if(cookie){
            flag = true
        }
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=eff6c38fe8674e6f91eebd45259238b4"
        );
        const data = await response.json();
        // console.log(data);
        res.render("articles/entertainment",{articles:data.articles,login:flag});
      } catch (error) {
          console.log(error.message);
      }
})





module.exports = router;