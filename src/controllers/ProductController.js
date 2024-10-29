const ProductService = require("../services/ProductService");
const upload = require("../middleware/uploadImage");
const createProduct = async (req, res) => {
  upload.fields([{ name: "imageFile" }, { name: "bannerFile" }])(
    req,
    res,
    async (err) => {
      if (err) {
        return res.status(500).json({
          status: "ERR",
          message: "File upload failed",
          error: err.message
        });
      }

      try {
        const {
          name,
          productsTypeName,
          quantityInStock,
          prices,
          inches,
          screenResolution,
          company,
          cpu,
          ram,
          memory,
          gpu,
          weight
        } = req.body;

        if (
          !name ||
          !productsTypeName ||
          !quantityInStock ||
          !prices ||
          !inches ||
          !screenResolution ||
          !company ||
          !cpu ||
          !ram ||
          !memory ||
          !gpu ||
          !weight
        ) {
          return res.status(400).json({
            status: "ERR",
            message: "The input is required"
          });
        }

        const imageUrl = req.files["imageFile"]
          ? req.files["imageFile"][0].path
          : null;
        const bannerUrl = req.files["bannerFile"]
          ? req.files["bannerFile"][0].path
          : null;

        const productData = {
          name,
          productsTypeName,
          quantityInStock,
          prices,
          inches,
          screenResolution,
          imageUrl,
          bannerUrl,
          company,
          cpu,
          ram,
          memory,
          gpu,
          weight
        };

        const response = await ProductService.createProduct(productData);

        return res.status(201).json({
          status: "OK",
          message: "Product created successfully",
          data: response
        });
      } catch (e) {
        return res.status(500).json({
          status: "ERR",
          message: "Something went wrong",
          error: e.message
        });
      }
    }
  );
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the productId is required "
      });
    }
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the userId is required "
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "the ids is required "
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "An error occurred while fetching products.",
      error: error.message
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the productId is required "
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
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
