var middleware = require("../common/middleware");
var CategoryController = require("../controllers/category.controller");

exports.routeConfig = function(app) {
  app.get("/category", [CategoryController.list]);
  app.post("/category", [CategoryController.insert]);
  app.get("/category/:category_id", [CategoryController.getById]);
  app.patch("/category/:category_id", [CategoryController.patchById]);
  app.delete("/category/:category_id", [CategoryController.removeById]);
};
