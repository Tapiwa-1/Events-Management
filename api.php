<?php
header("Content-Type: application/json");

// Simple API Key authentication
$api_key = "secret_mobile_api_key_2024";
$headers = getallheaders();
$auth_header = $headers['X-API-Key'] ?? $_SERVER['HTTP_X_API_KEY'] ?? null;

if ($auth_header !== $api_key) {
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$db_path = 'database.sqlite';
try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;
$table = $_GET['table'] ?? null;
$id = $_GET['id'] ?? null;

// Handle authentication action
if ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, str_replace('$2b$', '$2y$', $user['password_hash']))) {
        // Remove password hash from response
        unset($user['password_hash']);
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        header("HTTP/1.1 401 Unauthorized");
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
    exit;
}

if (!$table) {
    echo json_encode(['error' => 'Table name is required']);
    exit;
}

// Basic whitelist for tables
$allowed_tables = [
    'clients', 'events', 'inventory_items', 'inventory_bookings',
    'maintenance_logs', 'consumables_logs', 'photographers',
    'service_bookings', 'cake_orders', 'users', 'audit_logs',
    'expenses', 'transactions', 'loans', 'loan_repayments', 'inquiries'
];

if (!in_array($table, $allowed_tables)) {
    echo json_encode(['error' => 'Invalid table name']);
    exit;
}

// Function to validate column names
function isValidColumn($col) {
    return preg_match('/^[a-zA-Z0-9_]+$/', $col);
}

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch();
        } else {
            $query = "SELECT * FROM $table";
            $params = [];

            if ($table === 'users' && isset($_GET['email'])) {
                $query .= " WHERE email = ?";
                $params[] = $_GET['email'];
            }

            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $result = $stmt->fetchAll();
        }
        // Always unset password_hash for users table
        if ($table === 'users') {
            if ($id) {
                unset($result['password_hash']);
            } else {
                foreach ($result as &$row) {
                    unset($row['password_hash']);
                }
            }
        }
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            echo json_encode(['error' => 'No data provided']);
            exit;
        }

        // Handle password hashing on registration
        if ($table === 'users' && isset($data['password'])) {
            $data['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
            unset($data['password']);
        }

        $keys = array_keys($data);
        foreach ($keys as $key) {
            if (!isValidColumn($key)) {
                echo json_encode(['error' => 'Invalid column name: ' . $key]);
                exit;
            }
        }

        $fields = implode(', ', $keys);
        $placeholders = implode(', ', array_fill(0, count($keys), '?'));

        $stmt = $pdo->prepare("INSERT INTO $table ($fields) VALUES ($placeholders)");
        try {
            $stmt->execute(array_values($data));
            echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Record created successfully']);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Data insertion failed: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!$id) {
            echo json_encode(['error' => 'ID is required for update']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            echo json_encode(['error' => 'No data provided']);
            exit;
        }

        $fields = "";
        $params = [];
        foreach ($data as $key => $value) {
            if (!isValidColumn($key)) {
                echo json_encode(['error' => 'Invalid column name: ' . $key]);
                exit;
            }
            $fields .= "$key = ?, ";
            $params[] = $value;
        }
        $fields = rtrim($fields, ', ');
        $params[] = $id;

        $stmt = $pdo->prepare("UPDATE $table SET $fields WHERE id = ?");
        try {
            $stmt->execute($params);
            echo json_encode(['message' => 'Record updated successfully']);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Update failed']);
        }
        break;

    case 'DELETE':
        if (!$id) {
            echo json_encode(['error' => 'ID is required for deletion']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Record deleted successfully']);
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}
