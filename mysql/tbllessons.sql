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



--
-- Table structure for table `tblLessons`
--

CREATE TABLE `tblLessons` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `course_id` int(8) NOT NULL,
  `unit_number` int(8) NOT NULL,
  `week` int(8) NOT NULL,
  `class_ID` varchar(5),
  `learning_outcomes` text,
  `enabling_outcomes` text,
  `material` varchar(200),
  `assessment` text,
  `notes` text,
  `completion` TINYINT(1) DEFAULT 0,
  `status` ENUM('prepped', 'completed', 'neither') NOT NULL DEFAULT 'neither',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`course_id`) REFERENCES `tblCourses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblLessons`
--
-- 
INSERT INTO `tblLessons` (`id`, `course_id`, `unit_number`, `week`, `class_ID`, `learning_outcomes`,`enabling_outcomes`, `material`,`assessment`,`notes`,`completion`,`status`) VALUES
('1', '1', '1', '1','1-1','Course Outline/Review','Setting up dev environment, VSCode setup','','Challenge','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed pulvinar enim. Sed purus sapien, tincidunt in risus id, volutpat congue elit. Maecenas in eleifend metus. Vivamus nec dictum sem. ',0,'prepped'),
('2', '1', '1', '2','1-2','Hello world program','Includes, Requires, putting functions in one file','','Challenge',' Nullam id faucibus lacus, eu suscipit velit.',1,'completed'),
('3', '1', '2', '2','2-1','Forms & Form Validation','Diffrent validation methods, form fill','','Project','Fusce pulvinar lacus tortor, quis sodales leo dapibus ac. Proin mattis ultrices neque, et vestibulum est mattis id. Fusce sodales sodales augue tincidunt elementum. Fusce nibh ipsum, consequat ut facilisis sit amet, tincidunt vel eros. ',2, 'neither'),
('4', '2', '1', '1','1-1','Course Outline/Review','Introduction to basics','','Challenge',' Vestibulum ornare dui ipsum, non ornare urna dictum nec. Maecenas efficitur, nunc at euismod molestie, sapien enim tincidunt eros, ac vulputate lacus felis at odio.',0, 'prepped'),
('5', '2', '2', '2','1-2','Hello all program','Creating first program','','Challenge','Vestibulum in turpis laoreet, lobortis purus bibendum, tristique lectus.',1, 'completed');


