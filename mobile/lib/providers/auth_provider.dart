import 'package:flutter/material.dart';
import 'package:mobile_app/services/api_service.dart';

class AuthProvider with ChangeNotifier {
  Map<String, dynamic>? _user;
  final ApiService _apiService = ApiService();

  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiService.postAction('login', {
        'email': email,
        'password': password,
      });

      if (response['success'] == true) {
        _user = response['user'];
        notifyListeners();
        return true;
      }
    } catch (e) {
      print("Login error: $e");
    }
    return false;
  }

  Future<bool> register(String fullName, String email, String password) async {
    try {
      final data = {
        'full_name': fullName,
        'email': email,
        'password': password, // api.php now handles hashing
        'role': 'customer',
        'is_active': 1,
      };
      await _apiService.post('users', data);
      return true;
    } catch (e) {
      print("Registration error: $e");
    }
    return false;
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
