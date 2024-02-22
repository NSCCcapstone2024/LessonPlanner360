-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 04, 2017 at 03:29 AM
-- Server version: 5.6.35
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `tblcourses`
--

CREATE TABLE `tblCourses` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `course_code` varchar(200) NOT NULL,
  `course_name` varchar(200) NOT NULL,
  `year` year NOT NULL,
  `archived` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblCourses`
--
-- 
INSERT INTO `tblCourses` (`id`, `course_code`, `course_name`, `year`) VALUES
('1', 'WEBD3027', 'Developing for CMS', 2024),
('2', 'WEBD3000', 'Web Application Programming II', 2024),
('3', 'INFT3000', 'Capstone', 2024),
('4', 'INET2005', 'Web Application Programming I', 2024),
('5', 'INFT2100','Project Management', 2024);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;