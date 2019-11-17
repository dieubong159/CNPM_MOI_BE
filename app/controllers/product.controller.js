const ProductModel = require("../models/product");

exports.insert = (req, res) => {
  ProductModel.createProduct(req.body).then(result => {
    res.status(201).send(result);
  });
};

exports.getById = (req, res) => {
  ProductModel.findById(req.params.product_id).then(result => {
    res.status(200).send(result);
  });
};

exports.getByName = (req, res) => {
  ProductModel.findByName(req.body.name).then(result => {
    res.status(200).send(result);
  });
};

exports.filterByPrice = (req, res) => {
  req.query.min = parseFloat(req.query.min);
  req.query.max = parseFloat(req.query.max);
  ProductModel.filterByPrice(req.query.min, req.query.max).then(result => {
    res.status(200).send(result);
  });
};

exports.patchById = (req, res) => {
  ProductModel.patchProduct(req.params.product_id, req.body).then(result => {
    res.status(204).send(result);
  });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.body.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.body.page) ? req.body.page : 0;
    }
  }
  ProductModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.listByCategory = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.body.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.body.page) ? req.body.page : 0;
    }
  }
  ProductModel.listByCategory(limit, page, req.params.category_id).then(
    result => {
      res.status(200).send(result);
    }
  );
};

exports.removeById = (req, res) => {
  ProductModel.removeById(req.params.product_id).then(result => {
    res.status(204).send(result);
  });
};
