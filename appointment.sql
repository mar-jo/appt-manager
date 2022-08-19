-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2022 at 12:04 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `username` varchar(128) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `location` varchar(128) DEFAULT NULL,
  `duration` int(5) DEFAULT NULL,
  `appointments` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `username`, `title`, `location`, `duration`, `appointments`, `description`, `start_date`) VALUES
(12, 'Testy', 'sdf sdf sdf', 'Vienna', 5, '18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35', 'testing things', '2022-05-14 14:16:32'),
(13, 'Marjo', 'Work', 'Vienna', 4, '18.02.2022, 10:00-11:35|18.02.2022, 10:00-11:30', 'ewr wer we rew t rfg d gdf gdf', '2022-05-14 14:17:07'),
(16, 'Bobby', 'Discord Hangout', 'Online', 24, '18.05.2022, 20:00-00:00|25.05.2022, 18:00-23:30|29.06.2022, 10:00-20:00|11.06.2022, 17:00-22:35|13.05.2022, 09:00-19:15|18.02.2022, 10:00-11:30', 'Hanging out with the team on discord for the evening', '2022-05-15 16:28:56'),
(17, 'Michi', 'Dunno', 'Vienna', 2, '18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35', 'Yep', '2022-05-15 16:34:35');

-- --------------------------------------------------------

--
-- Table structure for table `choicelog`
--

CREATE TABLE `choicelog` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `choice` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `choicelog`
--

INSERT INTO `choicelog` (`id`, `appointment_id`, `username`, `choice`) VALUES
(1, 12, 'awawa', '|18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35'),
(2, 1, 'sdfsd', '|18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35'),
(3, 1, 'uwu', '|18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35'),
(4, 12, 'aaaaa', '|18.02.2022, 10:00-11:35'),
(5, 14, 'ii', '|15.02.2022, 12:00-12:30|18.02.2022, 10:00-11:30'),
(6, 15, 'Mark', '|18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35'),
(16, 16, 'Bobbo', '|18.05.2022, 20:00-00:00|25.05.2022, 18:00-23:30|29.06.2022, 10:00-20:00|11.06.2022, 17:00-22:35|13.05.2022, 09:00-19:15|18.02.2022, 10:00-11:30'),
(17, 17, 'yyeyeye', '|18.02.2022, 10:00-11:30|18.02.2022, 10:00-11:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `choicelog`
--
ALTER TABLE `choicelog`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `choicelog`
--
ALTER TABLE `choicelog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
