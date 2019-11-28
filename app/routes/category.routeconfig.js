var middleware = require("../common/middleware");
var CategoryController = require("../controllers/category.controller");

exports.routeConfig = function(app) {
  app.get("/category", middleware.checkToken, [CategoryController.list]);
  app.post("/category", middleware.checkToken, [CategoryController.insert]);
  app.get("/category/:category_id", middleware.checkToken, [
    CategoryController.getById
  ]);
  app.patch("/category/:category_id", middleware.checkToken, [
    CategoryController.patchById
  ]);
  app.delete("/category/:category_id", middleware.checkToken, [
    CategoryController.removeById
  ]);
};
