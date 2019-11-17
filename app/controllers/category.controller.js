const CategoryModel = require("../models/categories");

exports.insert = (req, res) => {
  console.log(req.body);
  CategoryModel.createCategory(req.body).then(result => {
    res.status(201).send({
      id: result._id
    });
  });
};

exports.getById = (req, res) => {
  CategoryModel.findById(req.params.category_id).then(result => {
    res.status(200).send(result);
  });
};

exports.patchById = (req, res) => {
  CategoryModel.patchCategory(req.params.category_id, req.body).then(result => {
    res.status(204).send({});
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
  CategoryModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.removeById = (req, res) => {
  CategoryModel.removeById(req.params.category_id).then(result => {
    res.status(204).send(result);
  });
};
