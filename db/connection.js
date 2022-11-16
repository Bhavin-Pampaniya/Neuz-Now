const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/neuzwebsite")
    .then(()=>{
        console.log("connected to database successfully");
    }).catch((e)=>{
        console.log("some error occurred",e.message);
    })
