require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const sessionStorage = require("node-sessionstorage");
const initWebRoutes = require("./Routes/routes");
const Category = require("./Models/Category");
const accountRouter = require("./Routes/accountRouter");
const cors = require("cors");
const connectDB = require("./Config/connectDB");
const app = express();
const PORT = process.env.PORT || 8081;
app.use(cors());
//database connection mongodb
mongoose
  .connect("mongodb://127.0.0.1/VegetableApp")
  .then(() => {
    console.log("connect successfully");
  })
  .catch((err) => {
    console.log("connect fail", err);
  });
const db = mongoose.connection;

//database connection mysql
connectDB();
// setup express session
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
db.once("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

//app.use(bodyParser.json({ type: "application/*+json" })); // parse various different custom JSON types as JSON

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//set engine
app.set("view engine", "ejs");

app.use("", require("./Routes/routerApi"));

app.use("", require("./Routes/accountRouter"));

// app.use((req, res, next) => {
//   let check = sessionStorage.getItem("admin_login") ? true : false;
//   if (check) {
//     next();
//   } else {
//     res.redirect("/");
//   }
// });
// web Routes
app.use("", require("./Routes/routes"));

// use public
app.use(express.static("public"));

app.use(express.static("uploads"));

app.listen(PORT, () => {
  console.log(`listening on port at http://localhost:${PORT}`);
});
