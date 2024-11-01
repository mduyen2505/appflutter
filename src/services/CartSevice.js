const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const addOrUpdateProductInCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body; // Lấy userId, productId, và quantity từ req.body
        console.log('User ID:', userId);
        console.log('Product ID:', productId);
        console.log('Quantity:', quantity);
        
        // In ra req.body để kiểm tra
        console.log('Request Body:', req.body); // Kiểm tra giá trị của req.body

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
                cart.products.push({ productId, quantity }); // Chỉ lưu productId và quantity
            }
        } else {
            // Giỏ hàng không tồn tại -> tạo giỏ hàng mới với sản phẩm
            cart = new Cart({
                userId,
                products: [{ productId, quantity }] // Chỉ lưu productId và quantity
            });
        }

        // Tính toán tổng giá trị giỏ hàng
        cart.totalPrice = cart.products.reduce((total, product) => {
            // Tìm sản phẩm trong cơ sở dữ liệu
            const productInDB = product.productId.toString() === productId.toString() ? product : null;
            const productPrice = productInDB ? productInDB.prices : 0; // Đảm bảo giá sản phẩm đúng

            if (isNaN(productPrice) || productPrice < 0) {
                console.error(`Invalid prices for product ID ${product.productId}:`, productPrice);
                return total; // Giữ nguyên tổng giá trị nếu giá sản phẩm không hợp lệ
            }

            return total + productPrice * product.quantity; // Tính toán tổng
        }, 0);

        // Lưu lại giỏ hàng
        await cart.save();

        // Chuyển đổi thành đối tượng thông thường và xóa trường _id
        const response = cart.toObject(); // Chuyển đổi thành đối tượng thông thường
response.products = response.products.map(product => {
            const { _id, ...rest } = product; // Tách _id và giữ lại các trường còn lại
            return rest; // Trả về đối tượng không có _id
        });

        // Trả về phản hồi mà không có trường _id ở mức sản phẩm
        res.status(200).json(response);

    } catch (error) {
        console.error('Error in addOrUpdateProductInCart:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

  // Lấy giỏ hàng của người dùng theo userId
  const getCartByUserId = async (userId) => {
    try {
      const cart = await Cart.findOne({ userId }).populate("products.productId", "name prices ");
      if (!cart) {
        throw new Error("Không tìm thấy giỏ hàng");
      }
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  
  // Xóa sản phẩm khỏi giỏ hàng
  const removeProductFromCart = async (userId, productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Retrieve the user's cart
            const cart = await Cart.findOne({ userId }).populate("products.productId", "name prices");
            console.log(cart);
            if (!cart) {
                return resolve({
                    status: 'ERR',
                    message: 'Cart not found',
                });
            }

            // Log the current cart products for debugging
            console.log('Current Cart Products:', cart.products);

            // Check if the product exists in the cart
            const productExists = cart.products.some(p => p.productId._id.toString() === productId);
            if (!productExists) {
                return resolve({
                    status: 'ERR',
                    message: 'Product not found in cart',
                });
            }

            // Remove the product from the cart
            cart.products = cart.products.filter(p => p.productId._id.toString() !== productId);

            // Update the total price
            cart.totalPrice = cart.products.reduce((total, product) => {
                const prices = product.productId.prices || 0; // Ensure prices is accessed correctly
                return total + (prices * product.quantity);
            }, 0);

            // Save the updated cart
            await cart.save();
            resolve({
                status: 'OK',
                message: 'Product removed from cart',
                data: cart
            });
        } catch (e) {
            console.error('Error removing product from cart:', e);
            reject({
                status: 'ERR',
                message: 'Error removing product from cart',
                error: e.message // Return the error message for better debugging
            });
        }
    });
};
// Xóa toàn bộ giỏ hàng của người dùng
  const deleteCart = async (userId) => {
    try {
      const cart = await Cart.findOneAndDelete({ userId }).populate("products.productId", "name prices");
      if (!cart) {
        throw new Error("Không tìm thấy giỏ hàng để xóa");
      }
      return { message: "Giỏ hàng đã được xóa thành công" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // Xuất các hàm để sử dụng trong controller
  module.exports = {
    addOrUpdateProductInCart,
    getCartByUserId,
    removeProductFromCart,
    deleteCart
  };