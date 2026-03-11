import 'package:flutter/material.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    primaryColor: Color(0xFF1E40AF), // blue-800
    colorScheme: ColorScheme.light(
      primary: Color(0xFF2563EB), // blue-600
      secondary: Color(0xFF3B82F6), // blue-500
    ),
    scaffoldBackgroundColor: Color(0xFFF9FAFB), // gray-50
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Color(0xFF111827), // gray-900
      elevation: 1,
    ),
    cardTheme: CardTheme(
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: Color(0xFFE5E7EB)), // gray-200
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  );
}
