require("dotenv").config();

const express = require("express");
const mongoose  = require("mongoose");
const cookieParser = require("cookie-parser"); 
const Blog = require("./models/blog");


const path = require('path');
mongoose.connect(process.env.MONGO_URL).then((e)=>{console.log("Database Connected")});
const app = express();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/auth");

app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

const PORT = process.env.PORT || 8080;


app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});;
app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=>{
    console.log("Server started at 8080");
});

