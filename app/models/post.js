var mongoose = require("../common/mongoose.service").mongoose;
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  dateCreate: { type: Date, default: Date.now },
  images: [{ url: String, alt: String }]
});

const Post = mongoose.model("Post", PostSchema);

exports.createPost = postData => {
  const post = new Post(postData);
  return post.save();
};

exports.findById = id => {
  return Post.findById(id).then(result => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
};

exports.findByTitle = title => {
  return Post.find({ title: title });
};

exports.patchPost = (id, postData) => {
  return new Promise((resolve, reject) => {
    Post.findById(id, function(err, post) {
      if (err) reject(err);
      for (let i in postData) {
        post[i] = postData[i];
      }
      post.save(function(err, postUpdate) {
        if (err) return reject(err);
        resolve(postUpdate);
      });
    });
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Post.find()
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
    Post.remove(
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
