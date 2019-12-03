var middleware = require("../common/middleware");
var OrderController = require("../controllers/order.controller");

exports.routeConfig = function(app) {
  app.get("/order", [OrderController.list]);
  app.post("/order", middleware.checkToken, [OrderController.insert]);
  app.get("/order/:order_id", middleware.checkToken, [OrderController.getById]);
  app.patch("/order/:order_id", middleware.checkToken, [
    OrderController.patchById
  ]);
  app.patch("/order/confirmOrder/:order_id", OrderController.confirmOrder);
  app.delete("/order/:order_id", middleware.checkToken, [
    OrderController.removeById
  ]);
};
