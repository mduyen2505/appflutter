const mongoose = require("mongoose");
const Product = require("./ProductModel");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true, min: 1 },
        prices: { type: Number, required: true }
      }
    ],
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.products.reduce((total, product) => {
    return total + product.prices * product.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
