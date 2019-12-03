var mongoose = require("../common/mongoose.service").mongoose;
var Schema = mongoose.Schema;
var ProductModel = require("./product");
var ProductSchema = ProductModel.ProductSchema;
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ngocdieupham711@gmail.com",
    pass: "dieu01886060734"
  }
});

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
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ]
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

exports.confirmOrder = (orderId, orderData) => {
  return new Promise((resolve, reject) => {
    Order.findById(orderId)
      .populate("Users")
      .exec(function(err, order) {
        if (err) reject(err);

        const mailOptions = {
          from: "ngocdieupham711@gmail.com", // sender address
          // to: order.user.email, // list of receivers
          to: "dieubong159@gmail.com",
          subject: "Xác nhận đơn hàng", // Subject line
          html:
            '<!doctype html><html><head> <meta charset="utf-8"><style> .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; font-family: \'Helvetica Neue\', \'Helvetica\', Helvetica, Arial, sans-serif; color: #555; } .invoice-box table { width: 100%; line-height: inherit; text-align: left; } .invoice-box table td { padding: 5px; vertical-align: top; } .invoice-box table tr td:nth-child(2) { text-align: right; } .invoice-box table tr.top table td { padding-bottom: 20px; } .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; } .invoice-box table tr.information table td { padding-bottom: 40px; } .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; } .invoice-box table tr.details td { padding-bottom: 20px; } .invoice-box table tr.item td{ border-bottom: 1px solid #eee; } .invoice-box table tr.item.last td { border-bottom: none; } .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; } @media only screen and (max-width: 600px) { .invoice-box table tr.top table td { width: 100%; display: block; text-align: center; } .invoice-box table tr.information table td { width: 100%; display: block; text-align: center; } } /** RTL **/ .rtl { direction: rtl; font-family: Tahoma, \'Helvetica Neue\', \'Helvetica\', Helvetica, Arial, sans-serif; } .rtl table { text-align: right; } .rtl table tr td:nth-child(2) { text-align: left; } </style></head><body> <div class="invoice-box"> <table cellpadding="0" cellspacing="0"> <tr class="top"> <td colspan="2"> <table> <tr> <td> Mã hóa đơn: #' +
            order._id +
            "<br> Ngày tạo:" +
            Date.now() +
            '<br> </td> </tr> </table> </td> </tr> <tr class="information"> <td colspan="2"> <table> <tr> <td> Tiêu dân Seafood.<br> Số 1 Võ Văn Ngân<br> quận Thủ Đức, Tp. Hồ Chí Minh </td> <td> Nhóm 19.<br> Phạm Ngọc Diêu<br> ngocdieupham711@gmail.com </td> </tr> </table> </td> </tr> <tr class="heading"> <td> Phương thức thanh toán </td> <td> Phí vận chuyển </td> </tr> <tr class="details"> <td> ' +
            (order.paymentMethod ? "Tiền mặt" : "Chuyển khoản") +
            '</td> <td> 30.000 VNĐ </td> </tr> <tr class="heading"> <td> Vật phẩm </td> <td> Giá </td> </tr> <tr class="item">' +
            order.products.foreach(function(item) {
              return;
            }) +
            '<td> Website design </td> <td> $300.00 </td> </tr> <tr class="item"> <td> Hosting (3 months) </td> <td> $75.00 </td> </tr> <tr class="item last"> <td> Domain name (1 year) </td> <td> $10.00 </td> </tr> <tr class="total"> <td></td> <td> Tổng: $385.00 </td> </tr> </table> </div></body></html>'
        };

        for (let i in orderData) {
          order[i] = orderData[i];
        }
        order.save(function(err, updatedOrder) {
          if (err) return reject(err);
          resolve(updatedOrder);
        });

        transporter.sendMail(mailOptions, function(err, info) {
          if (err) console.log(err);
          else console.log(info);
        });
      });
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Order.find()
      .sort({ dateOrder: -1 })
      .populate("products.product")
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
