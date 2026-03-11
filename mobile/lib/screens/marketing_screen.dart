import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/data_provider.dart';

class MarketingScreen extends StatefulWidget {
  @override
  _MarketingScreenState createState() => _MarketingScreenState();
}

class _MarketingScreenState extends State<MarketingScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
      Provider.of<DataProvider>(context, listen: false).fetchMarketingData());
  }

  @override
  Widget build(BuildContext context) {
    final data = Provider.of<DataProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Marketing')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: data.inquiries.length,
        itemBuilder: (context, index) {
          final inquiry = data.inquiries[index];
          return Card(
            margin: EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(inquiry['name'] ?? '', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Chip(label: Text(inquiry['status'] ?? '')),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(inquiry['message'] ?? '', style: TextStyle(color: Colors.grey[700])),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(inquiry['phone'] ?? '', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text(inquiry['date'] ?? '', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
