const timespan = require("jsonwebtoken/lib/timespan");

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    productsTypeName: { type: String, required: true },
    quantityInStock: { type: Number, required: true },
    prices: { type: Number, required: true },
    inches: { type: Number, required: true },
    screenResolution: { type: String, required: true },
    imageUrl: { type: String, required: true },
    bannerUrl: { type: String, required: true },
    company: { type: String, required: true },
    cpu: { type: String, required: true },
    ram: { type: String, required: true },
    memory: { type: String, required: true },  
    gpu: { type: String, required: true },
    weight: { type: Number, required: true }
}, 
    { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

