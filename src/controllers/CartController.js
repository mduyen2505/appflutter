const CartService = require("../services/CartSevice");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
// Thêm hoặc cập nhật sản phẩm trong giỏ hàng của người dùng
const addOrUpdateProductInCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body; // Lấy userId, productId, và quantity từ req.body
        console.log('User ID:', userId);
        console.log('Product ID:', productId);
        console.log('Quantity:', quantity);
        console.log('Request Body:', req.body); // In ra req.body để kiểm tra

        // Kiểm tra xem productId đã được định nghĩa chưa
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Kiểm tra xem sản phẩm có tồn tại trong database không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Giỏ hàng tồn tại -> Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());

            if (productIndex > -1) {
                // Sản phẩm đã có -> cập nhật số lượng
                cart.products[productIndex].quantity = quantity;
            } else {
                // Sản phẩm chưa có -> thêm mới sản phẩm vào giỏ hàng
                cart.products.push({ productId, quantity });
            }
        } else {
            // Giỏ hàng không tồn tại -> tạo giỏ hàng mới với sản phẩm
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        }

        // Tính toán tổng giá trị giỏ hàng
        cart.totalPrice = await calculateTotalPrice(cart.products);

        // Lưu lại giỏ hàng
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        console.error('Error in addOrUpdateProductInCart:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Hàm để tính toán tổng giá trị giỏ hàng
const calculateTotalPrice = async (products) => {
    let total = 0;
    for (const product of products) {
        // Truy vấn lại sản phẩm từ cơ sở dữ liệu
        const productInDB = await Product.findById(product.productId);
        if (!productInDB) {
            console.error(`Product not found in DB for ID: ${product.productId}`);
            continue; // Nếu không tìm thấy sản phẩm, bỏ qua
        }
const productPrice = productInDB.prices; // Lấy giá sản phẩm từ cơ sở dữ liệu
        if (isNaN(productPrice) || productPrice < 0) {
            console.error(`Invalid price for product ID ${product.productId}:`, productPrice);
            continue; // Giữ nguyên tổng nếu giá sản phẩm không hợp lệ
        }

        total += productPrice * product.quantity; // Tính toán tổng
    }
    return total;
};

  
// Lấy giỏ hàng của người dùng theo userId
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra tính hợp lệ của userId
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "Yêu cầu userId"
      });
    }

    // Gọi dịch vụ lấy thông tin giỏ hàng theo userId
    const response = await CartService.getCartByUserId(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Đã xảy ra lỗi"
    });
  }
};


// Xóa một sản phẩm cụ thể khỏi giỏ hàng của người dùng
const removeProductFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    // Gọi dịch vụ xóa sản phẩm khỏi giỏ hàng theo userId và productId
    const response = await CartService.removeProductFromCart(userId, productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Đã xảy ra lỗi"
    });
  }
};

// Xóa toàn bộ giỏ hàng của một người dùng cụ thể
const deleteCart = async (req, res) => {
  const { userId } = req.params;
  try {
    // Gọi dịch vụ xóa toàn bộ giỏ hàng của người dùng theo userId
    const response = await CartService.deleteCart(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Đã xảy ra lỗi"
    });
  }
};

// Xuất các hàm để sử dụng trong các nơi khác trong ứng dụng
module.exports = {
  addOrUpdateProductInCart,
  getCartByUserId,
  removeProductFromCart,
  deleteCart
};