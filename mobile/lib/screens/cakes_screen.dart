import 'package:flutter/material.dart';
import 'package:mobile_app/services/api_service.dart';

class CakesScreen extends StatefulWidget {
  @override
  _CakesScreenState createState() => _CakesScreenState();
}

class _CakesScreenState extends State<CakesScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _orders = [];

  @override
  void initState() {
    super.initState();
    _fetchCakes();
  }

  Future<void> _fetchCakes() async {
    try {
      final data = await _apiService.get('cake_orders');
      setState(() => _orders = data);
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Cake Orders')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: _orders.length,
        itemBuilder: (context, index) {
          final o = _orders[index];
          return Card(
            margin: EdgeInsets.only(bottom: 16),
            child: ListTile(
              title: Text(o['flavor'] ?? 'Cake Order'),
              subtitle: Text('Due: \${o['due_date']}\n\${o['design_notes'] ?? ''}'),
              trailing: Chip(label: Text(o['status'] ?? '')),
            ),
          );
        },
      ),
    );
  }
}
