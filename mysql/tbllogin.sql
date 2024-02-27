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
-- Table structure for table `tblLogin`
--

CREATE TABLE `tblLogin` (
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `salt` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
-- Dumping data for table `tblLogin`
--
-- password = ryan: secret, victoria: hello
INSERT INTO `tblLogin` (`username`, `password`, `salt`) VALUES
('ryan', '472fa2f9532d1d3f3ec1e48faf90cdc12b5892f17ec92d006cc9ea6e258af600', 'KUgMBBIZbPDsMiGUOc1UvQ=='),
('victoria', '999c0fada31e9b908b37eaa366e182cb1d9783d9d80824cdc1005a5e838ef5ee','5oyQOm8lAsCo4iqjtyYZcQ==');


