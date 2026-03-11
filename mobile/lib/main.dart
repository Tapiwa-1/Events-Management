import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/auth_provider.dart';
import 'package:mobile_app/providers/data_provider.dart';
import 'package:mobile_app/screens/dashboard_screen.dart';
import 'package:mobile_app/screens/login_screen.dart';
import 'package:mobile_app/screens/register_screen.dart';
import 'package:mobile_app/screens/events_screen.dart';
import 'package:mobile_app/screens/inventory_screen.dart';
import 'package:mobile_app/screens/business_screen.dart';
import 'package:mobile_app/screens/marketing_screen.dart';
import 'package:mobile_app/screens/logistics_screen.dart';
import 'package:mobile_app/screens/cakes_screen.dart';
import 'package:mobile_app/screens/services_screen.dart';
import 'package:mobile_app/theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DataProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ERP Mobile',
      theme: AppTheme.lightTheme,
      initialRoute: '/login',
      routes: {
        '/': (context) => _ProtectedRoute(child: DashboardScreen()),
        '/login': (context) => LoginScreen(),
        '/register': (context) => RegisterScreen(),
        '/events': (context) => _ProtectedRoute(child: EventsScreen()),
        '/inventory': (context) => _ProtectedRoute(child: InventoryScreen()),
        '/business': (context) => _ProtectedRoute(child: BusinessScreen()),
        '/marketing': (context) => _ProtectedRoute(child: MarketingScreen()),
        '/logistics': (context) => _ProtectedRoute(child: LogisticsScreen()),
        '/cakes': (context) => _ProtectedRoute(child: CakesScreen()),
        '/services': (context) => _ProtectedRoute(child: ServicesScreen()),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

class _ProtectedRoute extends StatelessWidget {
  final Widget child;
  _ProtectedRoute({required this.child});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    if (!auth.isAuthenticated) {
      return LoginScreen();
    }
    return child;
  }
}
