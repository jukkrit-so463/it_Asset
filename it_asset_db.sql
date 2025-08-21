-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2025 at 05:12 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `it_asset_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `device_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT 'FK อ้างอิงถึงผู้ใช้ที่รับผิดชอบอุปกรณ์นี้ (NULL ถ้ายังไม่มีผู้รับผิดชอบ)',
  `locations_id` int(11) DEFAULT NULL COMMENT 'FK อ้างอิงถึงสถานที่ที่อุปกรณ์ติดตั้งอยู่',
  `device_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ประเภทอุปกรณ์ (เช่น PC, Notebook, Printer)',
  `service_tag` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Service Tag หรือ Serial Number',
  `date_received` date DEFAULT NULL COMMENT 'ปีที่รับอุปกรณ์',
  `operational_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'สถานะใช้งาน (เช่น active, in_repair, decommissioned)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ip_addresses`
--

CREATE TABLE `ip_addresses` (
  `ip_id` int(11) NOT NULL,
  `device_id` int(11) DEFAULT NULL COMMENT 'FK อ้างอิงถึงอุปกรณ์ที่ใช้ IP นี้ (NULL ถ้ายังไม่ถูกใช้งาน)',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'เก็บได้ทั้ง IPv4 และ IPv6',
  `network_level` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ระดับของ Network เช่น 55,56,57,58,59',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available' COMMENT 'สถานะ (available, in_use)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `locations_id` int(11) NOT NULL,
  `division` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ฝ่าย',
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'แผนก',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'สถานะ (active, inactive)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `locations_id` int(11) DEFAULT NULL COMMENT 'FK อ้างอิงถึงสถานที่หลักของผู้ใช้',
  `rank` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ยศ',
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อ',
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'สกุล',
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ควรเก็บรหัสผ่านที่เข้ารหัสแล้ว (Hashed Password)',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT 'สิทธิ์การใช้งาน',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'สถานะ (active, inactive, suspended)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`device_id`),
  ADD UNIQUE KEY `service_tag` (`service_tag`),
  ADD KEY `fk_devices_users` (`user_id`),
  ADD KEY `fk_devices_locations` (`locations_id`);

--
-- Indexes for table `ip_addresses`
--
ALTER TABLE `ip_addresses`
  ADD PRIMARY KEY (`ip_id`),
  ADD UNIQUE KEY `ip_address` (`ip_address`),
  ADD KEY `fk_ip_devices` (`device_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`locations_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_locations` (`locations_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ip_addresses`
--
ALTER TABLE `ip_addresses`
  MODIFY `ip_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `locations_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `fk_devices_locations` FOREIGN KEY (`locations_id`) REFERENCES `locations` (`locations_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_devices_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ip_addresses`
--
ALTER TABLE `ip_addresses`
  ADD CONSTRAINT `fk_ip_devices` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_locations` FOREIGN KEY (`locations_id`) REFERENCES `locations` (`locations_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
