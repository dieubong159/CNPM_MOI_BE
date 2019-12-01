var express = require("express");
var router = express.Router();
var UserController = require("../controllers/users.controller");
var middleware = require("../common/middleware");
const passport = require("passport");
const passportConf = require("../common/passport");

const passportFacebook = passport.authenticate("facebookToken", {
  session: false
});
const passportJWT = passport.authenticate("jwt", {
  session: false
});
// var User = require("../models/users");
exports.routeConfig = function(app) {
  app.get("/users", middleware.checkToken, [UserController.list]);
  app.post("/users", [UserController.insert]);
  app.get("/users/:user_id", middleware.checkToken, [UserController.getById]);
  app.patch("/users/:user_id", middleware.checkToken, [
    UserController.patchById
  ]);
  app.delete("/users/:user_id", middleware.checkToken, [
    UserController.removeById
  ]);
  app.post("/users/verifyToken", UserController.verifyToken);

  app.post("/register", [UserController.insert]);
  app.post("/login", [UserController.login]);
  app.post("/secret", [UserController.secret]);

  app.post("/oauth/facebook", passportFacebook, [UserController.facebookOAuth]);
};
