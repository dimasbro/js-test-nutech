/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 8.0.30 : Database - test_nutech_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`test_nutech_db` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `test_nutech_db`;

/*Table structure for table `banners` */

DROP TABLE IF EXISTS `banners`;

CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `banner_image` varchar(150) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(150) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `banner_name` (`banner_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `banners` */

insert  into `banners`(`id`,`banner_name`,`banner_image`,`description`) values 
(1,'Banner 1','https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png','Lerem Ipsum Dolor sit amet'),
(3,'Banner 2','https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png','Lerem Ipsum Dolor sit amet'),
(4,'Banner 3','https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png','Lerem Ipsum Dolor sit amet'),
(5,'Banner 4','https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png','Lerem Ipsum Dolor sit amet'),
(6,'Banner 5','https://minio.nutech-integrasi.com/take-home-test/banner/Banner-5.png','Lerem Ipsum Dolor sit amet');

/*Table structure for table `services` */

DROP TABLE IF EXISTS `services`;

CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_code` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `service_name` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `service_icon` varchar(150) COLLATE utf8mb3_unicode_ci NOT NULL,
  `service_tarif` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_code` (`service_code`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `services` */

insert  into `services`(`id`,`service_code`,`service_name`,`service_icon`,`service_tarif`) values 
(1,'PAJAK','Pajak PBB','https://minio.nutech-integrasi.com/take-home-test/services/PBB.png',40000.00),
(2,'PLN','Listrik','https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png',10000.00),
(3,'PDAM','PDAM Berlangganan','https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png',40000.00),
(4,'PULSA','Pulsa','https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png',40000.00),
(5,'PGN','PGN Berlangganan','https://minio.nutech-integrasi.com/take-home-test/services/PGN.png',50000.00),
(6,'MUSIK','Musik Berlangganan','https://minio.nutech-integrasi.com/take-home-test/services/Musik.png',50000.00),
(7,'TV','TV Berlangganan','https://minio.nutech-integrasi.com/take-home-test/services/Televisi.png',50000.00),
(8,'PAKET_DATA','Paket Data','https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png',50000.00),
(9,'VOUCHER_GAME','Voucher Game','https://minio.nutech-integrasi.com/take-home-test/services/Game.png',100000.00),
(10,'VOUCHER_MAKANAN','Voucher Makanan','https://minio.nutech-integrasi.com/take-home-test/services/Voucher-Makanan.png',100000.00),
(11,'QURBAN','Qurban','https://minio.nutech-integrasi.com/take-home-test/services/Qurban.png',200000.00),
(12,'ZAKAT','Zakat','https://minio.nutech-integrasi.com/take-home-test/services/Zakat.png',300000.00);

/*Table structure for table `transactions` */

DROP TABLE IF EXISTS `transactions`;

CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_id` int DEFAULT NULL,
  `invoice_number` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_type` enum('TOPUP','PAYMENT') COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `transactions` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `profile_image` varchar(150) COLLATE utf8mb3_unicode_ci NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
