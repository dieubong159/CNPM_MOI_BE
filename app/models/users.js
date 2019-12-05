//grab the packages that we need for the user model
var mongoose = require("../common/mongoose.service").mongoose;
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJWT = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOption = {};
var jwt = require("jsonwebtoken");
var config = require("../../config");

jwtOption.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOption.secretOrKey = config.secret;

//let create our strategy for web token
var strategy = new JwtStrategy(jwtOption, function(jwt_payload, next) {
  console.log("payload received", jwt_payload);
  var user = User.findById({ _id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);
// exports.requireJWT = passport.authenticate("jwt", { session: false });
// exports.signIn = passport.authenticate("local", { session: false });

//user Schema
var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true },
    lowercase: true
  },
  password: String,
  name: String,
  address: String,
  phoneNumber: String,
  gender: Boolean,
  dateOfBirth: Date,
  isAdmin: Boolean,
  isActivated: Boolean,
  method: String,
  facebook: {
    id: String,
    email: String
  }
});

const signToken = user => {
  var payload = { id: user._id };
  return jwt.sign(payload, jwtOption.secretOrKey, { expiresIn: 360 });
};

exports.verifyToken = async (token, secretKey) => {
  try {
    var decoded = await jwt.verify(token, secretKey);
  } catch (err) {
    return err;
  }
  return decoded;
};

exports.signToken = signToken;

exports.UserSchema = UserSchema;

const User = mongoose.model("Users", UserSchema);

exports.createUser = userData => {
  const user = new User(userData);
  //hash the password only if the password has been changed or user is new
  if (!user.isModified("password")) return next;
  //generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
    //change the password to the hash version
    user.password = hash;
  });
  return user.save();
};

exports.findById = id => {
  return User.findById(id).then(result => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
};

exports.findByEmail = email => {
  return User.findOne({ email: email });
};

exports.patchUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    User.findById(id, function(err, user) {
      if (err) reject(err);
      for (let i in userData) {
        user[i] = userData[i];
      }
      user.save(function(err, updatedUser) {
        if (err) return reject(err);
        resolve(updatedUser);
      });
    });
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, users) {
        if (err) reject(err);
        else resolve(users);
      });
  });
};

exports.removeById = id => {
  return new Promise((resolve, reject) => {
    User.remove(
      {
        _id: id
      },
      err => {
        if (err) reject(err);
        else resolve(err);
      }
    );
  });
};

exports.login = async loginData => {
  if (loginData.email && loginData.password) {
    var user = await this.findByEmail(loginData.email);
    if (!user) {
      return { message: "No such user found", user };
    }
    if (!user.isAdmin) {
      return { msg: "Email or Password is incorrect" };
    }
    if (bcrypt.compareSync(loginData.password, user.password)) {
      //from now on we’ll identify the user by the id and the id is
      //the only personalized value that goes into our token
      const token = signToken(user);
      return { msg: "ok", token: token };
    } else {
      return { msg: "Email or Password is incorrect" };
    }
  }
};

exports.loginAdmin = async loginData => {
  if (loginData.email && loginData.password) {
    var user = await this.findByEmail(loginData.email);
    if (!user) {
      return { message: "No such user found", user };
    }
    if (bcrypt.compareSync(loginData.password, user.password)) {
      //from now on we’ll identify the user by the id and the id is
      //the only personalized value that goes into our token
      const token = signToken(user);
      return { msg: "ok", token: token };
    } else {
      return { msg: "Email or Password is incorrect" };
    }
  }
};
