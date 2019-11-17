var middleware = require("../common/middleware");
var OrderController = require("../controllers/order.controller");

exports.routeConfig = function(app) {
  app.get("/order", [OrderController.list]);
  app.post("/order", [OrderController.insert]);
  app.get("/order/:order_id", [OrderController.getById]);
  app.patch("/order/:order_id", [OrderController.patchById]);
  app.delete("/order/:order_id", [OrderController.removeById]);
};
