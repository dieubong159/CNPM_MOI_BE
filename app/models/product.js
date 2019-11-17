var mongoose = require("../common/mongoose.service").mongoose;
var Schema = mongoose.Schema;
var CategorySchema = require("./categories").CategorySchema;

var ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: Number,
  description: { type: String, default: "Chưa có mô tả" },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  image: String,
  dateCreate: {
    type: String,
    default:
      new Date().getDate() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getFullYear()
  },
  origin: String
});

const Product = mongoose.model("Product", ProductSchema);
const Category = mongoose.model("Category", CategorySchema);

exports.createProduct = async productData => {
  const product = new Product(productData);
  var valid = mongoose.Types.ObjectId.isValid(productData.category);
  if (valid) {
    const productExist = await Category.exists({ _id: productData.category });
    if (!productExist) return { message: "Product not exist" };
  } else {
    return { message: "Not a valid ID" };
  }
  return product.save();
};

exports.findById = id => {
  console.log(id);
  return Product.findOne({ _id: id })
    .then(result => {
      // console.log("alo");
      result = result.toJSON();
      delete result.__v;
      return result;
    })
    .catch(function(err) {
      return err;
    });
};

exports.findByName = name => {
  console.log(name);
  return Product.find({ name: { $regex: ".*" + name + ".*" } })
    .map(function(doc) {
      return doc;
    })
    .catch(function(err) {
      return err;
    });
};

exports.filterByPrice = (min, max) => {
  return Product.find({ price: { $gte: min, $lte: max } })
    .map(function(doc) {
      return doc;
    })
    .catch(function(err) {
      return err;
    });
};

exports.listByCategory = (perPage, page, idCategory) => {
  return new Promise((resolve, reject) => {
    Product.find({ category: idCategory })
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, products) {
        if (err) reject(err);
        else resolve(products);
      });
  });
};

exports.patchProduct = (id, productData) => {
  return new Promise((resolve, reject) => {
    Product.findById(id, async function(err, product) {
      if (err) reject(err);
      for (let i in productData) {
        // console.log(i);
        if (i === "category") {
          var valid = mongoose.Types.ObjectId.isValid(productData[i]);
          console.log(productData[i]);
          console.log(valid);
          if (valid) {
            const productExist = await Category.exists({
              _id: productData[i]
            });
            console.log(productExist);
            if (!productExist) reject("Product not exist");
          } else {
            return reject("Not an valid id");
          }
        }
        product[i] = productData[i];
      }
      product.save(function(err, updatedProduct) {
        if (err) return reject(err);
        resolve(updatedProduct);
      });
    });
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Product.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, products) {
        if (err) reject(err);
        else resolve(products);
      });
  });
};

exports.removeById = id => {
  return new Promise((resolve, reject) => {
    Product.remove(
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

exports.ProductSchema = ProductSchema;
