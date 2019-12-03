const UserModel = require("../models/users");
const crypto = require("crypto");
const signToken = UserModel.signToken;
const config = require("../../config");

exports.insert = (req, res) => {
  UserModel.createUser(req.body).then(result => {
    res.status(201).send({
      id: result._id
    });
  });
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.user_id).then(result => {
    res.status(200).send(result);
  });
};

exports.patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }
  UserModel.patchUser(req.params.user_id, req.body).then(result => {
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
  UserModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.removeById = (req, res) => {
  UserModel.removeById(req.params.user_id).then(result => {
    res.status(204).send(result);
  });
};

exports.login = (req, res) => {
  UserModel.login(req.body).then(result => {
    res.status(200).send(result);
  });
};

exports.loginAdmin = (req, res) => {
  UserModel.loginAdmin(req.body).then(result => {
    res.status(200).send(result);
  });
};

exports.facebookOAuth = async (req, res, next) => {
  //Generate token
  if (req.user.err) {
    res.status(401).json({
      success: false,
      message: "Auth failed",
      error: req.user.err
    });
  } else if (req.user) {
    const token = signToken(req.user);
    res.status(200).json({
      success: true,
      token: token,
      message: "Enjoy your token",
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Auth failed"
    });
  }
};

exports.secret = async (req, res, next) => {
  console.log("Secret here");
};

exports.verifyToken = async (req, res, next) => {
  if (req.body.token) {
    UserModel.verifyToken(req.body.token, config.secret).then(result => {
      if (result.message) res.status(401).send(result);
      else res.status(200).send(result);
    });
  }
};
