import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/data_provider.dart';

class EventsScreen extends StatefulWidget {
  @override
  _EventsScreenState createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
      Provider.of<DataProvider>(context, listen: false).fetchEvents());
  }

  @override
  Widget build(BuildContext context) {
    final data = Provider.of<DataProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Events')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {}, // Not implemented for brevity
        child: Icon(Icons.add),
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: data.events.length,
        itemBuilder: (context, index) {
          final event = data.events[index];
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
                      Text(event['name'] ?? '', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Chip(label: Text(event['status'] ?? '')),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text('Date: \${event['date']}'),
                  Text('Location: \${event['location'] ?? 'N/A'}'),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
