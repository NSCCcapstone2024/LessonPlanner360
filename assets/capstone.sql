-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `tblCourses`;
CREATE TABLE `tblCourses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_code` varchar(200) NOT NULL,
  `course_name` varchar(200) NOT NULL,
  `year` year NOT NULL,
  `archived` tinyint(1) DEFAULT '0',
  `archived_year` year DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `tblCourses` (`id`, `course_code`, `course_name`, `year`, `archived`, `archived_year`) VALUES
(1,	'WEBD3022',	'Developing for CMS',	'2024',	0,	NULL),
(2,	'WEBD3000',	'Web Application Programming II',	'2022',	0,	NULL),
(3,	'INFT3000',	'Capstone',	'2024',	0,	NULL),
(4,	'INET2005',	'Web Application Programming I',	'2024',	0,	NULL),
(5,	'INFT2100',	'Project Management',	'2024',	0,	NULL),
(6,	'WEBD3000',	'Web Application Programming II ',	'2024',	0,	NULL),
(7,	'WEBD3022',	'Developing for CMS',	'2024',	0,	NULL);

DROP TABLE IF EXISTS `tblLessons`;
CREATE TABLE `tblLessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `unit_number` int NOT NULL,
  `week` int NOT NULL,
  `class_ID` varchar(5) DEFAULT NULL,
  `learning_outcomes` text,
  `enabling_outcomes` text,
  `material` varchar(200) DEFAULT NULL,
  `assessment` text,
  `notes` text,
  `completion` tinyint(1) DEFAULT '0',
  `status` enum('prepped','completed','neither') NOT NULL DEFAULT 'neither',
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `tblLessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `tblCourses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `tblLessons` (`id`, `course_id`, `unit_number`, `week`, `class_ID`, `learning_outcomes`, `enabling_outcomes`, `material`, `assessment`, `notes`, `completion`, `status`) VALUES
(1,	1,	1,	1,	'1-1',	'Course Outline/Review',	'Setting up dev environment, VSCode setup',	'',	'Challenge',	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed pulvinar enim. Sed purus sapien, tincidunt in risus id, volutpat congue elit. Maecenas in eleifend metus. Vivamus nec dictum sem. ',	0,	'prepped'),
(2,	1,	1,	14,	'1-2',	'Hello world program',	'Includes, Requires, putting functions in one file',	'',	'Challenge',	' Nullam id faucibus lacus, eu suscipit velit.',	1,	'prepped'),
(4,	2,	1,	1,	'1-1',	'Course Outline/Review',	'Introduction to basics',	'',	'Challenge',	' Vestibulum ornare dui ipsum, non ornare urna dictum nec. Maecenas efficitur, nunc at euismod molestie, sapien enim tincidunt eros, ac vulputate lacus felis at odio.',	0,	'prepped'),
(5,	2,	2,	2,	'1-2',	'Hello all program',	'Creating first program',	'',	'Challenge',	'Vestibulum in turpis laoreet, lobortis purus bibendum, tristique lectus.',	1,	'completed'),
(6,	1,	1,	1,	'1-2',	'TEST',	'TEST',	'',	'TEST',	'TEST',	0,	'neither'),
(7,	1,	2,	2,	'1-1',	'',	'',	'',	'',	'',	0,	'neither'),
(8,	1,	1,	5,	'2-0',	'',	'',	'',	'',	'',	0,	'completed'),
(9,	1,	1,	1,	'4-1',	'',	'',	'',	'',	'',	0,	'prepped'),
(10,	7,	1,	1,	'1-1',	'Course Outline/Review',	'Setting up dev environment, VSCode setup',	'',	'Challenge',	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed pulvinar enim. Sed purus sapien, tincidunt in risus id, volutpat congue elit. Maecenas in eleifend metus. Vivamus nec dictum sem. ',	0,	'prepped'),
(11,	7,	1,	14,	'1-2',	'Hello world program',	'Includes, Requires, putting functions in one file',	'',	'Challenge',	' Nullam id faucibus lacus, eu suscipit velit.',	1,	'prepped'),
(12,	7,	1,	1,	'1-2',	'TEST',	'TEST',	'',	'TEST',	'TEST',	0,	'neither'),
(13,	7,	2,	2,	'1-1',	'',	'',	'',	'',	'',	0,	'neither'),
(14,	7,	1,	5,	'2-0',	'',	'',	'',	'',	'',	0,	'completed'),
(15,	7,	1,	1,	'4-1',	'',	'',	'',	'',	'',	0,	'prepped');

DROP TABLE IF EXISTS `tblLogin`;
CREATE TABLE `tblLogin` (
  `username` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `salt` varchar(200) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `tblLogin` (`username`, `password`, `salt`) VALUES
('ryan',	'472fa2f9532d1d3f3ec1e48faf90cdc12b5892f17ec92d006cc9ea6e258af600',	'KUgMBBIZbPDsMiGUOc1UvQ=='),
('victoria',	'999c0fada31e9b908b37eaa366e182cb1d9783d9d80824cdc1005a5e838ef5ee',	'5oyQOm8lAsCo4iqjtyYZcQ==');

-- 2024-04-04 22:38:45
