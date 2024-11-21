import 'dart:convert';
import 'package:http/http.dart' as http;
import 'checkout_model.dart';
import 'package:HDTech/models/config.dart';

class CheckoutService {
  // Fetch cart details using userId (for checkout)
  static Future<CheckoutDetails> getCheckoutDetails(String userId) async {
    final url = Uri.parse('${Config.baseUrl}/cart/get-cart/$userId');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Trả về CheckoutDetails thay vì List<CartItem>
      return CheckoutDetails.fromJson(data);
    } else {
      throw Exception("Failed to load cart details");
    }
  }
}
