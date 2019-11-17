const PostModel = require("../models/post");

exports.insert = (req, res) => {
  PostModel.createUser(req.body).then(result => {
    res.status(201).send({
      id: result._id
    });
  });
};

exports.getById = (req, res) => {
  PostModel.findById(req.params.post_id).then(result => {
    res.status(200).send(result);
  });
};

exports.getByTitle = (req, res) => {
  PostModel.findByTitle(req.params.title).then(result => {
    res.status(200).send(result);
  });
};

exports.patchById = (req, res) => {
  PostModel.patchUser(req.params.post_id, req.body).then(result => {
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
  PostModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.removeById = (req, res) => {
  PostModel.removeById(req.params.post_id).then(result => {
    res.status(204).send(result);
  });
};
