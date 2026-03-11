import 'package:flutter/material.dart';
import 'package:mobile_app/services/api_service.dart';

class DataProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<dynamic> _events = [];
  List<dynamic> _inventory = [];
  List<dynamic> _transactions = [];
  List<dynamic> _inquiries = [];

  List<dynamic> get events => _events;
  List<dynamic> get inventory => _inventory;
  List<dynamic> get transactions => _transactions;
  List<dynamic> get inquiries => _inquiries;

  Future<void> fetchDashboardStats() async {
    try {
      _events = await _apiService.get('events');
      _inventory = await _apiService.get('inventory_items');
      notifyListeners();
    } catch (e) {
      print("Error fetching stats: $e");
    }
  }

  Future<void> fetchEvents() async {
    try {
      _events = await _apiService.get('events');
      notifyListeners();
    } catch (e) {
      print("Error fetching events: $e");
    }
  }

  Future<void> fetchInventory() async {
    try {
      _inventory = await _apiService.get('inventory_items');
      notifyListeners();
    } catch (e) {
      print("Error fetching inventory: $e");
    }
  }

  Future<void> fetchBusinessData() async {
    try {
      _transactions = await _apiService.get('transactions');
      notifyListeners();
    } catch (e) {
      print("Error fetching business data: $e");
    }
  }

  Future<void> fetchMarketingData() async {
    try {
      _inquiries = await _apiService.get('inquiries');
      notifyListeners();
    } catch (e) {
      print("Error fetching marketing data: $e");
    }
  }
}
