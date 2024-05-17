const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path:"./.env"});
process.on("uncaughtException",(err)=>{
    console.log("UNCAUGHT EXCEPTION! Shutting down...");
    console.log(err.name,err.message);
    process.exit(1);

}
);
const app=require("./app")
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connection successful!");
}).catch((err)=>{
    console.error("DB connection failed",err);
    process.exit(1);

} );
const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
});
process.on("unhandledRejection",(err)=>{
    console.log("UNHANDLED REJECTION! Shutting down...");
    console.log(err.name,err.message);
    console.error(err);
    process.exit(1);
}
);