require("dotenv").config();
const express = require("express");
// import pkg from "express";
// import mongoose from "mongoose";
// const { express } = pkg;
// const app = pkg();
const app = express();
// const fetch = require("node-fetch");
// import fetch from "node-fetch";
const path = require('path');
app.use(express.static(path.join(__dirname, '/src')))
const port = 3000;
const cookieParser = require("cookie-parser");
const router = require("./routes/auth");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("./db/connection");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
// import articlesRoute from "./routes/articles";
// app.use("/articles",articlesRoute);
app.use("/admin", require("./routes/adminArticles"));
app.use("/api/admin",require("./routes/adminAuth"));
app.use("/category", require("./routes/articles")); 
app.use("/api", require("./routes/auth")); 
// app.set("views",path.join(__dirname,"./views/"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
  const response = await fetch(
    "https://newsapi.org/v2/top-headlines?country=in&apiKey=eff6c38fe8674e6f91eebd45259238b4"
  );
  const data = await response.json();
  res.render("articles/index",{articles:data.articles});
} catch (error) {
    console.log(error.message);
}
});

app.get("/login",(req,res)=>{
  res.render("articles/login")
})
app.get("/signup",(req,res)=>{
  res.render("articles/signup",{message:""})
})

app.listen(port, () => {
  console.log(`your app is listening at http://localhost:${port}`);
});


module.exports = {fetch};