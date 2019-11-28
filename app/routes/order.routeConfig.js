var middleware = require("../common/middleware");
var OrderController = require("../controllers/order.controller");

exports.routeConfig = function(app) {
  app.get("/order", middleware.checkToken, [OrderController.list]);
  app.post("/order", middleware.checkToken, [OrderController.insert]);
  app.get("/order/:order_id", middleware.checkToken, [OrderController.getById]);
  app.patch("/order/:order_id", middleware.checkToken, [
    OrderController.patchById
  ]);
  app.delete("/order/:order_id", middleware.checkToken, [
    OrderController.removeById
  ]);
};
