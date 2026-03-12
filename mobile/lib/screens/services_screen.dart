import 'package:flutter/material.dart';
import 'package:mobile_app/services/api_service.dart';

class ServicesScreen extends StatefulWidget {
  @override
  _ServicesScreenState createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _bookings = [];

  @override
  void initState() {
    super.initState();
    _fetchServices();
  }

  Future<void> _fetchServices() async {
    try {
      final data = await _apiService.get('/services');
      setState(() => _bookings = data);
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Service Bookings')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: _bookings.length,
        itemBuilder: (context, index) {
          final b = _bookings[index];
          return Card(
            margin: EdgeInsets.only(bottom: 16),
            child: ListTile(
              title: Text("Photographer ID: ${b['photographer_id']}"),
              subtitle: Text("Time: ${b['start_time']} - ${b['end_time']}\nPost-Prod: ${b['post_prod_status']}"),
              trailing: Chip(label: Text(b['status'] ?? '')),
            ),
          );
        },
      ),
    );
  }
}
