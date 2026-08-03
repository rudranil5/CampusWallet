# CampusWallet


## Required database Tables  :::::::::::::::::::::::::::::
### This Does Not Contain The Triggers Required. However Send a request to telegram for details about triggers; as the behavior will change from platform to platform. 


 A CampusWallet.Mysql file is also available but that is my sql specific 

show DATABASES;
use CampusWallet;
CREATE DATABASE `CampusWallet`;
USE `CampusWallet`;
show tables;

CREATE TABLE `details` (
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `occupation` varchar(30) DEFAULT NULL,
  `id` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `details` VALUES ('canteen','one','c12345','12345','canteen','21'),('Rudranil','Khanra','9007009743','12345','Student','34200123041'),('r','k','908172','908172','Student','908172');
;
select * from `details`;

CREATE TABLE `menu` (
  `serial` int NOT NULL AUTO_INCREMENT,
  `items` varchar(30) DEFAULT NULL,
  `cost` float DEFAULT NULL,
  PRIMARY KEY (`serial`)
);

INSERT INTO `menu` VALUES (372,'Egg Rice plate',234),(373,'Veg Rice plate',234);

CREATE TABLE `menuitems` (
  `serial` int NOT NULL AUTO_INCREMENT,
  `Items` varchar(50) DEFAULT NULL,
  `Price` float DEFAULT NULL,
  PRIMARY KEY (`serial`)
);

INSERT INTO `menuitems` VALUES (1,'Veg Rice Plate',40),(2,'Egg Rice plate',50),(3,'Fish Rice plate',60),(4,'Chicken Rice plate',60),(5,'Chicken Burger',50),(6,'Veg Sandwitch',25),(7,'Chicken Sandwitch',35),(8,'Veg Chawmin',30),(9,'Chicken Chawmin',60),(10,'Egg Chicken Chawmin',70),(11,'Dahi Vada',20),(12,'Chicken wings',40),(13,'Chicken Breast',45),(14,'Chicken Pakada',15);

CREATE TABLE `orderhistory` (
  `serial` int DEFAULT NULL,
  `item` varchar(50) DEFAULT NULL,
  `cost` float DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `id` varchar(30) DEFAULT NULL,
  `Date` date DEFAULT NULL
);

/* Specific to a cloud service */

CREATE TABLE
  `orders` (
    `serial` int NOT NULL AUTO_INCREMENT,
    `item` varchar(50) DEFAULT NULL,
    `cost` float DEFAULT NULL,
    `quantity` int DEFAULT NULL,
    `status` varchar(20) DEFAULT 'pending',
    `code` varchar(10) DEFAULT NULL,
    `id` varchar(30) NOT NULL,
    `Date` DATE  DEFAULT(CURRENT_DATE),
    `time` TIMESTAMP  DEFAULT(CURRENT_TIMESTAMP),
    PRIMARY KEY (`serial`),
    KEY `id` (`id`),
    CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id`) REFERENCES `details` (`id`)
  );


INSERT INTO `orders` VALUES (86,'Egg Rice plate',50,2,'preparing','hpllnk20','908172','2026-08-03','01:02:08');

select * from orders;

CREATE TABLE `services` (
  `serial` int DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `status` enum('open','closed') DEFAULT NULL,
  `updaterId` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`name`)
);

INSERT INTO `services` VALUES (1,'canteen','open',NULL),(3,'library','open',NULL),(2,'xerox','closed',NULL);


CREATE TABLE `servicelog` (
  `serial` int DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `status` enum('open','closed') DEFAULT NULL,
  `updaterId` varchar(20) DEFAULT NULL,
  `time` timestamp NULL DEFAULT (CURRENT_TIMESTAMP)
);
