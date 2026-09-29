
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` varchar(36) NOT NULL,
  `accountId` text NOT NULL,
  `providerId` text NOT NULL,
  `userId` varchar(36) NOT NULL,
  `accessToken` text DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `idToken` text DEFAULT NULL,
  `accessTokenExpiresAt` datetime(3) DEFAULT NULL,
  `refreshTokenExpiresAt` datetime(3) DEFAULT NULL,
  `scope` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_account_user_id` (`userId`),
  CONSTRAINT `account_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('HxCJ07DvFY6peDHcbR1xuaA30THTZcWT','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2','credential','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL,NULL,NULL,NULL,NULL,NULL,'$2b$10$tTZFDudQE/XXdq0XXPdRIulLwLSslCv5R3807J3VjHTWRGO3D4wZC','2026-06-30 19:12:28.957','2026-06-30 14:12:44.000');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `categorias_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias_productos` (
  `Id_Cat` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Cat` varchar(100) NOT NULL,
  `Des_Cat` text DEFAULT NULL,
  `Id_Cat_Pad` int(11) DEFAULT NULL,
  `Ico_Cat` varchar(50) DEFAULT NULL,
  `Ord_Cat` int(11) DEFAULT 0,
  `Est_Cat` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Cat`),
  KEY `Id_Cat_Pad` (`Id_Cat_Pad`),
  CONSTRAINT `categorias_productos_ibfk_1` FOREIGN KEY (`Id_Cat_Pad`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `categorias_productos` WRITE;
/*!40000 ALTER TABLE `categorias_productos` DISABLE KEYS */;
INSERT INTO `categorias_productos` VALUES (9,'Adobe Creative Cloud','Adobe Creative Cloud',NULL,NULL,1,'activo','2026-04-17 20:02:46','2026-04-17 21:10:19'),(10,'Herramientas IA','Herramientas IA',NULL,NULL,2,'activo','2026-04-17 20:03:12','2026-04-17 20:03:12'),(11,'Edición de Video','Herramientas para Edición de Video',NULL,NULL,3,'activo','2026-04-17 20:03:34','2026-04-17 20:04:36'),(12,'Diseño Gráfico','Herramientas para Diseño Gráfico',NULL,NULL,4,'activo','2026-04-17 20:03:48','2026-04-17 20:04:26'),(13,'CAD y Arquitectura','Herramientas para CAD y Arquitectura',NULL,NULL,5,'activo','2026-04-17 20:04:08','2026-04-17 20:04:08'),(14,'Productividad','Herramientas de Productividad y Oficina',NULL,NULL,6,'activo','2026-04-17 20:05:12','2026-04-17 20:05:12'),(15,'Paneles de Descargas','Paneles de Descargas de recursos premium',NULL,NULL,7,'activo','2026-04-17 20:05:36','2026-04-17 20:05:36');
/*!40000 ALTER TABLE `categorias_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `Id_Cli` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Cli` varchar(100) DEFAULT NULL,
  `Ape_Cli` varchar(100) DEFAULT NULL,
  `Tel_Cli` varchar(20) DEFAULT NULL,
  `Ema_Cli` varchar(100) DEFAULT NULL,
  `Pai_Cli` varchar(100) DEFAULT 'Ecuador',
  `Doc_Cli` varchar(50) DEFAULT NULL,
  `Dir_Cli` text DEFAULT NULL,
  `Tip_Cli` varchar(30) DEFAULT 'persona',
  `Cat_Cli` enum('nuevo','ocasional','frecuente','vip') DEFAULT 'nuevo',
  `Pre_Con_Cli` enum('whatsapp','email','instagram','messenger') DEFAULT 'whatsapp',
  `Ace_Not_What_Cli` tinyint(1) DEFAULT 1,
  `Ace_Not_Cor_Cli` tinyint(1) DEFAULT 1,
  `Not_Cli` text DEFAULT NULL,
  `Est_Cli` enum('activo','inactivo','suspendido') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Cli`),
  UNIQUE KEY `uk_tel_cli` (`Tel_Cli`),
  KEY `idx_nom_cli` (`Nom_Cli`,`Ape_Cli`),
  KEY `idx_tel_cli` (`Tel_Cli`),
  KEY `idx_ema_cli` (`Ema_Cli`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (12,'Aaron','Perkinsin','50763105362','aaronperkinson@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(13,'Abigail','Tuston','593987078337','abby.tuston@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(14,'Adrian','Mero','593960283551','hola@lobulo.ec','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(15,'Adrian','Orozco','593999795668','rainafterpainn@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 15:04:54'),(16,'Alejandro','Campos','593982047963','buyaccesories2@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(17,'Alesso',NULL,'593996798621','alessandroosmar.sanchezmacias@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(18,'Alex','Quinche','593995581013','alexquinche810@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(19,'Alexander','Villamar','593968951625','alexinusa2911@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(20,'Amazonia','Ec','593984669911','ego.amazonia@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(21,'Andrea','Quinde','593985811723','andreaquinde20@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(22,'Andres','Pilco','593978896167','locosxlasana@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(23,'Andrés','Reinoso','593983460995','andres.reinoso.ec@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(24,'Andrés','Yanez','593963984990','vectorsie7@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(25,'Angelo','Ayllon','593962034424','angeloaylloncedeno@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(26,'Billy','Cajas','593963105846','bcajas94@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(27,'Bryan',NULL,'593962992736','bryan.alex1996@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(28,'Bryan','Flores','593999139775','bricardoxd96@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(29,'Bryan','Ortiz','593963715869','ricardo.oh2001@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(30,'Bryan',NULL,'593984274379','bryanad2026@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(31,'Bryan','Sango','593963461506','bryansango.1997@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(32,'Carlos','Gualacata','593939650322','identikaec@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(33,'Carlos','Urgieles','593979037652','licurgiles@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(34,'Carlos','Aranda','5218712406472','carandam57@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(35,'Carlos','Clavijo','593990800738','carlospatricioclavijo@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(36,'Carlos','Enríquez','593989833272','carlosconsorcioec@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(37,'Carlos','Mendez','593995774404','carlosdaniel.mendezcrespo15@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(38,'Christian','Muñoz','593988436139','kinghoststudio@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(39,'Cliente',NULL,'593969452362','thebignoslen@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(40,'Cliente',NULL,'593990809901','edilove257@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(41,'Cliente',NULL,'593962210777','aotoristudiodesing@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(42,'Cliente',NULL,'593983491843','asminerayambientaljcr@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(43,'Cliente',NULL,'593959891648','rodriguezlainezpeter@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(44,'Cliente',NULL,'593985696766','amayorga@andoarq.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(45,'Cliente',NULL,'593998110899','nanguieta@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(46,'Cliente',NULL,'593961778447','arleve1320@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(47,'Cliente',NULL,'593995244996','echangzarate@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(48,'Cliente',NULL,'593981192585','dpilamungac@unemi.edu.ec','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(49,'Cliente',NULL,'593964164069','cuentaadobe30qw@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(50,'Cliente',NULL,'593997809625','criptoprimero120@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(51,'Cliente',NULL,'593998315630','rydancr@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(52,'Cliente',NULL,'593962761671','adalgoti@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(53,'Cliente',NULL,'593969365510','wach_uno@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(54,'Cliente',NULL,'593986457060','alfrredocarvajal@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(55,'Geovanny','Brito','593984268359','geovafercho123@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(56,'Copycenter','Connect','593995617391','mrojas@ecsoporte.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(57,'Cristian','Lopez','593997383057','turisteandoconelchris@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(58,'Daniel','Mata','593990340743','safecuenta24@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(59,'Daniel','Guano','593987273196','dguanoq1011@outlook.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(60,'Dario','Paredes','593987092143','ruso_dario@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(61,'Darwin','Pico','593963805772','tiendas.sombreros@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(62,'Darwin','Lema','593967146550','darwin_lema2025@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(63,'David','Supe','593993045003','dsupe2@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(64,'David','Romero','593959890638','mrhazelgitah@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(65,'Dayler','Noboa','593962717999','daylerg8@gmail.com','Ecuador',NULL,NULL,'persona','frecuente','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(66,'Diego','Obando','593997624883','dcero84@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(67,'Diego','Chacho','593963179762','orangefb@icloud.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(68,'Dimitri','Duran','593986427317','cue05xtremekey@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(69,'Domenica','Ruiz','593986452166','domenicaruiz554@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(70,'Dou',NULL,'593988132346','daecheverria29@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(71,'Dylan','Cardenas','593998372027','saqra.yaku@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(72,'Edison','Palomo','593998800089','edison1698german@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(73,'Elvis','Campi','593967590511','elvis.campi@educacion.gob.ec','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(74,'Erick',NULL,'593997442648','esanlucas@yahoo.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(75,'Evelyn',NULL,'593980775978','resp.cuenta064@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(76,'Frank',NULL,'5219921022049','franksanchezfonsec@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(77,'Franklin','Tapia','593989231521','fgtpia2010@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(78,'G','Panameno41','50376856830','g.panameno41@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(79,'Gabo',NULL,'593982175599','gaboc1301@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(80,'Gabriel','Jurado','593962391911','articmonkey210@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(81,'Gabriel',NULL,'593963215886','gabrielcevallosf@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(82,'Gabriel','Manjarres','593939913267','gabriel.manjarres.1998@outlook.es','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(83,'Gabriela','Luje','593984493493','gabyluje0@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(84,'Geremias','Burgos','593996175190','wbayron@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(85,'Hernadez','Villamar','593962807598','djingtyrone@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(86,'Ilades',NULL,'593995476267','munlla2010@icloud.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(87,'Israel','Naula','593999964617','israel_naula@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(88,'Ivan','Maza','593999823378','agenciastratix@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(89,'Jaime',NULL,'593983545056','cue03xtremekey@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(90,'Janes','Masaquiza','593962150075','janesmasaquiza@yahoo.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(91,'Jeremy','Ortega','593962303679','isaias.jer2007@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(92,'Jhon','Simbana','593979595923','simbanajhon22@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(93,'Jhon','Macias','593960181040','jhonkarpedia9@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(94,'Jhon','Encalada','593939242994','jmencalada@istdabloja.edu.ec','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(95,'Jhonatan','Cardona','50768048602','xtremeservicio002@xtremekey.shop','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(96,'Jhoossu',NULL,'593997066102','loyolac1@unemi.edu.ec','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(97,'Jimmy','Rosales','593988898965','jimsoul087@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(98,'Jonathan','Vera','593990569289','ozeanagencia@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(99,'Jorge','Burneo','593991970688','jeburneo@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(100,'Jorge','HernáNdez','593983013269','luisjosee@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(101,'Jorge','Chalen','593987458288','tinochalen@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(102,'Jorge','Flores','593981932641','kenzokamallagua@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(103,'Jose','Antonio','593986995621','ppitogarzon@yahoo.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(104,'José','BeltráN','593989648912','jolubelflan@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(105,'Joseph','Cueva','593980052634','jcueva2@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(106,'Josue','Mina','593988745108','tatianalooracosta@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(107,'Juan','ABK','593987712343','asistencia.abkrea04@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(108,'Juan','Maldonado','593999881182','juanandresmaldonadoneira@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(109,'Juan','Villalba','593993459987','jcv1200@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(110,'Juan','Pineda','593995043312','iuanesd@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(111,'Julio','Portilla','593982463314','danielaportillaxd13@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(112,'Justin','Minda','593999964297','justin0035m@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(113,'Karla','Ruiz','593991869903','karlaruiz1907@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(114,'Kevin','Salazar','593983053825','Businessnigiri@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(115,'Kevin','Reyes','593997648646','krear.0925@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(116,'Keyla','Muños','593963776059','festijuegosanimaciones1@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(117,'Klever','Morales','593995010590','publistudioec@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(118,'Leonardo',NULL,'5218131593301','co.leonardo.ms@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(119,'Luis','Aizprúa','593984172690','aizprualuis14061997@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(120,'Luis','Hernandez','5215525353112','luishernandez11267@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(121,'Luis','Pincay','593959825398','lcr7_@hotmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(122,'Luis','Baque','593980000579','luisfelipefilmmaker@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(123,'Madeleine','Orellana','593998682872','cue02xtremekey@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(124,'Magaly','Pineda','593987449358','magapro.ec@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(125,'Manolo','Vaca','593984897371','trabajosmanolo2@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(126,'Marco','Rosero','593995610384','marco.rosero2307nuevocanal@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(127,'Marissa','Alban','593961091840','marissalban19@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(128,'Mateo','Romero','593978723565','mateo.romero88@icloud.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(129,'Mauro','Chango','593995755030','xtremeadobe001@xtremekey.shop','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(130,'Melanie','Cunalata','593983474561','resp.cuenta063@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(131,'Migue','Barrionuevo','593983845390','siniestros@abtseguros.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(132,'Naye','Imbago','593984785542','cue04xtremekey@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(133,'Neotropic',NULL,'593997663669','neotropicexpeditionsmkt@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(134,'Nicole','Vaca','593995609977','nimijalv03@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(135,'Renato','Merchan','593996563518','rmerchanm@uoc.edu','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(136,'Revendedor',NULL,'593980207382','amaciasvalero@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(137,'Revendedor',NULL,'593998798450','christi.heymann@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(138,'Ricardo','Recalde','593993160636','recaldenicolas165@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(139,'Richard',NULL,'593999309827','an.richard99@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(140,'Roberth','PesáNtez','593981404771','seguridadterrac17@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(141,'Rolando','Vizuete','593961575506','erevejota.dfc@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(142,'Sari',NULL,'50764282409','sariisarii2708@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(143,'Saul','Martinez','593989587077','saulmartinez135@icloud.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(144,'Sebas','Marcillo','593990302643','Sebasremix44@gmail.com','Ecuador',NULL,NULL,'persona','frecuente','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(145,'Tatiana','Vasquez','593981677487','tvasquezj25@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(146,'Vladimir','Martinez','593963917379','kevinmarti9182@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(147,'Walter','Guachizaca','593986737914','lojanisimaorquesta@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(148,'William','Cartagena','50360409157','wcartagena@gmail.com','Ecuador',NULL,NULL,'persona','ocasional','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(149,'Xiomara','Quinde','593983850124','xquindecantos@gmail.com','Ecuador',NULL,NULL,'persona','ocasional','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(150,'Yasser',NULL,'593984423477','pandemonioprods@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(151,'Kevin','Villarroel','593991345508','canvadiseno23@yahoo.com','Ecuador',NULL,NULL,'persona','ocasional','whatsapp',1,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(152,'May','Abad','593999906290','xtremeadobe001@xtremekey.shop','Ecuador',NULL,NULL,'persona','frecuente','whatsapp',1,1,NULL,'activo','2026-05-12 23:08:53','2026-07-01 14:57:09'),(153,'Pablo','Rodriguez','593999044347','2005pablor@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 23:23:26','2026-07-01 14:57:09'),(154,'Pruebas','Personal','593989560069','admin@xtremekey.shop','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-15 21:36:54','2026-07-02 23:09:14'),(155,'Alexis','Aguilar','593998142215',NULL,'Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-06-11 17:13:55','2026-07-01 14:57:09'),(156,'Joseph','Taco','593969790576','filmsjireh@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-06-12 11:38:18','2026-07-01 14:57:09'),(160,'Aron','-',NULL,'aronvilla099@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-07-01 16:47:10','2026-07-01 16:47:10'),(162,'Daniel','Vite','593979604821','danifdjersey26@gmail.com','Ecuador',NULL,NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-07-20 12:24:57','2026-07-20 12:24:57');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `configuracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configuracion` (
  `Id_Con` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Emp_Con` varchar(150) NOT NULL,
  `Dir_Con` varchar(255) DEFAULT NULL,
  `Tel_Con` varchar(20) DEFAULT NULL,
  `Ema_Con` varchar(100) DEFAULT NULL,
  `Log_Con` varchar(255) DEFAULT NULL,
  `Mon_Con` varchar(10) DEFAULT 'USD',
  `Zon_Hor_Con` varchar(50) DEFAULT 'America/Guayaquil',
  `Imp_Con` decimal(5,2) DEFAULT 0.00,
  `Hab_Imp_Con` tinyint(1) NOT NULL DEFAULT 1,
  `Dia_Gra_Ren_Con` int(11) NOT NULL DEFAULT 30,
  `Dia_Arc_Ven_Con` int(11) NOT NULL DEFAULT 5,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Con`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
INSERT INTO `configuracion` VALUES (1,'Xtremekey','Av. Principal 123','+593992706565','admin@xtremekey.shop',NULL,'USD','America/Guayaquil',15.00,0,30,5,'2026-04-16 11:30:47','2026-06-15 16:10:11');
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `contadores_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contadores_venta` (
  `Anio` int(11) NOT NULL,
  `Ultimo_Num` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `contadores_venta` WRITE;
/*!40000 ALTER TABLE `contadores_venta` DISABLE KEYS */;
INSERT INTO `contadores_venta` VALUES (2026,29);
/*!40000 ALTER TABLE `contadores_venta` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cuentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cuentas` (
  `Id_Cue` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Nom_Cue` varchar(100) DEFAULT NULL,
  `Usu_Cue` varchar(150) DEFAULT NULL,
  `Pas_Cue` varchar(255) DEFAULT NULL,
  `Pin_Cue` varchar(50) DEFAULT NULL,
  `Per_Cue` varchar(100) DEFAULT NULL,
  `Tot_Per_Cue` int(11) DEFAULT 1,
  `Per_Dis_Cue` int(11) DEFAULT 1,
  `Fec_Com_Cue` date DEFAULT NULL,
  `Fec_Ven_Cue` date DEFAULT NULL,
  `Cos_Cue` decimal(12,2) DEFAULT NULL,
  `Not_Cue` text DEFAULT NULL,
  `Est_Cue` enum('disponible','ocupada','parcial','vencida','suspendida') DEFAULT 'disponible',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Cue`),
  KEY `Id_Prd` (`Id_Prd`),
  KEY `Id_Var` (`Id_Var`),
  KEY `idx_est_cue` (`Est_Cue`),
  KEY `idx_fec_ven_cue` (`Fec_Ven_Cue`),
  CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `cuentas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `chk_cuentas_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cuentas` WRITE;
/*!40000 ALTER TABLE `cuentas` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuentas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `detalle_ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalle_ventas` (
  `Id_Dve` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Ven` int(11) NOT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Id_Sus` int(11) DEFAULT NULL,
  `Id_Cue` int(11) DEFAULT NULL,
  `Id_Key` int(11) DEFAULT NULL,
  `Cor_Cue` varchar(150) DEFAULT NULL,
  `Con_Cue` varchar(255) DEFAULT NULL,
  `Can_Dve` int(11) DEFAULT 1,
  `Pre_Uni_Dve` decimal(12,2) NOT NULL,
  `Des_Uni_Dve` decimal(12,2) DEFAULT 0.00,
  `Fec_Ini_Dve` datetime NOT NULL,
  `Fec_Fin_Dve` datetime NOT NULL,
  `Not_Dve` text DEFAULT NULL,
  `Est_Dve` enum('activo','vencido','cancelado','renovado') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Dve`),
  KEY `Id_Ven` (`Id_Ven`),
  KEY `Id_Prd` (`Id_Prd`),
  KEY `Id_Var` (`Id_Var`),
  KEY `Id_Cue` (`Id_Cue`),
  KEY `Id_Key` (`Id_Key`),
  KEY `idx_fec_fin_dve` (`Fec_Fin_Dve`),
  KEY `idx_est_dve` (`Est_Dve`),
  KEY `idx_detalle_ventas_id_sus` (`Id_Sus`),
  CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE CASCADE,
  CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `detalle_ventas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `detalle_ventas_ibfk_4` FOREIGN KEY (`Id_Cue`) REFERENCES `cuentas` (`Id_Cue`) ON DELETE SET NULL,
  CONSTRAINT `detalle_ventas_ibfk_5` FOREIGN KEY (`Id_Key`) REFERENCES `keys_productos` (`Id_Key`) ON DELETE SET NULL,
  CONSTRAINT `detalle_ventas_ibfk_6` FOREIGN KEY (`Id_Sus`) REFERENCES `suscripciones` (`Id_Sus`) ON DELETE SET NULL,
  CONSTRAINT `chk_detalle_ventas_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `detalle_ventas` WRITE;
/*!40000 ALTER TABLE `detalle_ventas` DISABLE KEYS */;
INSERT INTO `detalle_ventas` VALUES (12,24,15,2,NULL,NULL,NULL,NULL,NULL,2,9.00,0.00,'2026-04-14 00:00:00','2026-05-14 00:00:00',NULL,'activo','2026-05-12 23:05:27','2026-05-12 23:05:27'),(13,25,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-13 00:00:00','2026-05-13 00:00:00',NULL,'activo','2026-05-12 23:07:21','2026-05-12 23:07:21'),(14,26,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-14 00:00:00','2026-05-14 00:00:00',NULL,'activo','2026-05-12 23:09:42','2026-05-12 23:09:42'),(15,27,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-14 00:00:00','2026-05-14 00:00:00',NULL,'activo','2026-05-12 23:10:52','2026-05-12 23:10:52'),(16,28,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-11 00:00:00','2026-05-11 00:00:00',NULL,'activo','2026-05-12 23:14:00','2026-05-12 23:14:00'),(17,29,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-11 00:00:00','2026-05-11 00:00:00',NULL,'activo','2026-05-12 23:16:38','2026-05-12 23:16:38'),(18,30,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-10 00:00:00','2026-05-10 00:00:00',NULL,'activo','2026-05-12 23:18:50','2026-05-12 23:18:50'),(19,31,15,26,NULL,NULL,NULL,NULL,NULL,1,26.00,0.00,'2026-05-12 00:00:00','2026-08-12 00:00:00',NULL,'activo','2026-05-12 23:20:29','2026-05-12 23:20:29'),(20,32,15,26,NULL,NULL,NULL,NULL,NULL,1,26.00,0.00,'2026-02-09 00:00:00','2026-05-09 00:00:00',NULL,'activo','2026-05-12 23:28:18','2026-05-12 23:28:18'),(21,33,21,32,NULL,NULL,NULL,NULL,NULL,1,4.00,0.00,'2026-04-17 00:00:00','2026-05-17 00:00:00',NULL,'activo','2026-05-12 23:32:41','2026-05-12 23:32:41'),(23,35,15,26,NULL,NULL,NULL,NULL,NULL,1,26.00,0.00,'2026-02-18 00:00:00','2026-05-18 00:00:00',NULL,'activo','2026-05-13 00:06:34','2026-05-13 00:06:34'),(24,36,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-05-14 00:00:00','2026-06-14 00:00:00',NULL,'activo','2026-05-14 19:52:10','2026-05-14 19:52:10'),(26,38,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-06-09 00:00:00','2026-07-09 00:00:00',NULL,'activo','2026-06-09 11:15:17','2026-06-12 12:08:34'),(29,41,15,2,NULL,NULL,NULL,'bricardoxd96@gmail.com',NULL,1,9.00,0.00,'2026-06-09 00:00:00','2026-07-09 00:00:00',NULL,'activo','2026-06-09 18:51:17','2026-06-09 18:51:17'),(30,42,15,2,NULL,NULL,NULL,'guederlyngstudio@gmail.com',NULL,1,6.00,0.00,'2026-06-10 00:00:00','2026-07-10 00:00:00',NULL,'activo','2026-06-09 19:04:33','2026-06-09 19:04:33'),(31,43,15,26,NULL,NULL,NULL,'luisfelipefilmmaker@gmail.com','Adobe.360@22',1,30.00,0.00,'2026-06-09 00:00:00','2026-09-09 00:00:00',NULL,'activo','2026-06-09 19:39:26','2026-06-09 22:50:35'),(32,44,16,6,NULL,NULL,NULL,'Pabloxavier1974@gmail.com',NULL,1,3.00,0.00,'2026-06-09 00:00:00','2027-06-09 00:00:00',NULL,'activo','2026-06-09 20:30:37','2026-06-09 22:48:06'),(38,50,21,32,NULL,NULL,NULL,'xtremeservicio001@xtremekey.shop',NULL,1,5.00,0.00,'2026-06-10 10:01:00','2026-07-10 10:01:00',NULL,'activo','2026-06-10 10:01:50','2026-06-10 10:01:50'),(39,51,15,25,NULL,NULL,NULL,'cynthiaguilar01@outlook.com','Purple.03#',1,45.00,0.00,'2026-06-11 17:13:00','2026-12-11 17:13:00',NULL,'activo','2026-06-11 17:14:23','2026-06-11 17:14:23'),(40,52,15,26,NULL,NULL,NULL,'bryansango.1997@gmail.com','Adobe.445@',1,30.00,0.00,'2026-06-10 11:32:00','2026-09-10 11:32:00',NULL,'activo','2026-06-12 11:33:02','2026-06-12 11:33:02'),(41,53,15,2,NULL,NULL,NULL,'filmsjireh@gmail.com',NULL,1,9.00,0.00,'2026-06-11 11:36:00','2026-07-11 11:36:00',NULL,'activo','2026-06-12 11:43:33','2026-06-12 11:43:33'),(42,54,19,23,NULL,NULL,NULL,'nafstoryec@gmail.com','nafstoryec432',1,6.00,0.00,'2026-06-12 11:55:00','2026-07-12 11:55:00',NULL,'activo','2026-06-12 11:56:38','2026-06-12 11:56:38'),(43,55,15,3,NULL,NULL,NULL,'jhonkarpedia9@gmail.com',NULL,1,20.00,0.00,'2026-06-12 12:19:00','2026-09-12 12:19:00',NULL,'activo','2026-06-12 12:21:00','2026-06-12 12:21:00'),(44,56,23,36,NULL,NULL,NULL,'gariya49@vodich1.com','Giare@123',1,30.00,0.00,'2026-06-10 12:28:00','2026-09-10 12:28:00',NULL,'activo','2026-06-12 12:29:21','2026-06-12 12:29:21'),(45,57,15,3,NULL,NULL,NULL,'elvis.campi@educacion.gob.ec',NULL,1,20.00,0.00,'2026-06-13 11:06:00','2026-09-13 11:06:00',NULL,'activo','2026-06-15 11:07:00','2026-06-15 11:07:00'),(46,58,18,37,NULL,NULL,NULL,'aeim4671@outlook.com','Wmriu0510',1,25.00,0.00,'2026-06-13 11:09:00','2027-06-13 11:09:00',NULL,'activo','2026-06-15 11:10:45','2026-06-15 11:10:45'),(58,67,15,39,6,NULL,NULL,'danifdjersey26@gmail.com','Didi.199#',1,15.00,0.00,'2026-07-20 12:25:00','2026-08-20 12:25:00',NULL,'activo','2026-07-20 12:26:07','2026-07-20 12:26:07'),(59,68,15,39,7,NULL,NULL,'micaelaorellana078@gmail.com','Creativ556#',1,15.00,0.00,'2026-07-19 12:26:00','2026-08-19 12:26:00',NULL,'activo','2026-07-20 12:27:37','2026-07-20 12:27:37'),(60,69,15,39,8,NULL,NULL,'ecuagabopro@gmail.com','Cuzcq.1#',1,15.00,0.00,'2026-07-19 12:28:00','2026-08-19 12:28:00',NULL,'activo','2026-07-20 12:29:55','2026-07-20 12:29:55');
/*!40000 ALTER TABLE `detalle_ventas` ENABLE KEYS */;
UNLOCK TABLES;
ALTER TABLE `detalle_ventas`
  ADD COLUMN `Id_Dve_Ant` int(11) DEFAULT NULL AFTER `Id_Ven`,
  ADD UNIQUE KEY `uk_detalle_ventas_anterior` (`Id_Dve_Ant`),
  ADD CONSTRAINT `fk_detalle_venta_anterior`
    FOREIGN KEY (`Id_Dve_Ant`) REFERENCES `detalle_ventas` (`Id_Dve`) ON DELETE SET NULL;
DROP TABLE IF EXISTS `keys_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keys_productos` (
  `Id_Key` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Cla_Key` text NOT NULL,
  `Des_Key` varchar(255) DEFAULT NULL,
  `Fec_Com_Key` date DEFAULT NULL,
  `Fec_Ven_Key` date DEFAULT NULL,
  `Cos_Key` decimal(12,2) DEFAULT NULL,
  `Pre_Ven_Key` decimal(12,2) DEFAULT NULL,
  `Es_Per_Vid_Key` tinyint(1) DEFAULT 0,
  `Est_Key` enum('disponible','vendida','reservada','vencida','cancelada') DEFAULT 'disponible',
  `Not_Key` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Key`),
  KEY `Id_Var` (`Id_Var`),
  KEY `idx_est_key` (`Est_Key`),
  KEY `idx_fec_ven_key` (`Fec_Ven_Key`),
  KEY `idx_id_prd_key` (`Id_Prd`),
  CONSTRAINT `keys_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `keys_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `chk_keys_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `keys_productos` WRITE;
/*!40000 ALTER TABLE `keys_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `keys_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `plantillas_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plantillas_notificacion` (
  `Id_Pla` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Pla` varchar(150) NOT NULL,
  `Tip_Pla` enum('bienvenida','venta','renovacion','vencimiento','recordatorio','personalizado') DEFAULT 'personalizado',
  `Can_Pla` enum('whatsapp','email','sms','push') DEFAULT 'whatsapp',
  `Asu_Pla` varchar(200) DEFAULT NULL,
  `Cue_Pla` text NOT NULL,
  `Var_Pla` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Var_Pla`)),
  `Est_Pla` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Pla`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `plantillas_notificacion` WRITE;
/*!40000 ALTER TABLE `plantillas_notificacion` DISABLE KEYS */;
INSERT INTO `plantillas_notificacion` VALUES (1,'Bienvienida','bienvenida','email','Bienvenido a XtremeKey','Gracias por confiar en nosotros. Bienvenid@ a nuestra familia XtremeKey','{}','activo','2026-05-10 23:58:56','2026-05-10 23:58:56');
/*!40000 ALTER TABLE `plantillas_notificacion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `Id_Prd` int(11) NOT NULL AUTO_INCREMENT,
  `Cod_Prd` varchar(50) DEFAULT NULL,
  `Nom_Prd` varchar(150) NOT NULL,
  `Des_Prd` text DEFAULT NULL,
  `Des_Cor_Prd` varchar(255) DEFAULT NULL,
  `Id_Cat` int(11) DEFAULT NULL,
  `Tip_Prd` enum('servicio','producto','suscripcion') DEFAULT 'producto',
  `Ima_Prd` varchar(255) DEFAULT NULL,
  `Est_Prd` enum('activo','inactivo','agotado') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Prd`),
  UNIQUE KEY `Cod_Prd` (`Cod_Prd`),
  KEY `Id_Cat` (`Id_Cat`),
  KEY `idx_nom_prd` (`Nom_Prd`),
  KEY `idx_est_prd` (`Est_Prd`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_Cat`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (15,NULL,'Adobe Creative 2026',NULL,'Paquete con +20 aplicaciones profesionales',9,'suscripcion','/uploads/productos/producto-1782856598416-683447582.svg','activo','2026-04-18 01:42:26','2026-06-30 16:56:38'),(16,NULL,'Canva',NULL,'Canva Pro versión Educativa',12,'suscripcion','/uploads/productos/producto-1782856557778-325777738.svg','activo','2026-04-21 10:14:35','2026-06-30 16:55:57'),(17,NULL,'Capcut',NULL,'Capcut Pro',11,'suscripcion','/uploads/productos/producto-1782856916394-821364214.svg','activo','2026-04-21 10:27:13','2026-06-30 17:01:56'),(18,NULL,'Microsoft 365',NULL,'Office 365',14,'suscripcion','/uploads/productos/producto-1782857610459-773944785.svg','activo','2026-04-21 10:27:58','2026-06-30 17:13:48'),(19,NULL,'Panel de Descargas',NULL,'Panel de Descargas Filecip',15,'suscripcion','/uploads/productos/producto-1782857060507-907534145.png','activo','2026-04-21 12:58:14','2026-06-30 17:04:20'),(20,NULL,'Windows 11',NULL,'Key de Windows 11 Pro',14,'producto','/uploads/productos/producto-1782856465107-786264957.svg','activo','2026-05-10 13:10:21','2026-07-05 10:51:17'),(21,NULL,'Perplexity Pro',NULL,NULL,10,'suscripcion','/uploads/productos/producto-1782856446629-586673172.svg','activo','2026-05-12 23:30:00','2026-06-30 16:54:06'),(22,NULL,'Autodesk',NULL,'Suite de Autodesk o Aplicación individual',13,'suscripcion','/uploads/productos/producto-1782856831599-83590974.svg','activo','2026-05-17 01:16:01','2026-06-30 17:00:31'),(23,NULL,'Grok',NULL,'Grok IA',10,'suscripcion','/uploads/productos/producto-1782856192347-786454583.svg','activo','2026-06-10 11:48:25','2026-06-30 16:49:52');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `recordatorios_vencimiento_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recordatorios_vencimiento_email` (
  `Id_Rec` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Dve` int(11) NOT NULL,
  `Tip_Rec` enum('pre_vencimiento','dia_vencimiento') NOT NULL,
  `Fec_Objetivo` date NOT NULL,
  `Ema_Destino` varchar(150) NOT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Id_Rev` int(11) DEFAULT NULL,
  `Resend_Id` varchar(120) DEFAULT NULL,
  `Est_Envio` enum('pendiente','enviado','omitido','error') NOT NULL DEFAULT 'pendiente',
  `Err_Envio` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Rec`),
  UNIQUE KEY `uq_recordatorio_vencimiento` (`Id_Dve`,`Tip_Rec`,`Fec_Objetivo`),
  KEY `idx_recordatorios_destino` (`Ema_Destino`),
  KEY `idx_recordatorios_detalle` (`Id_Dve`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `recordatorios_vencimiento_email` WRITE;
/*!40000 ALTER TABLE `recordatorios_vencimiento_email` DISABLE KEYS */;
/*!40000 ALTER TABLE `recordatorios_vencimiento_email` ENABLE KEYS */;
UNLOCK TABLES;
-- Tabla renovaciones eliminada; el historial vive en detalle_ventas.Id_Dve_Ant.
DROP TABLE IF EXISTS `renovaciones`;
DROP TABLE IF EXISTS `revendedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revendedores` (
  `Id_Rev` int(11) NOT NULL AUTO_INCREMENT,
  `Tel_Rev` varchar(20) NOT NULL,
  `Nom_Rev` varchar(100) DEFAULT NULL,
  `Ape_Rev` varchar(100) DEFAULT NULL,
  `Ema_Rev` varchar(100) DEFAULT NULL,
  `Doc_Rev` varchar(50) DEFAULT NULL,
  `Not_Rev` text DEFAULT NULL,
  `Est_Rev` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Rev`),
  UNIQUE KEY `uk_tel_rev` (`Tel_Rev`),
  KEY `idx_nom_rev` (`Nom_Rev`,`Ape_Rev`),
  KEY `idx_tel_rev` (`Tel_Rev`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `revendedores` WRITE;
/*!40000 ALTER TABLE `revendedores` DISABLE KEYS */;
INSERT INTO `revendedores` VALUES (1,'50664417220','BIOCDKEYS',NULL,'support@biocdkeys.com',NULL,NULL,'activo','2026-06-09 15:20:14','2026-06-09 15:20:14'),(2,'593980207382','Data Pack Studio',NULL,NULL,NULL,NULL,'activo','2026-06-09 15:21:01','2026-06-09 15:21:01'),(3,'593998798450','David','Jiménez',NULL,NULL,NULL,'activo','2026-06-15 11:09:36','2026-06-15 11:09:36');
/*!40000 ALTER TABLE `revendedores` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `id` varchar(36) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `ipAddress` text DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `userId` varchar(36) NOT NULL,
  `impersonatedBy` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token_unique` (`token`),
  KEY `idx_session_user_id` (`userId`),
  CONSTRAINT `session_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES ('Aamu2g6NypksbeSIyVpl3mRwlwwtXzJt','2026-07-10 03:41:39.261','C3owr835LXwsebpZ8Ht9JC1gDcTVVIQL','2026-07-03 03:41:39.315','2026-07-03 03:41:39.315','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('BTEtOC7AQXqa68chuDb5DIRBFJNFEOdL','2026-07-10 16:14:10.588','Ixb8gVmQ22zkawtPHir2fffndTRZHeo2','2026-07-03 16:14:10.588','2026-07-03 16:14:10.588','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('CErPLxn830EM1vIGeCaEMleum6RoaV2V','2026-07-09 16:02:45.593','jEK0P0GdLLKbghIcBkbApHMS3jOHxoat','2026-07-02 16:02:45.593','2026-07-02 16:02:45.593','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('e7InOVy1Gz3wYVGQ85LfhxeNlwuInmWt','2026-07-08 21:43:58.028','sL3XUrOm2HPAuOmp40zpiWxRmwKmNeFk','2026-07-01 21:43:58.028','2026-07-01 21:43:58.028','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('fpKthy8ZyRcmSGoGnTrNTU1w00n516FH','2026-07-08 03:31:50.513','d2oKKocCmkjkd2OV9QN8hLipJ0YwXM8G','2026-07-01 03:31:50.514','2026-07-01 03:31:50.514','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('OFo45moMM04ZdNfrVofGNkND3IoZ5K9u','2026-07-08 21:52:34.765','Eu9JSlznBH6KXMOOPset0PCLpY19ryJv','2026-07-01 21:52:34.765','2026-07-01 21:52:34.765','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('ogbQNTLCvkeC6GZFZtcnMJnJ2YoLXZ23','2026-07-28 02:48:24.617','BYqHFPUpCq7aolIKt9fP914qs6VTSx5v','2026-07-20 02:44:24.837','2026-07-21 02:48:24.617','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('ROBrsqzbUn7zHzuxR0rPSHimOJMG8bXP','2026-07-13 18:48:04.936','dKBFdQi4cdut9wt3W4RUepm27ePBDGMd','2026-07-03 16:24:46.889','2026-07-06 18:48:04.937','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('uvfeT4g1CPcaeLxmoMvAyspoz0Fn2mOe','2026-07-08 03:10:15.389','oRLK4Mo8qowCCiIvZNvxTIBqG3j5FSCw','2026-07-01 03:10:15.390','2026-07-01 03:10:15.390','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('WF1IvXMf4cfzpGpDjEFXpM6iDMeDZxep','2026-07-10 03:45:07.981','rNIF0brFTelkhZctCD41HP9EiLfhHibO','2026-07-03 03:45:07.982','2026-07-03 03:45:07.982','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `Id_Stf` char(36) NOT NULL,
  `Auth_Usu_Id` varchar(255) NOT NULL,
  `Nom_Stf` varchar(150) DEFAULT NULL,
  `Ape_Stf` varchar(150) DEFAULT NULL,
  `Car_Stf` varchar(100) DEFAULT NULL,
  `Tel_Stf` varchar(30) DEFAULT NULL,
  `Act_Stf` tinyint(1) NOT NULL DEFAULT 1,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Stf`),
  UNIQUE KEY `uk_staff_auth_user` (`Auth_Usu_Id`),
  KEY `idx_staff_activo` (`Act_Stf`),
  CONSTRAINT `fk_staff_auth_user` FOREIGN KEY (`Auth_Usu_Id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES ('a32165a9-74b7-11f1-8553-04ea567da7c0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2','Adrian','Romero',NULL,'0989560069',1,'2026-06-30 14:12:28','2026-06-30 14:12:44');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `suscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suscripciones` (
  `Id_Sus` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cli` int(11) DEFAULT NULL,
  `Id_Rev` int(11) DEFAULT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Cor_Cue_Sus` varchar(150) DEFAULT NULL,
  `Fec_Ini_Sus` datetime NOT NULL,
  `Fec_Fin_Sus` datetime DEFAULT NULL,
  `Est_Sus` enum('activa','suspendida','cancelada','expirada') DEFAULT 'activa',
  `Ren_Auto` tinyint(1) DEFAULT 1,
  `Not_Sus` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Sus`),
  KEY `idx_suscripciones_cliente` (`Id_Cli`),
  KEY `idx_suscripciones_revendedor` (`Id_Rev`),
  KEY `idx_suscripciones_producto` (`Id_Prd`),
  KEY `idx_suscripciones_variante` (`Id_Var`),
  KEY `idx_suscripciones_estado_fin` (`Est_Sus`,`Fec_Fin_Sus`),
  KEY `idx_suscripciones_cuenta` (`Cor_Cue_Sus`),
  CONSTRAINT `suscripciones_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `suscripciones_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `suscripciones_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`),
  CONSTRAINT `fk_suscripciones_revendedor` FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`),
  CONSTRAINT `chk_suscripciones_titular` CHECK ((`Id_Cli` is null) <> (`Id_Rev` is null))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `suscripciones` WRITE;
/*!40000 ALTER TABLE `suscripciones` DISABLE KEYS */;
INSERT INTO `suscripciones` (`Id_Sus`,`Id_Cli`,`Id_Prd`,`Id_Var`,`Fec_Ini_Sus`,`Fec_Fin_Sus`,`Est_Sus`,`Ren_Auto`,`Not_Sus`,`Fec_Cre`,`Fec_Mod`) VALUES (4,160,15,39,'2026-07-03 11:14:00','2026-08-03 11:14:00','activa',1,NULL,'2026-07-03 11:14:57','2026-07-03 11:14:57'),(5,160,16,6,'2026-07-03 11:14:00','2027-07-03 11:14:00','activa',1,NULL,'2026-07-03 11:14:57','2026-07-03 11:14:57'),(6,162,15,39,'2026-07-20 12:25:00','2026-08-20 12:25:00','activa',1,NULL,'2026-07-20 12:26:07','2026-07-20 12:26:07'),(7,123,15,39,'2026-07-19 12:26:00','2026-08-19 12:26:00','activa',1,NULL,'2026-07-20 12:27:37','2026-07-20 12:27:37'),(8,81,15,39,'2026-07-19 12:28:00','2026-08-19 12:28:00','activa',1,NULL,'2026-07-20 12:29:55','2026-07-20 12:29:55');
/*!40000 ALTER TABLE `suscripciones` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tareas` (
  `Id_Tar` int(11) NOT NULL AUTO_INCREMENT,
  `Tit_Tar` varchar(200) NOT NULL,
  `Des_Tar` text DEFAULT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Id_Ven` int(11) DEFAULT NULL,
  `Fec_Lim_Tar` date DEFAULT NULL,
  `Pri_Tar` enum('baja','media','alta','urgente') DEFAULT 'media',
  `Pro_Tar` int(11) DEFAULT 0,
  `Est_Tar` enum('pendiente','en_progreso','completada','cancelada') DEFAULT 'pendiente',
  `Fec_Com_Tar` datetime DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Tar`),
  KEY `Id_Cli` (`Id_Cli`),
  KEY `Id_Ven` (`Id_Ven`),
  KEY `idx_fec_lim_tar` (`Fec_Lim_Tar`),
  KEY `idx_est_tar` (`Est_Tar`),
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL,
  CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES (2,'Prueba',NULL,NULL,NULL,'2026-06-14','media',10,'pendiente',NULL,'2026-05-11 08:30:29','2026-05-17 00:52:49');
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `image` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `role` text DEFAULT NULL,
  `banned` tinyint(1) DEFAULT 0,
  `banReason` text DEFAULT NULL,
  `banExpires` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2','Adrian Romero','pruebas@xtremekey.shop',1,NULL,'2026-06-30 19:12:28.679','2026-06-30 14:12:44.000','admin',0,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `variantes_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variantes_productos` (
  `Id_Var` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) NOT NULL,
  `Nom_Var` varchar(100) NOT NULL,
  `Des_Var` text DEFAULT NULL,
  `Pre_Cos_Var` decimal(12,2) NOT NULL,
  `Pre_Ven_Var` decimal(12,2) NOT NULL,
  `Pre_Rev_Var` decimal(12,2) DEFAULT NULL,
  `Dur_Tip_Var` enum('dias','meses','anios') DEFAULT NULL,
  `Dur_Val_Var` int(11) DEFAULT NULL,
  `Max_Usu_Var` int(11) DEFAULT NULL,
  `Not_Ven_Cor_Var` tinyint(1) NOT NULL DEFAULT 1,
  `Not_Ven_Wsp_Var` tinyint(1) NOT NULL DEFAULT 1,
  `Atr_Var` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Atr_Var`)),
  `Est_Var` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Var`),
  KEY `Id_Prd` (`Id_Prd`),
  CONSTRAINT `variantes_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `variantes_productos` WRITE;
/*!40000 ALTER TABLE `variantes_productos` DISABLE KEYS */;
INSERT INTO `variantes_productos` VALUES (2,15,'Premium','Activación bajo perfiles de empresa',2.00,9.00,6.00,'meses',1,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\"}','inactivo','2026-04-18 01:43:03','2026-06-29 23:33:44'),(3,15,'Premium','Activación bajo perfiles de empresa',5.00,20.00,15.00,'meses',3,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"1 mes Envato o Freepik\"}','inactivo','2026-04-18 01:54:44','2026-06-29 23:33:39'),(4,15,'Premium','Activación bajo perfiles de empresa',8.00,32.00,28.00,'meses',6,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"1 mes Envato o Freepik\"}','inactivo','2026-04-18 01:56:32','2026-05-10 15:16:15'),(5,15,'Premium','Activación bajo perfiles de empresa',12.00,55.00,42.00,'meses',12,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"+3 meses Envato o Freepik + Canva Pro\"}','inactivo','2026-04-18 01:57:36','2026-05-10 15:16:26'),(6,16,'Pro Edu','Canva Pro versión Educativa, No incluye kit de marca',0.00,5.00,3.00,'meses',12,2,1,1,NULL,'activo','2026-04-21 10:16:19','2026-05-10 14:09:05'),(8,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',1.00,4.50,3.00,'meses',1,2,1,1,NULL,'inactivo','2026-04-21 12:06:13','2026-06-15 13:02:40'),(9,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',2.00,12.00,8.00,'meses',3,2,1,1,NULL,'inactivo','2026-04-21 12:07:03','2026-05-10 15:16:42'),(10,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',5.00,22.00,15.00,'meses',6,2,1,1,NULL,'inactivo','2026-04-21 12:07:40','2026-05-10 15:17:00'),(11,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',10.00,40.00,NULL,'meses',12,2,1,1,NULL,'inactivo','2026-04-21 12:08:07','2026-05-10 15:16:49'),(12,17,'Pro Individual','Capcut Pro Individual, Incluye 1tb de Almacenamiento',9.00,30.00,26.00,'meses',6,2,1,1,NULL,'inactivo','2026-04-21 12:09:00','2026-06-15 13:02:36'),(13,16,'Pro Edu','Canva Pro versión Educativa, No incluye kit de marca',0.00,3.00,2.00,'meses',6,2,1,1,NULL,'activo','2026-04-21 12:10:50','2026-05-10 14:09:21'),(19,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',13.00,32.00,25.00,'dias',365,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:00:39'),(20,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',8.50,18.00,15.00,'dias',180,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:00'),(21,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',5.00,13.00,11.00,'dias',90,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:04'),(22,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',3.00,10.00,7.00,'dias',60,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:13'),(23,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',1.90,6.00,4.20,'dias',30,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:22'),(24,15,'Directo','Pago directo en la web oficial de adobe',35.00,75.00,65.00,'meses',12,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100GB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"bono\":\"+2 meses Envato o Freepik + Canva Pro\"}','inactivo','2026-04-21 13:12:30','2026-06-29 23:34:40'),(25,15,'Directo','Pago directo en la web oficial de adobe',20.00,45.00,35.00,'meses',6,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100GB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"bono\":\"1 mes Envato o Freepik + CanvaPro\"}','inactivo','2026-04-21 13:12:30','2026-06-29 23:34:45'),(26,15,'Directo','Pago directo en la web oficial de adobe',13.00,30.00,25.00,'meses',3,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100gb\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\"}','activo','2026-04-21 13:12:30','2026-06-09 19:38:06'),(27,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',1.90,6.00,4.20,'dias',30,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:29'),(28,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',3.00,10.00,7.00,'dias',60,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:32'),(29,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',5.00,13.00,11.00,'dias',90,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:46'),(30,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',8.50,18.00,15.00,'dias',180,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:49'),(31,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',13.00,32.00,25.00,'dias',365,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:52'),(32,21,'1 Mes',NULL,0.00,5.00,4.00,'meses',1,NULL,0,1,NULL,'activo','2026-05-12 23:31:02','2026-06-15 13:00:16'),(33,22,'Suite',NULL,0.00,15.00,10.00,'meses',12,NULL,1,1,NULL,'activo','2026-05-17 01:16:33','2026-05-17 01:16:33'),(34,22,'Aplicación Individual',NULL,0.00,8.00,5.00,'meses',12,NULL,1,1,NULL,'activo','2026-05-17 01:17:17','2026-05-17 01:17:17'),(35,23,'SuperGrok',NULL,6.00,12.00,NULL,'meses',1,NULL,0,1,NULL,'activo','2026-06-10 11:49:15','2026-07-03 11:31:38'),(36,23,'SuperGrok',NULL,11.00,30.00,26.00,'meses',3,NULL,0,1,NULL,'activo','2026-06-10 11:49:56','2026-07-03 11:31:15'),(37,18,'Familiar',NULL,6.00,30.00,25.00,'meses',12,NULL,0,1,NULL,'activo','2026-06-15 11:07:59','2026-06-15 13:02:02'),(38,18,'Personal',NULL,1.20,15.00,9.00,'meses',12,NULL,1,1,NULL,'activo','2026-06-15 11:08:59','2026-06-15 11:08:59'),(39,15,'Directo','Pago directo en la web oficial de adobe',5.00,15.00,12.00,'meses',1,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100gb\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\"}','activo','2026-06-29 23:33:52','2026-06-29 23:34:19'),(40,20,'Key de Windows 11 Pro',NULL,1.00,10.00,6.00,'anios',NULL,NULL,1,1,NULL,'activo','2026-07-05 10:53:56','2026-07-05 10:53:56');
/*!40000 ALTER TABLE `variantes_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ventas` (
  `Id_Ven` int(11) NOT NULL AUTO_INCREMENT,
  `Cod_Ven` varchar(20) DEFAULT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Id_Rev` int(11) DEFAULT NULL,
  `Fec_Ven` datetime DEFAULT current_timestamp(),
  `Des_Tot_Ven` decimal(12,2) DEFAULT 0.00,
  `Imp_Tot_Ven` decimal(12,2) DEFAULT 0.00,
  `Tot_Ven` decimal(12,2) NOT NULL,
  `Met_Pag_Ven` varchar(50) DEFAULT NULL,
  `Not_Ven` text DEFAULT NULL,
  `Est_Ven` enum('pendiente','completada','cancelada','reembolsada') DEFAULT 'pendiente',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Ven`),
  UNIQUE KEY `uk_cod_ven` (`Cod_Ven`),
  KEY `Id_Cli` (`Id_Cli`),
  KEY `idx_fec_ven` (`Fec_Ven`),
  KEY `idx_est_ven` (`Est_Ven`),
  KEY `Id_Rev` (`Id_Rev`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (24,'VEN-2026-0001',130,NULL,'2026-05-11 13:28:00',0.00,0.00,18.00,'Tranferencia',NULL,'completada','2026-05-12 23:05:27','2026-07-21 00:17:03'),(25,'VEN-2026-0002',129,NULL,'2026-05-13 04:05:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-12 23:07:21','2026-07-21 00:17:03'),(26,'VEN-2026-0003',152,NULL,'2026-05-13 04:07:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-12 23:09:42','2026-07-21 00:17:03'),(27,'VEN-2026-0004',65,NULL,'2026-05-13 09:09:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-12 23:10:52','2026-07-21 00:17:03'),(28,'VEN-2026-0005',81,NULL,'2026-05-13 04:10:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-12 23:14:00','2026-07-21 00:17:03'),(29,'VEN-2026-0006',15,NULL,'2026-05-13 04:14:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-12 23:16:38','2026-07-21 00:17:03'),(30,'VEN-2026-0007',23,NULL,'2026-05-13 04:16:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-12 23:18:50','2026-07-21 00:17:03'),(31,'VEN-2026-0008',69,NULL,'2026-05-13 04:18:00',0.00,0.00,26.00,'Tranferencia',NULL,'completada','2026-05-12 23:20:29','2026-07-21 00:17:03'),(32,'VEN-2026-0009',147,NULL,'2026-05-13 04:20:00',0.00,0.00,26.00,'Tranferencia',NULL,'completada','2026-05-12 23:28:18','2026-07-21 00:17:03'),(33,'VEN-2026-0010',95,NULL,'2026-05-12 16:45:00',0.00,0.00,4.00,'Tranferencia',NULL,'completada','2026-05-12 23:32:41','2026-07-21 00:17:03'),(35,'VEN-2026-0011',115,NULL,'2026-05-13 05:02:00',0.00,0.00,26.00,'Tranferencia',NULL,'completada','2026-05-13 00:06:34','2026-07-21 00:17:03'),(36,'VEN-2026-0012',152,NULL,'2026-05-13 05:06:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','2026-05-14 19:52:10','2026-07-21 00:17:03'),(38,'VEN-2026-0013',55,NULL,'2026-06-10 12:28:00',0.00,0.00,9.00,'Transferencia',NULL,'completada','2026-06-09 11:15:17','2026-07-21 00:17:03'),(41,'VEN-2026-0014',28,NULL,'2026-06-09 23:51:00',0.00,0.00,9.00,'Transferencia',NULL,'completada','2026-06-09 18:51:17','2026-07-21 00:17:03'),(42,'VEN-2026-0015',NULL,2,'2026-06-09 23:07:00',0.00,0.00,6.00,'Transferencia',NULL,'completada','2026-06-09 19:04:33','2026-07-21 00:17:03'),(43,'VEN-2026-0016',122,NULL,'2026-06-09 22:42:00',0.00,0.00,30.00,'Transferencia',NULL,'completada','2026-06-09 19:39:26','2026-07-21 00:17:03'),(44,'VEN-2026-0017',NULL,2,'2026-06-09 22:46:00',0.00,0.00,3.00,'Transferencia',NULL,'completada','2026-06-09 20:30:37','2026-07-21 00:17:03'),(50,'VEN-2026-0018',57,NULL,'2026-06-10 10:01:00',0.00,0.00,5.00,'Transferencia',NULL,'completada','2026-06-10 10:01:50','2026-07-21 00:17:03'),(51,'VEN-2026-0019',155,NULL,'2026-06-11 17:13:00',0.00,0.00,45.00,'Transferencia',NULL,'completada','2026-06-11 17:14:23','2026-07-21 00:17:03'),(52,'VEN-2026-0020',31,NULL,'2026-06-12 11:32:00',0.00,0.00,30.00,'Transferencia',NULL,'completada','2026-06-12 11:33:02','2026-07-21 00:17:03'),(53,'VEN-2026-0021',156,NULL,'2026-06-12 11:36:00',0.00,0.00,9.00,'Transferencia',NULL,'completada','2026-06-12 11:43:33','2026-07-21 00:17:03'),(54,'VEN-2026-0022',55,NULL,'2026-06-12 11:55:00',0.00,0.00,6.00,'Transferencia',NULL,'completada','2026-06-12 11:56:38','2026-07-21 00:17:03'),(55,'VEN-2026-0023',93,NULL,'2026-06-12 12:19:00',0.00,0.00,20.00,'Transferencia',NULL,'completada','2026-06-12 12:21:00','2026-07-21 00:17:03'),(56,'VEN-2026-0024',107,NULL,'2026-06-12 12:28:00',0.00,0.00,30.00,'Transferencia',NULL,'completada','2026-06-12 12:29:21','2026-07-21 00:17:03'),(57,'VEN-2026-0025',73,NULL,'2026-06-13 11:06:00',0.00,0.00,20.00,'Transferencia',NULL,'completada','2026-06-15 11:07:00','2026-07-21 00:17:03'),(58,'VEN-2026-0026',NULL,3,'2026-06-13 11:09:00',0.00,0.00,25.00,'Transferencia',NULL,'completada','2026-06-15 11:10:45','2026-07-21 00:17:03'),(67,'VEN-2026-0027',162,NULL,'2026-07-20 12:25:00',0.00,0.00,15.00,'Transferencia',NULL,'completada','2026-07-20 12:26:07','2026-07-21 00:17:03'),(68,'VEN-2026-0028',123,NULL,'2026-07-20 12:26:00',0.00,0.00,15.00,'Transferencia',NULL,'completada','2026-07-20 12:27:37','2026-07-21 00:17:03'),(69,'VEN-2026-0029',81,NULL,'2026-07-20 12:28:00',0.00,0.00,15.00,'Transferencia',NULL,'completada','2026-07-20 12:29:54','2026-07-21 00:17:03');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification` (
  `id` varchar(36) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_verification_identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

