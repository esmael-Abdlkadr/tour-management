const express=require("express");
const morgan=require("morgan");
const rateLimit=require("express-rate-limit");
const authRouter = require("./src/router/authRoute")
const app=express();
 if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"));

 }
app.use(express.json());
    const limiter=rateLimit({
        max:100,
        windowMs:60*60*1000,
        message:"Too many requests from this IP, please try again in an hour"
    });
app.use("/api",limiter);
app.use("/api/v1/auth", authRouter)

module.exports=app;