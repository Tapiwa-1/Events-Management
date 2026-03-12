import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/data_provider.dart';

class BusinessScreen extends StatefulWidget {
  @override
  _BusinessScreenState createState() => _BusinessScreenState();
}

class _BusinessScreenState extends State<BusinessScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
      Provider.of<DataProvider>(context, listen: false).fetchBusinessData());
  }

  @override
  Widget build(BuildContext context) {
    final data = Provider.of<DataProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Business')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: data.transactions.length,
        itemBuilder: (context, index) {
          final tx = data.transactions[index];
          final isIncome = tx['type'] == 'in';
          return Card(
            margin: EdgeInsets.only(bottom: 16),
            child: ListTile(
              title: Text(tx['description'] ?? ''),
              subtitle: Text("${tx['date']} • ${tx['category']}"),
              trailing: Text(
                "${isIncome ? '+' : '-'}${tx['amount']}",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isIncome ? Colors.green : Colors.red,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
