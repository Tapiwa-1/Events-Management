import 'package:flutter/material.dart';
import 'package:mobile_app/services/api_service.dart';

class LogisticsScreen extends StatefulWidget {
  @override
  _LogisticsScreenState createState() => _LogisticsScreenState();
}

class _LogisticsScreenState extends State<LogisticsScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _bookings = [];

  @override
  void initState() {
    super.initState();
    _fetchLogistics();
  }

  Future<void> _fetchLogistics() async {
    try {
      final data = await _apiService.get('/logistics');
      setState(() => _bookings = data);
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Logistics')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: _bookings.length,
        itemBuilder: (context, index) {
          final b = _bookings[index];
          return Card(
            margin: EdgeInsets.only(bottom: 16),
            child: ListTile(
              title: Text("Item ID: ${b['item_id']}"),
              subtitle: Text("Event ID: ${b['event_id']}\nTime: ${b['start_time']} - ${b['end_time']}"),
              trailing: Chip(label: Text(b['status'] ?? '')),
            ),
          );
        },
      ),
    );
  }
}
