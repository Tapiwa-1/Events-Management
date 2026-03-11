import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile_app/secrets.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator, 127.0.0.1 for Web/iOS
  static const String baseUrl = "http://127.0.0.1:8080/api.php";
  static const String apiKey = Secrets.apiKey;

  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  };

  Future<dynamic> get(String table, {Map<String, String>? params}) async {
    var url = Uri.parse(baseUrl).replace(queryParameters: {
      'table': table,
      ...?(params),
    });

    final response = await http.get(url, headers: headers);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load data: \${response.statusCode}');
    }
  }

  Future<dynamic> post(String table, Map<String, dynamic> data) async {
    var url = Uri.parse('\$baseUrl?table=\$table');
    final response = await http.post(
      url,
      headers: headers,
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to post data: \${response.statusCode}');
    }
  }

  Future<dynamic> postAction(String action, Map<String, dynamic> data) async {
    var url = Uri.parse('\$baseUrl?action=\$action');
    final response = await http.post(
      url,
      headers: headers,
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Action failed: \${response.statusCode}');
    }
  }

  Future<dynamic> put(String table, String id, Map<String, dynamic> data) async {
    var url = Uri.parse('\$baseUrl?table=\$table&id=\$id');
    final response = await http.put(
      url,
      headers: headers,
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update data: \${response.statusCode}');
    }
  }

  Future<dynamic> delete(String table, String id) async {
    var url = Uri.parse('\$baseUrl?table=\$table&id=\$id');
    final response = await http.delete(url, headers: headers);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to delete data: \${response.statusCode}');
    }
  }
}
