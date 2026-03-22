import 'package:flutter/material.dart';
import 'package:mobile_app/services/api_service.dart';

class AuthProvider with ChangeNotifier {
  Map<String, dynamic>? _user;
  String? _token;
  final ApiService _apiService = ApiService();

  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiService.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response['token'] != null) {
        _token = response['token'];
        _user = response['user'];
        _apiService.setToken(_token);
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
      await _apiService.post('/auth/register', {
        'full_name': fullName,
        'email': email,
        'password': password,
      });
      return true;
    } catch (e) {
      print("Registration error: $e");
    }
    return false;
  }

  void logout() {
    _user = null;
    _token = null;
    _apiService.setToken(null);
    notifyListeners();
  }
}
