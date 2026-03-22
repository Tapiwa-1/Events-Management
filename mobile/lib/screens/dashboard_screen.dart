import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/data_provider.dart';
import 'package:mobile_app/providers/auth_provider.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
      Provider.of<DataProvider>(context, listen: false).fetchDashboardStats());
  }

  @override
  Widget build(BuildContext context) {
    final data = Provider.of<DataProvider>(context);
    final user = Provider.of<AuthProvider>(context).user;

    return Scaffold(
      appBar: AppBar(title: Text('ERP Mobile')),
      drawer: Drawer(
        child: ListView(
          children: [
            UserAccountsDrawerHeader(
              accountName: Text(user?['full_name'] ?? ''),
              accountEmail: Text(user?['email'] ?? ''),
              currentAccountPicture: CircleAvatar(child: Text(user?['full_name']?[0] ?? '')),
            ),
            ListTile(title: Text('Dashboard'), leading: Icon(Icons.dashboard), onTap: () => Navigator.pop(context)),
            ListTile(title: Text('Events'), leading: Icon(Icons.event), onTap: () => Navigator.pushNamed(context, '/events')),
            ListTile(title: Text('Inventory'), leading: Icon(Icons.inventory), onTap: () => Navigator.pushNamed(context, '/inventory')),
            ListTile(title: Text('Business'), leading: Icon(Icons.business), onTap: () => Navigator.pushNamed(context, '/business')),
            ListTile(title: Text('Marketing'), leading: Icon(Icons.campaign), onTap: () => Navigator.pushNamed(context, '/marketing')),
            ListTile(title: Text('Logistics'), leading: Icon(Icons.local_shipping), onTap: () => Navigator.pushNamed(context, '/logistics')),
            ListTile(title: Text('Cakes'), leading: Icon(Icons.cake), onTap: () => Navigator.pushNamed(context, '/cakes')),
            ListTile(title: Text('Services'), leading: Icon(Icons.camera_alt), onTap: () => Navigator.pushNamed(context, '/services')),
            ListTile(title: Text('Logout'), leading: Icon(Icons.logout), onTap: () {
              Provider.of<AuthProvider>(context, listen: false).logout();
              Navigator.pushReplacementNamed(context, '/login');
            }),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Welcome back, \${user?['full_name']}", style: TextStyle(fontSize: 18, color: Colors.grey)),
            SizedBox(height: 24),
            Row(
              children: [
                _buildStatCard('Events', data.events.length.toString(), Colors.blue),
                SizedBox(width: 16),
                _buildStatCard('Inventory', data.inventory.length.toString(), Colors.green),
              ],
            ),
            SizedBox(height: 32),
            Text('Upcoming Events', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            ...data.events.take(5).map((e) => Card(
              child: ListTile(
                title: Text(e['name'] ?? ''),
                subtitle: Text(e['date'] ?? ''),
                trailing: Chip(label: Text(e['status'] ?? '')),
              ),
            )).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
            Text(title, style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
