const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, quantityInStock, prices, imageUrl, bannerUrl } = newProduct;
    try {
      const checkProduct = await Product.findOne({ name });
      if (checkProduct) {
        return reject({
          status: "ERR",
          message: "Product with this name already exists"
        });
      }

      const createdProduct = await Product.create({
        name,
        quantityInStock,
        prices,
        imageUrl,
        bannerUrl
      });
      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Product created successfully",
          data: createdProduct
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: "Failed to create product",
        error: e.message
      });
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id);
      if (!checkProduct) {
        return resolve({
          status: "ERR",
          message: "Product not found"
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true
      });

      resolve({
        status: "OK",
        message: "Product updated successfully",
        data: updatedProduct
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error updating product",
        error: e.message
      });
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id
      });
      if (checkProduct === null) {
        resolve({
          status: "Oke",
          message: "Product is not defined"
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "Oke",
        massage: "delete success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "Oke",
        massage: "delete many success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = async (sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
      if (filter) {
        const label = filter[0];
        query[label] = { $regex: filter[1], $options: "i" };
      }

      const allProducts = await Product.find(query).sort(sort ? sort : {});

      // Không cần kiểm tra với fs.existsSync() nếu bạn đang sử dụng URL từ Firebase
      const formattedProducts = allProducts.map((product) => {
        return {
          ...product.toObject(),
          imageUrl: product.imageUrl || null, // Chỉ cần lấy URL từ MongoDB
          bannerUrl: product.bannerUrl || null
        };
      });

      resolve({
        status: "OK",
        message: "success",
        data: formattedProducts,
        total: formattedProducts.length
      });
    } catch (e) {
      reject(e);
    }
  });
};

const convertToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const base64Image = `data:image/jpeg;base64,${data.toString("base64")}`;
        resolve(base64Image);
      }
    });
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id
      });
      if (product === null) {
        resolve({
          status: "Oke",
          message: "Product is not defined"
        });
      }

      resolve({
        status: "Oke",
        massage: "success",
        data: product
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "Oke",
        massage: "success",
        data: allType
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllType
};
