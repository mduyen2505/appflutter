// const { status } = require('express/lib/response')
const Product = require('../models/ProductModel')
const bcrypt = require("bcrypt")


const createProduct = (newProduct) =>{
    return new Promise(async (resolve, reject) => {
        const {name, image, type, price, countInStock, rating, description} = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct != null){
                resolve({
                    status: 'Oke',
                    message: 'Name of product is already'
                })
            }
            const createdProduct = await Product.create({
                name, 
                image, 
                type, 
                price, 
                countInStock, 
                rating, 
                description
            })
            if(createdProduct){

                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    data: createdProduct
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

const updateProduct = (id, data) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id : id
            })
                if (checkProduct === null){
                    resolve({
                        status: 'Oke',
                        message: 'Product is not defined'
                    })
                }
                
                const updatedProduct = await Product.findByIdAndUpdate(id, data, { new : true})

                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    data: updatedProduct
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}

const deleteProduct = (id) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id : id
            })
                if (checkProduct === null){
                    resolve({
                        status: 'Oke',
                        message: 'Product is not defined'
                    })
                }
                
                await Product.findByIdAndDelete(id)
                resolve({
                    status: 'Oke',
                    massage: 'delete success'
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}

const getAllProduct = (limit = 8, page = 0) =>{
    return new Promise(async (resolve, reject) => {
        try {
                const totalProduct = await Product.countDocuments()
                const allProduct = await Product.find().limit(limit).skip(page * limit)
                resolve({
                    status: 'Oke',
                    massage: 'success',
                    data: allProduct,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
        
        }catch(e){
            reject(e)
        }
    })
}

const getDetailsProduct = (id) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id : id
            })
                if (product === null){
                    resolve({
                        status: 'Oke',
                        message: 'Product is not defined'
                    })
                }
                
                resolve({
                    status: 'Oke',
                    massage: 'success',
                    data: product
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}   