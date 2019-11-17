var express = require("express");
var router = express.Router();
var UserController = require("../controllers/users.controller");
var middleware = require("../common/middleware");

// var User = require("../models/users");
exports.routeConfig = function(app) {
  app.get("/users", [UserController.list]);
  app.post("/users", [UserController.insert]);
  app.get("/users/:user_id", [UserController.getById]);
  app.patch("/users/:user_id", [UserController.patchById]);
  app.delete("/users/:user_id", [UserController.removeById]);

  app.post("/register", [UserController.insert]);
  app.post("/login", [UserController.login]);
};
