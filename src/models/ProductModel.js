const timespan = require("jsonwebtoken/lib/timespan");

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    productsTypeName: { type: String},
    quantityInStock: { type: Number},
    prices: { type: Number, required: true},
    inches: { type: Number},
    screenResolution: { type: String},
    imageUrl: { type: String, required: true },
    bannerUrl: { type: String},
    company: { type: String, required: true },
    cpu: { type: String},
    ram: { type: String},
    memory: { type: String},  
    gpu: { type: String},
    weight: { type: Number}
}, 
    { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

