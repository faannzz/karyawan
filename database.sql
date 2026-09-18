CREATE DATABASE IF NOT EXISTS dashboard_karyawan DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;
USE dashboard_karyawan;
CREATE TABLE IF NOT EXISTS departemen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_departemen VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS jabatan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_jabatan VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS karyawan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  telepon VARCHAR(20),
  alamat TEXT,
  jabatan_id INT,
  departemen_id INT,
  tanggal_masuk DATE,
  status ENUM('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_karyawan_jabatan FOREIGN KEY (jabatan_id) REFERENCES jabatan(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_karyawan_departemen FOREIGN KEY (departemen_id) REFERENCES departemen(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT INTO departemen (nama_departemen) VALUES ('IT'), ('Finance'), ('Human Resources'), ('Marketing');
INSERT INTO jabatan (nama_jabatan) VALUES ('Staff'), ('Supervisor'), ('Manager'), ('Head Department');
INSERT INTO karyawan (nama, email, telepon, alamat, jabatan_id, departemen_id, tanggal_masuk, status) VALUES
('Andi Saputra', 'andi.saputra@mail.com', '081234567890', 'Jl. Merdeka No. 1, Padang', 3, 1, '2022-01-10', 'Aktif'),
('Siti Rahma', 'siti.rahma@mail.com', '081298765432', 'Jl. Sudirman No. 12, Padang', 1, 3, '2023-05-15', 'Aktif'),
('Budi Santoso', 'budi.santoso@mail.com', '081211122233', 'Jl. Diponegoro No. 5, Padang', 2, 2, '2021-11-01', 'Aktif'),
('Rina Wijaya', 'rina.wijaya@mail.com', '081355566677', 'Jl. Ahmad Yani No. 8, Padang', 4, 4, '2020-03-20', 'Nonaktif');
