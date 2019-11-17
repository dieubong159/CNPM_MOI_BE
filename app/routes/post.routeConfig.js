// var express = require("express");
// var router = express.Router();
var middleware = require("../common/middleware");
var PostController = require("../controllers/post.controller");

// var User = require("../models/users");

exports.routeConfig = function(app) {
  app.get("/post", [PostController.list]);
  app.post("/post", [PostController.insert]);
  app.get("/post/:post_id", [PostController.getById]);
  app.get("/post/:title", [PostController.getByTitle]);
  app.patch("/post/:post_id", [PostController.patchById]);
  app.delete("/post/:post_id", [PostController.removeById]);
};
