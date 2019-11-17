var mongoose = require("../common/mongoose.service").mongoose;
var Schema = mongoose.Schema;
var ProductModel = require("./product");
var ProductSchema = ProductModel.ProductSchema;

var OrderSchema = new Schema({
  address: { type: String, required: true },
  note: String,
  paymentMethod: { type: Boolean, default: true, required: true },
  dateOrder: { type: Date, default: Date.now },
  shippingCondition: { type: Boolean, default: false, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  products: [{ product: ProductSchema, quantity: Number }]
});

const Order = mongoose.model("Order", OrderSchema);
const Product = mongoose.model("Product", ProductSchema);

var OrderTest = new Order({
  address: "Quang Nam",
  note: "Nothing",
  user: "5d9de76cb54ab237fc1a1b12",
  products: [
    {
      _id: "5da4ac87a4c3331b78dff338",
      quantity: 6
    },
    {
      _id: "5da4ac87a4c3331b78dff338",
      quantity: 7
    },
    {
      _id: "5da4ac87a4c333338",
      quantity: 8
    }
  ]
});
exports.createOrder = async productData => {
  const order = new Order(productData);
  for (let i in order.products) {
    const productExist = await Product.exists(order.products[i]._id);
    console.log(productExist);
    if (!productExist) {
      return { error: "Unknown product ID: " + order.products[i]._id };
    }
  }
  return order.save();
};
exports.findById = id => {
  return (
    Order.findById(id)
      // .populate("Category")s
      .then(result => {
        result = result.toJSON();
        delete result.__v;
        return result;
      })
  );
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Order.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, orders) {
        if (err) reject(err);
        else resolve(orders);
      });
  });
};

exports.removeById = id => {
  return new Promise((resolve, reject) => {
    Order.remove(
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
