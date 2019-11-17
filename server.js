var express = require("express"); //call express
var app = express(); //define our app using express
var bodyParser = require("body-parser"); //get the body-parser
var morgan = require("morgan"); //used to see the req
var passport = require("passport");
var path = require("path");

var mongoose = require("mongoose");
var port = process.env.PORT || 8080; //set the port for app

var usersRoute = require("./app/routes/users.routeConfig");
var categoryRoute = require("./app/routes/category.routeconfig");
var productRoute = require("./app/routes/product.routeConfig");
var orderRoute = require("./app/routes/order.routeConfig");
var postRoute = require("./app/routes/post.routeConfig");

//APP CONFIGURATION---
//configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH, POST, DELETE"
  );
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Accept, X-Requested-With, Content-type, Authorization, Range"
  );
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

//use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(passport.initialize());

usersRoute.routeConfig(app);
categoryRoute.routeConfig(app);
productRoute.routeConfig(app);
orderRoute.routeConfig(app);
postRoute.routeConfig(app);

//START THE SERVER
// ================================
app.listen(port);
console.log("Port can dung la: " + port);
