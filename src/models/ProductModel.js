const timespan = require("jsonwebtoken/lib/timespan");

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productsTypeName: { type: String, required: false },
    quantityInStock: { type: Number, required: false },
    prices: { type: Number, required: false },
    inches: { type: String, required: false },
    screenResolution: { type: String, required: false },
    company: { type: String, required: false },
    cpu: { type: String, required: false },
    ram: { type: String, required: false },
    memory: { type: String, required: false },
    gpu: { type: String, required: false },
    weight: { type: Number, required: false },
    imageUrl: { type: String, required: false },
    bannerUrl: { type: String, required: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
