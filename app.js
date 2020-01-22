const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require("passport");
const usersRoutes = require("./API/routes/users_rts");


//connect to database
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch(err => {
    console.log(err);
  });

//static routes and middleware
app.use("/static", express.static("views"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//CORS to allow access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", " POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//passport middleware
app.use(passport.initialize());
require("./authentication/passport")(passport);

//User routes
app.use("/users", usersRoutes);

//not found check the API
app.get("/", (req, res, next) => {
  res.json({
    message: "check the API in the link bellow",
    link: "https://github.com/NajeebJaba/pet_walk"
  });
});

//handling page not found error
app.use((req, res, next) => {
  const error = new Error("page not found");
  error.status = 404;
  next(error);
});

//handling rest of errors in case its not handeled in routes
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;