-- MySQL dump 10.13  Distrib 8.0.46, for macos15 (arm64)
--
-- Host: localhost    Database: aventura_db
-- ------------------------------------------------------
-- Server version	8.0.46


--
-- Table structure for table `accommodations`
--

DROP TABLE IF EXISTS `accommodations`;
CREATE TABLE `accommodations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `location_name` varchar(100) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_tr` varchar(255) DEFAULT NULL,
  `title_ua` varchar(255) DEFAULT NULL,
  `title_ru` varchar(255) DEFAULT NULL,
  `description_en` text,
  `description_tr` text,
  `description_ua` text,
  `description_ru` text,
  `location_name_en` varchar(255) DEFAULT NULL,
  `location_name_ru` varchar(255) DEFAULT NULL,
  `location_name_ua` varchar(255) DEFAULT NULL,
  `location_name_tr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
-- Dumping data for table `accommodations`
--

LOCK TABLES `accommodations` WRITE;

INSERT INTO `accommodations` VALUES 

(7,'Island Paradies Villa','Bali, Indonesien','ID',195.00,-8.409518,115.188916,'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80','Ein ruhiger Rückzugsort im Dschungel.','Beach','Island Paradise Villa','Ada Cennet Villası','Вілла Острівний Рай','Вилла Островной Рай','A quiet retreat in the jungle.','Ormanda huzurlu bir sığınak.','Спокійний відпочинок у джунглях.','Спокойный отдых в джунглях.','Bali, Indonesia','Бали, Индонезия','Балі, Іннізація','Bali, Endonezya'),
(8,'Nordlicht Glamping','Tromsø, Norwegen','NO',310.00,69.649205,18.955324,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80','Schlafe unter den Sternen des Nordens.','Nature','Northern Lights Glamping','Kuzey Işıkları Glamping','Глемпінг Північне Сяйво','Глэмпинг Северное Сияние','Sleep under the stars.','Yıldızların altında uyuyun.','Спіть під зірками.','Спите под звездами.','Tromsø, Norway','Тромсё, Норвегия','Тромсе, Норвегія','Tromsø, Norveç'),
(9,'Alpine Luxus Chalet','Zermatt, Schweiz','CH',420.00,46.020713,7.749117,'https://images.unsplash.com/photo-1502784444157-3f34fd37b37a?auto=format&fit=crop&w=800&q=80','Exklusives Chalet mit direktem Blick auf das Matterhorn.','Mountains','Alpine Luxury Chalet','Alp Lüks Şale','Альпійське Розкішне Шале','Альпийское Роскошное Шале','Exclusive chalet with a direct view of the Matterhorn.','Matterhorn manzaralı özel şale.','Ексклюзивне шале з прямим видом на Маттерхорн.','Эксклюзивное шале с прямым видом на Маттерхорн.','Zermatt, Switzerland','Церматт, Швейцария','Церматт, Швейцарія','Zermatt, İsviçre'),
(10,'Kappadokien Cave Hotel','Göreme, Türkei','TR',180.00,38.643056,34.828889,'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80','Einzigartiges Zimmer in einer historischen Höhle.','Historic','Cappadocia Cave Hotel','Kapadokya Mağara Oteli','Печерний Готель Каппадокія','Пещерный Отель Каппадокия','Unique room in a historic cave.','Tarihi bir mağarada benzersiz bir oda.','Унікальний номер в історичній печері.','Уникальный номер в исторической пещере.','Goreme, Turkey','Гёреме, Турция','Гьореме, Туреччина','Göreme, Türkiye'),
(11,'Santorini Caldera View','Santorin, Griechenland','GR',290.00,36.416667,25.433333,'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80','Traditionelles weißes Haus mit privatem Infinity-Pool über der Ägäis.','Beach','Santorini Caldera View','Santorini Kaldera Manzarası','Вілла з видом на Кальдеру','Вилла с видом на Кальдеру','Traditional white house with private infinity pool.','Özel sonsuzluk havuzlu geleneksel beyaz ev.','Традиційний білий будинок з власним інфініті-пулом.','Традиционный белый дом с собственным инфинити-пулом.','Santorini, Greece','Санторини, Греция','Санторіні, Греція','Santorini, Yunanistan'),
(12,'Kyoto Machiya Tradition','Kyoto, Japan','JP',210.00,35.011636,135.768029,'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80','Ein restauriertes, traditionelles Holz-Stadthaus im historischen Gion-Viertel.','Historic','Kyoto Machiya Tradition','Kyoto Machiya Geleneği','Традиційний Будинок Мачія','Традиционный Дом Мачия','A restored traditional wooden townhouse.','Restore edilmiş geleneksel ahşap kasaba evi.','Відновлений традиційний деревяний міський будинок.','Восстановленный традиционный деревянный городской дом.','Kyoto, Japan','Киото, Япония','Кіото, Японія','Kyoto, Japonya');
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `accommodation_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `accommodation_id` (`accommodation_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--



--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `country_code` varchar(10) NOT NULL,
  `name_de` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `name_tr` varchar(255) DEFAULT NULL,
  `name_ua` varchar(255) DEFAULT NULL,
  `name_ru` varchar(255) DEFAULT NULL,
  `flag_url` varchar(500) DEFAULT NULL,
  `info_text_de` text,
  `info_text_en` text,
  `info_text_ru` text,
  `info_text_ua` text,
  `info_text_tr` text,
  `additional_info_1_en` varchar(255) DEFAULT NULL,
  `additional_info_1_de` varchar(255) DEFAULT NULL,
  `additional_info_1_tr` varchar(255) DEFAULT NULL,
  `additional_info_1_ua` varchar(255) DEFAULT NULL,
  `additional_info_1_ru` varchar(255) DEFAULT NULL,
  `additional_info_2_en` varchar(255) DEFAULT NULL,
  `additional_info_2_de` varchar(255) DEFAULT NULL,
  `additional_info_2_tr` varchar(255) DEFAULT NULL,
  `additional_info_2_ua` varchar(255) DEFAULT NULL,
  `additional_info_2_ru` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
INSERT INTO `countries` VALUES ('ID','Indonesien','Indonesia','Endonezya','Індонезія','Индонезия','https://flagcdn.com/w320/id.png','Entdecke tropische Strände, dichte Dschungel und die Kultur von Bali.','Discover tropical beaches, dense jungles and the vibrant culture of Bali.','Откройте для себя тропические пляжи, густые джунгли и культуру Бали.',NULL,NULL,'Währung: IDR',NULL,NULL,NULL,NULL,'Beste Reisezeit: Mai - September',NULL,NULL,NULL,NULL),('NO','Norwegen','Norway','Norveç','Норвегія','Норвегия','https://flagcdn.com/w320/no.png','Erlebe die magischen Polarlichter und atemberaubende Fjorde.','Experience the magical northern lights and breathtaking fjords.','Испытайте волшебство северного сияния и захватывающих фьордов.',NULL,NULL,'Währung: NOK',NULL,NULL,NULL,NULL,'Beste Reisezeit: Nov - März',NULL,NULL,NULL,NULL);
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'Nico','Hoppe','hoppe220705@gmail.com','$2b$12$JSB2iz3C0AiYXCf.D8U.xu1BjZG3tSV3JRN/JGOPM2Wz2dtaAHU.G','user','2026-05-06 22:52:53'),(2,'Tom','Müller','tom@mueller.com','$2b$12$iEN/UJx4c6ABg3u4Q5Yim.eoOT6u/zmgFsYLD2M6En5.myHkCnacW','user','2026-05-06 22:56:56'),(4,'Magnus','Wünsch','hoppe20705@gmail.com','$2b$12$6UyGFfAvOPYWodzfIjCLzOb3QwB0OTtQzjRYHQ7ZxDqyNhUNhQ9Ta','user','2026-05-28 10:15:52');
UNLOCK TABLES;