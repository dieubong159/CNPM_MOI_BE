var ProductController = require("../controllers/product.controller");
var middleware = require("../common/middleware");

exports.routeConfig = function(app) {
  app.get("/product", [ProductController.list]);
  app.get("/product/filter", [ProductController.filterByPrice]);

  app.post("/product", middleware.checkToken, [ProductController.insert]);
  app.get("/product/:product_id", [ProductController.getById]);

  app.get("/product/listByCategory/:category_id", [
    ProductController.listByCategory
  ]);

  app.post("/product/getByName/", [ProductController.getByName]);

  app.patch("/product/:product_id", middleware.checkToken, [
    ProductController.patchById
  ]);
  app.delete("/product/:product_id", middleware.checkToken, [
    ProductController.removeById
  ]);
};
