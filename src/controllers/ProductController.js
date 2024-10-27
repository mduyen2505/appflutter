// const json = require("body-parser/lib/types/json")
// const { status } = require("express/lib/response")
const ProductService = require('../services/ProductService') 

const createProduct = async (req, res) => {
    try {
        console.log('Request body received:', req.body);  // Log the request body

        const { name, productsTypeName, quantityInStock, prices, inches, screenResolution, imageUrl, bannerUrl, company, cpu, ram, memory, gpu, weight } = req.body;

        // Ensure all required fields are present
        if (!name || !productsTypeName || !quantityInStock || !prices || !inches || !screenResolution || !imageUrl || !bannerUrl || !company || !cpu || !ram || !memory || !gpu || !weight) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required',
            });
        }

        // If all fields are present, proceed with creating the product
        const response = await ProductService.createProduct(req.body);
        return res.status(201).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Something went wrong',
            error: e.message,
        });
    }
};




const updateProduct = async (req, res) => {
    try{
        const productId = req.params.id
        const data = req.body
        
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the productId is required '
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
    }
const deleteProduct = async (req, res) => {
    try{
        const productId = req.params.id  
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the userId is required '
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyProduct = async (req, res) => {
    try{
        const ids = req.body
        if(!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the ids is required '
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try{
        const {limit, page, sort, filter} = req.query
        const response = await ProductService.getAllProduct(Number(limit) || 8, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try{
        const productId = req.params.id  
        if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the productId is required '
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try{
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    deleteManyProduct,
    getAllProduct,
    getAllType
}