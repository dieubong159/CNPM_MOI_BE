var mongoose = require("../common/mongoose.service").mongoose;
var Schema = mongoose.Schema;

//category Schema
var CategorySchema = new Schema({
  name: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }]
});

exports.CategorySchema = CategorySchema;

const Category = mongoose.model("Category", CategorySchema);

exports.createCategory = categoryData => {
  const category = new Category(categoryData);
  return category.save();
};

exports.findById = id => {
  return Category.findById(id)
    .populate("products")
    .then(result => {
      result = result.toJSON();
      delete result.__v;
      return result;
    });
};

exports.patchCategory = (id, categoryData) => {
  return new Promise((resolve, reject) => {
    Category.findById(id, function(err, category) {
      if (err) reject(err);
      for (let i in categoryData) {
        category[i] = categoryData[i];
      }
      category.save(function(err, updatedCategory) {
        if (err) return reject(err);
        resolve(updatedCategory);
      });
    });
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Category.find()
      .populate("products")
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, categories) {
        if (err) reject(err);
        else resolve(categories);
      });
  });
};

exports.removeById = id => {
  return new Promise((resolve, reject) => {
    Category.remove(
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
