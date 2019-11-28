// var express = require("express");
// var router = express.Router();
var middleware = require("../common/middleware");
var PostController = require("../controllers/post.controller");

// var User = require("../models/users");

exports.routeConfig = function(app) {
  app.get("/post", middleware.checkToken, [PostController.list]);
  app.post("/post", middleware.checkToken, [PostController.insert]);
  app.get("/post/:post_id", middleware.checkToken, [PostController.getById]);
  app.get("/post/:title", middleware.checkToken, [PostController.getByTitle]);
  app.patch("/post/:post_id", middleware.checkToken, [
    PostController.patchById
  ]);
  app.delete("/post/:post_id", middleware.checkToken, [
    PostController.removeById
  ]);
};
