<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');
$entity = $_GET['entity'] ?? '';
$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
if ($entity === 'departemen') {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("SELECT * FROM departemen ORDER BY id DESC");
            respond(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
        case 'create':
            if (empty($input['nama_departemen'])) respond(['success' => false, 'message' => 'Nama departemen wajib diisi'], 400);
            $stmt = $pdo->prepare("INSERT INTO departemen (nama_departemen) VALUES (?)");
            $stmt->execute([$input['nama_departemen']]);
            respond(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
        case 'update':
            if (empty($input['id']) || empty($input['nama_departemen'])) respond(['success' => false, 'message' => 'Data tidak lengkap'], 400);
            $stmt = $pdo->prepare("UPDATE departemen SET nama_departemen = ? WHERE id = ?");
            $stmt->execute([$input['nama_departemen'], $input['id']]);
            respond(['success' => true]);
            break;
        case 'delete':
            $id = $_GET['id'] ?? ($input['id'] ?? null);
            if (!$id) respond(['success' => false, 'message' => 'ID wajib diisi'], 400);
            $stmt = $pdo->prepare("DELETE FROM departemen WHERE id = ?");
            $stmt->execute([$id]);
            respond(['success' => true]);
            break;
        default:
            respond(['success' => false, 'message' => 'Action tidak dikenali'], 400);
    }
}
if ($entity === 'jabatan') {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("SELECT * FROM jabatan ORDER BY id DESC");
            respond(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
        case 'create':
            if (empty($input['nama_jabatan'])) respond(['success' => false, 'message' => 'Nama jabatan wajib diisi'], 400);
            $stmt = $pdo->prepare("INSERT INTO jabatan (nama_jabatan) VALUES (?)");
            $stmt->execute([$input['nama_jabatan']]);
            respond(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
        case 'update':
            if (empty($input['id']) || empty($input['nama_jabatan'])) respond(['success' => false, 'message' => 'Data tidak lengkap'], 400);
            $stmt = $pdo->prepare("UPDATE jabatan SET nama_jabatan = ? WHERE id = ?");
            $stmt->execute([$input['nama_jabatan'], $input['id']]);
            respond(['success' => true]);
            break;
        case 'delete':
            $id = $_GET['id'] ?? ($input['id'] ?? null);
            if (!$id) respond(['success' => false, 'message' => 'ID wajib diisi'], 400);
            $stmt = $pdo->prepare("DELETE FROM jabatan WHERE id = ?");
            $stmt->execute([$id]);
            respond(['success' => true]);
            break;
        default:
            respond(['success' => false, 'message' => 'Action tidak dikenali'], 400);
    }
}
if ($entity === 'karyawan') {
    switch ($action) {
        case 'list':
            $sql = "SELECT k.*, j.nama_jabatan, d.nama_departemen FROM karyawan k LEFT JOIN jabatan j ON k.jabatan_id = j.id LEFT JOIN departemen d ON k.departemen_id = d.id ORDER BY k.id DESC";
            $stmt = $pdo->query($sql);
            respond(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
        case 'create':
            if (empty($input['nama'])) respond(['success' => false, 'message' => 'Nama karyawan wajib diisi'], 400);
            $stmt = $pdo->prepare("INSERT INTO karyawan (nama, email, telepon, alamat, jabatan_id, departemen_id, tanggal_masuk, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['nama'],
                $input['email'] ?? null,
                $input['telepon'] ?? null,
                $input['alamat'] ?? null,
                $input['jabatan_id'] ?: null,
                $input['departemen_id'] ?: null,
                $input['tanggal_masuk'] ?: null,
                $input['status'] ?? 'Aktif',
            ]);
            respond(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
        case 'update':
            if (empty($input['id']) || empty($input['nama'])) respond(['success' => false, 'message' => 'Data tidak lengkap'], 400);
            $stmt = $pdo->prepare("UPDATE karyawan SET nama = ?, email = ?, telepon = ?, alamat = ?, jabatan_id = ?, departemen_id = ?, tanggal_masuk = ?, status = ? WHERE id = ?");
            $stmt->execute([
                $input['nama'],
                $input['email'] ?? null,
                $input['telepon'] ?? null,
                $input['alamat'] ?? null,
                $input['jabatan_id'] ?: null,
                $input['departemen_id'] ?: null,
                $input['tanggal_masuk'] ?: null,
                $input['status'] ?? 'Aktif',
                $input['id'],
            ]);
            respond(['success' => true]);
            break;
        case 'delete':
            $id = $_GET['id'] ?? ($input['id'] ?? null);
            if (!$id) respond(['success' => false, 'message' => 'ID wajib diisi'], 400);
            $stmt = $pdo->prepare("DELETE FROM karyawan WHERE id = ?");
            $stmt->execute([$id]);
            respond(['success' => true]);
            break;
        default:
            respond(['success' => false, 'message' => 'Action tidak dikenali'], 400);
    }
}
respond(['success' => false, 'message' => 'Entity tidak dikenali'], 400);
