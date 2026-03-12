import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/data_provider.dart';

class InventoryScreen extends StatefulWidget {
  @override
  _InventoryScreenState createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
      Provider.of<DataProvider>(context, listen: false).fetchInventory());
  }

  @override
  Widget build(BuildContext context) {
    final data = Provider.of<DataProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Inventory')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: data.inventory.length,
        itemBuilder: (context, index) {
          final item = data.inventory[index];
          return Card(
            margin: EdgeInsets.only(bottom: 16),
            child: ListTile(
              title: Text(item['name'] ?? ''),
              subtitle: Text("Qty: ${item['total_quantity']} • ${item['condition']}"),
              trailing: Icon(Icons.edit),
              onTap: () {}, // Not implemented for brevity
            ),
          );
        },
      ),
    );
  }
}
