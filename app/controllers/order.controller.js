const OrderModel = require("../models/order");

exports.insert = (req, res) => {
  OrderModel.createOrder(req.body).then(result => {
    res.status(201).send(result);
  });
};

exports.getById = (req, res) => {
  OrderModel.findById(req.params.order_id).then(result => {
    res.status(200).send(result);
  });
};

exports.patchById = (req, res) => {
  OrderModel.patchOrder(req.params.order_id, req.body).then(result => {
    res.status(204).send({});
  });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 50;
  let page = 0;
  if (req.query) {
    if (req.body.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.body.page) ? req.body.page : 0;
    }
  }
  OrderModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.confirmOrder = (req, res) => {
  OrderModel.confirmOrder(req.params.order_id, req.body).then(result => {
    res.status(204).send(result);
  });
};

exports.removeById = (req, res) => {
  OrderModel.removeById(req.params.order_id).then(result => {
    res.status(204).send(result);
  });
};
