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
INSERT INTO `account` VALUES ('HxCJ07DvFY6peDHcbR1xuaA30THTZcWT','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2','credential','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL,NULL,NULL,NULL,NULL,NULL,'$2b$10$tTZFDudQE/XXdq0XXPdRIulLwLSslCv5R3807J3VjHTWRGO3D4wZC','2026-06-30 19:12:28.957','2026-06-30 14:12:44.000'),('qjxIg5zQrVOJzX4a9RH9oH194VQ5etZz','eqx7E4pgP30Z3kTjvcu4k1IuAOJTam8i','credential','eqx7E4pgP30Z3kTjvcu4k1IuAOJTam8i',NULL,NULL,NULL,NULL,NULL,NULL,'$2b$10$DgJuHfD73Q5wI9AZqoIrBu0EpWJqYYwyRdIbEFA6AF47cuMe5GYsa','2026-07-01 16:47:09.996','2026-07-01 16:47:09.996');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `carrito_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carrito_items` (
  `Id_Car_Item` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Car_Ses` varchar(64) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT 1,
  `Fec_Agregado` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Car_Item`),
  KEY `idx_carrito_item_sesion` (`Id_Car_Ses`),
  KEY `idx_carrito_item_producto` (`Id_Prd`),
  KEY `idx_carrito_item_variante` (`Id_Var`),
  CONSTRAINT `fk_carrito_items_producto` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `fk_carrito_items_sesion` FOREIGN KEY (`Id_Car_Ses`) REFERENCES `carrito_sesiones` (`Id_Car_Ses`) ON DELETE CASCADE,
  CONSTRAINT `fk_carrito_items_variante` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `carrito_items` WRITE;
/*!40000 ALTER TABLE `carrito_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito_items` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `carrito_sesiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carrito_sesiones` (
  `Id_Car_Ses` varchar(64) NOT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Id_Sesion_Tmp` varchar(64) DEFAULT NULL,
  `Expira_En` datetime DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Car_Ses`),
  KEY `idx_carrito_cliente` (`Id_Cli`),
  KEY `idx_carrito_sesion_tmp` (`Id_Sesion_Tmp`),
  CONSTRAINT `fk_carrito_sesiones_cliente` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `carrito_sesiones` WRITE;
/*!40000 ALTER TABLE `carrito_sesiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito_sesiones` ENABLE KEYS */;
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
  `Uuid_Cli` char(36) NOT NULL,
  `Nom_Cli` varchar(100) DEFAULT NULL,
  `Ape_Cli` varchar(100) DEFAULT NULL,
  `Tel_Cli` varchar(20) DEFAULT NULL,
  `Ema_Cli` varchar(100) DEFAULT NULL,
  `Auth_User_Id` varchar(36) DEFAULT NULL,
  `Password_Hash` varchar(255) DEFAULT NULL,
  `Email_Verificado` tinyint(1) NOT NULL DEFAULT 0,
  `Token_Verificacion` varchar(255) DEFAULT NULL,
  `Fec_Ultimo_Acceso` datetime DEFAULT NULL,
  `Usu_Tel_Cli` varchar(100) DEFAULT NULL,
  `Pai_Cli` varchar(100) DEFAULT 'Ecuador',
  `Doc_Cli` varchar(50) DEFAULT NULL,
  `Origen_Cli` enum('whatsapp','ecommerce','manual') NOT NULL DEFAULT 'manual',
  `Dir_Cli` text DEFAULT NULL,
  `Tip_Cli` varchar(30) DEFAULT 'persona',
  `Cat_Cli` enum('nuevo','ocasional','frecuente','vip') DEFAULT 'nuevo',
  `Pre_Con_Cli` enum('whatsapp','email','instagram','messenger','telegram') DEFAULT 'whatsapp',
  `Ace_Not_Tel_Cli` tinyint(1) DEFAULT 1,
  `Ace_Not_Cor_Cli` tinyint(1) DEFAULT 1,
  `Not_Cli` text DEFAULT NULL,
  `Est_Cli` enum('activo','inactivo','suspendido') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Uuid_Cli`),
  UNIQUE KEY `uk_clientes_uuid` (`Uuid_Cli`),
  UNIQUE KEY `uk_clientes_legacy_id` (`Id_Cli`),
  UNIQUE KEY `uk_tel_cli` (`Tel_Cli`),
  UNIQUE KEY `uq_clientes_auth_user` (`Auth_User_Id`),
  KEY `idx_nom_cli` (`Nom_Cli`,`Ape_Cli`),
  KEY `idx_tel_cli` (`Tel_Cli`),
  KEY `idx_ema_cli` (`Ema_Cli`),
  CONSTRAINT `fk_clientes_auth_user_id` FOREIGN KEY (`Auth_User_Id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (12,'a213ca1c-74b7-11f1-8553-04ea567da7c0','Aaron','Perkinsin','50763105362','aaronperkinson@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(13,'a213e7e6-74b7-11f1-8553-04ea567da7c0','Abigail','Tuston','593987078337','abby.tuston@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(14,'a213e9a7-74b7-11f1-8553-04ea567da7c0','Adrian','Mero','593960283551','hola@lobulo.ec',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(15,'a213eaf5-74b7-11f1-8553-04ea567da7c0','Adrian','Orozco','593999795668','rainafterpainn@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 15:04:54'),(16,'a213ec06-74b7-11f1-8553-04ea567da7c0','Alejandro','Campos','593982047963','buyaccesories2@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(17,'a213ed04-74b7-11f1-8553-04ea567da7c0','Alesso',NULL,'593996798621','alessandroosmar.sanchezmacias@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(18,'a213edc9-74b7-11f1-8553-04ea567da7c0','Alex','Quinche','593995581013','alexquinche810@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(19,'a213ee7e-74b7-11f1-8553-04ea567da7c0','Alexander','Villamar','593968951625','alexinusa2911@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(20,'a213ef2f-74b7-11f1-8553-04ea567da7c0','Amazonia','Ec','593984669911','ego.amazonia@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(21,'a213efe8-74b7-11f1-8553-04ea567da7c0','Andrea','Quinde','593985811723','andreaquinde20@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(22,'a213f095-74b7-11f1-8553-04ea567da7c0','Andres','Pilco','593978896167','locosxlasana@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(23,'a21424df-74b7-11f1-8553-04ea567da7c0','Andrés','Reinoso','593983460995','andres.reinoso.ec@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(24,'a214269a-74b7-11f1-8553-04ea567da7c0','Andrés','Yanez','593963984990','vectorsie7@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(25,'a21427cd-74b7-11f1-8553-04ea567da7c0','Angelo','Ayllon','593962034424','angeloaylloncedeno@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(26,'a21435d3-74b7-11f1-8553-04ea567da7c0','Billy','Cajas','593963105846','bcajas94@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(27,'a2143770-74b7-11f1-8553-04ea567da7c0','Bryan',NULL,'593962992736','bryan.alex1996@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(28,'a2143872-74b7-11f1-8553-04ea567da7c0','Bryan','Flores','593999139775','bricardoxd96@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(29,'a214394d-74b7-11f1-8553-04ea567da7c0','Bryan','Ortiz','593963715869','ricardo.oh2001@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(30,'a2143a25-74b7-11f1-8553-04ea567da7c0','Bryan',NULL,'593984274379','bryanad2026@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(31,'a2143af7-74b7-11f1-8553-04ea567da7c0','Bryan','Sango','593963461506','bryansango.1997@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(32,'a2143bc4-74b7-11f1-8553-04ea567da7c0','Carlos','Gualacata','593939650322','identikaec@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(33,'a2143c97-74b7-11f1-8553-04ea567da7c0','Carlos','Urgieles','593979037652','licurgiles@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(34,'a2143d6d-74b7-11f1-8553-04ea567da7c0','Carlos','Aranda','5218712406472','carandam57@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(35,'a2143e41-74b7-11f1-8553-04ea567da7c0','Carlos','Clavijo','593990800738','carlospatricioclavijo@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(36,'a2143fd4-74b7-11f1-8553-04ea567da7c0','Carlos','Enríquez','593989833272','carlosconsorcioec@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(37,'a21440c6-74b7-11f1-8553-04ea567da7c0','Carlos','Mendez','593995774404','carlosdaniel.mendezcrespo15@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(38,'a2144735-74b7-11f1-8553-04ea567da7c0','Christian','Muñoz','593988436139','kinghoststudio@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(39,'a214481d-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593969452362','thebignoslen@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(40,'a21448f0-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593990809901','edilove257@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(41,'a21449c3-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593962210777','aotoristudiodesing@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(42,'a2144a93-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593983491843','asminerayambientaljcr@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(43,'a2144b63-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593959891648','rodriguezlainezpeter@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(44,'a2144c2f-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593985696766','amayorga@andoarq.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(45,'a2144cfd-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593998110899','nanguieta@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(46,'a2145366-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593961778447','arleve1320@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(47,'a2145445-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593995244996','echangzarate@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(48,'a2145513-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593981192585','dpilamungac@unemi.edu.ec',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(49,'a214573e-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593964164069','cuentaadobe30qw@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(50,'a2145847-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593997809625','criptoprimero120@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(51,'a214596c-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593998315630','rydancr@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(52,'a2146070-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593962761671','adalgoti@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(53,'a214615e-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593969365510','wach_uno@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(54,'a2146231-74b7-11f1-8553-04ea567da7c0','Cliente',NULL,'593986457060','alfrredocarvajal@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(55,'a21462fd-74b7-11f1-8553-04ea567da7c0','Geovanny','Brito','593984268359','geovafercho123@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(56,'a214c5ab-74b7-11f1-8553-04ea567da7c0','Copycenter','Connect','593995617391','mrojas@ecsoporte.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(57,'a214c7fa-74b7-11f1-8553-04ea567da7c0','Cristian','Lopez','593997383057','turisteandoconelchris@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(58,'a214c961-74b7-11f1-8553-04ea567da7c0','Daniel','Mata','593990340743','safecuenta24@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(59,'a214d11f-74b7-11f1-8553-04ea567da7c0','Daniel','Guano','593987273196','dguanoq1011@outlook.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(60,'a214d271-74b7-11f1-8553-04ea567da7c0','Dario','Paredes','593987092143','ruso_dario@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(61,'a214da35-74b7-11f1-8553-04ea567da7c0','Darwin','Pico','593963805772','tiendas.sombreros@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(62,'a214db91-74b7-11f1-8553-04ea567da7c0','Darwin','Lema','593967146550','darwin_lema2025@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(63,'a214e269-74b7-11f1-8553-04ea567da7c0','David','Supe','593993045003','dsupe2@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(64,'a214e8ef-74b7-11f1-8553-04ea567da7c0','David','Romero','593959890638','mrhazelgitah@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(65,'a214f093-74b7-11f1-8553-04ea567da7c0','Dayler','Noboa','593962717999','daylerg8@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','frecuente','whatsapp',0,1,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(66,'a21508a7-74b7-11f1-8553-04ea567da7c0','Diego','Obando','593997624883','dcero84@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(67,'a21509ed-74b7-11f1-8553-04ea567da7c0','Diego','Chacho','593963179762','orangefb@icloud.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(68,'a2150af2-74b7-11f1-8553-04ea567da7c0','Dimitri','Duran','593986427317','cue05xtremekey@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(69,'a2150bd0-74b7-11f1-8553-04ea567da7c0','Domenica','Ruiz','593986452166','domenicaruiz554@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(70,'a2150cb3-74b7-11f1-8553-04ea567da7c0','Dou',NULL,'593988132346','daecheverria29@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(71,'a2150dc9-74b7-11f1-8553-04ea567da7c0','Dylan','Cardenas','593998372027','saqra.yaku@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(72,'a2150eb7-74b7-11f1-8553-04ea567da7c0','Edison','Palomo','593998800089','edison1698german@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(73,'a2150f8f-74b7-11f1-8553-04ea567da7c0','Elvis','Campi','593967590511','elvis.campi@educacion.gob.ec',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(74,'a2151068-74b7-11f1-8553-04ea567da7c0','Erick',NULL,'593997442648','esanlucas@yahoo.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(75,'a2151147-74b7-11f1-8553-04ea567da7c0','Evelyn',NULL,'593980775978','resp.cuenta064@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(76,'a2151221-74b7-11f1-8553-04ea567da7c0','Frank',NULL,'5219921022049','franksanchezfonsec@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(77,'a21512f8-74b7-11f1-8553-04ea567da7c0','Franklin','Tapia','593989231521','fgtpia2010@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(78,'a21513cf-74b7-11f1-8553-04ea567da7c0','G','Panameno41','50376856830','g.panameno41@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(79,'a21514ac-74b7-11f1-8553-04ea567da7c0','Gabo',NULL,'593982175599','gaboc1301@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(80,'a2151586-74b7-11f1-8553-04ea567da7c0','Gabriel','Jurado','593962391911','articmonkey210@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(81,'a2151675-74b7-11f1-8553-04ea567da7c0','Gabriel',NULL,'593963215886','gabrielcevallosf@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(82,'a215174c-74b7-11f1-8553-04ea567da7c0','Gabriel','Manjarres','593939913267','gabriel.manjarres.1998@outlook.es',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(83,'a2151832-74b7-11f1-8553-04ea567da7c0','Gabriela','Luje','593984493493','gabyluje0@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(84,'a2151957-74b7-11f1-8553-04ea567da7c0','Geremias','Burgos','593996175190','wbayron@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(85,'a2151b6a-74b7-11f1-8553-04ea567da7c0','Hernadez','Villamar','593962807598','djingtyrone@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(86,'a2151d29-74b7-11f1-8553-04ea567da7c0','Ilades',NULL,'593995476267','munlla2010@icloud.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(87,'a2151e93-74b7-11f1-8553-04ea567da7c0','Israel','Naula','593999964617','israel_naula@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(88,'a2152002-74b7-11f1-8553-04ea567da7c0','Ivan','Maza','593999823378','agenciastratix@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(89,'a2152162-74b7-11f1-8553-04ea567da7c0','Jaime',NULL,'593983545056','cue03xtremekey@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(90,'a21522c5-74b7-11f1-8553-04ea567da7c0','Janes','Masaquiza','593962150075','janesmasaquiza@yahoo.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(91,'a2152426-74b7-11f1-8553-04ea567da7c0','Jeremy','Ortega','593962303679','isaias.jer2007@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(92,'a2152582-74b7-11f1-8553-04ea567da7c0','Jhon','Simbana','593979595923','simbanajhon22@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(93,'a21526d4-74b7-11f1-8553-04ea567da7c0','Jhon','Macias','593960181040','jhonkarpedia9@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(94,'a2152835-74b7-11f1-8553-04ea567da7c0','Jhon','Encalada','593939242994','jmencalada@istdabloja.edu.ec',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(95,'a215298f-74b7-11f1-8553-04ea567da7c0','Jhonatan','Cardona','50768048602','xtremeservicio002@xtremekey.shop',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(96,'a2152aed-74b7-11f1-8553-04ea567da7c0','Jhoossu',NULL,'593997066102','loyolac1@unemi.edu.ec',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(97,'a2152c45-74b7-11f1-8553-04ea567da7c0','Jimmy','Rosales','593988898965','jimsoul087@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(98,'a2152dcf-74b7-11f1-8553-04ea567da7c0','Jonathan','Vera','593990569289','ozeanagencia@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(99,'a2152f27-74b7-11f1-8553-04ea567da7c0','Jorge','Burneo','593991970688','jeburneo@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(100,'a215307a-74b7-11f1-8553-04ea567da7c0','Jorge','HernáNdez','593983013269','luisjosee@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(101,'a215328f-74b7-11f1-8553-04ea567da7c0','Jorge','Chalen','593987458288','tinochalen@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(102,'a2153406-74b7-11f1-8553-04ea567da7c0','Jorge','Flores','593981932641','kenzokamallagua@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(103,'a215357d-74b7-11f1-8553-04ea567da7c0','Jose','Antonio','593986995621','ppitogarzon@yahoo.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(104,'a21536eb-74b7-11f1-8553-04ea567da7c0','José','BeltráN','593989648912','jolubelflan@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(105,'a2153857-74b7-11f1-8553-04ea567da7c0','Joseph','Cueva','593980052634','jcueva2@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(106,'a21539c2-74b7-11f1-8553-04ea567da7c0','Josue','Mina','593988745108','tatianalooracosta@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(107,'a2153b2b-74b7-11f1-8553-04ea567da7c0','Juan','ABK','593987712343','asistencia.abkrea04@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(108,'a2153c96-74b7-11f1-8553-04ea567da7c0','Juan','Maldonado','593999881182','juanandresmaldonadoneira@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(109,'a2153e09-74b7-11f1-8553-04ea567da7c0','Juan','Villalba','593993459987','jcv1200@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(110,'a2153f74-74b7-11f1-8553-04ea567da7c0','Juan','Pineda','593995043312','iuanesd@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(111,'a2154117-74b7-11f1-8553-04ea567da7c0','Julio','Portilla','593982463314','danielaportillaxd13@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(112,'a2154215-74b7-11f1-8553-04ea567da7c0','Justin','Minda','593999964297','justin0035m@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(113,'a215430c-74b7-11f1-8553-04ea567da7c0','Karla','Ruiz','593991869903','karlaruiz1907@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(114,'a2154459-74b7-11f1-8553-04ea567da7c0','Kevin','Salazar','593983053825','Businessnigiri@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(115,'a2154551-74b7-11f1-8553-04ea567da7c0','Kevin','Reyes','593997648646','krear.0925@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(116,'a215466a-74b7-11f1-8553-04ea567da7c0','Keyla','Muños','593963776059','festijuegosanimaciones1@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(117,'a2154763-74b7-11f1-8553-04ea567da7c0','Klever','Morales','593995010590','publistudioec@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(118,'a2154857-74b7-11f1-8553-04ea567da7c0','Leonardo',NULL,'5218131593301','co.leonardo.ms@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(119,'a215494f-74b7-11f1-8553-04ea567da7c0','Luis','Aizprúa','593984172690','aizprualuis14061997@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(120,'a2154a65-74b7-11f1-8553-04ea567da7c0','Luis','Hernandez','5215525353112','luishernandez11267@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(121,'a2154b62-74b7-11f1-8553-04ea567da7c0','Luis','Pincay','593959825398','lcr7_@hotmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(122,'a2154c70-74b7-11f1-8553-04ea567da7c0','Luis','Baque','593980000579','luisfelipefilmmaker@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(123,'a2154d6a-74b7-11f1-8553-04ea567da7c0','Madeleine','Orellana','593998682872','cue02xtremekey@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(124,'a2154e95-74b7-11f1-8553-04ea567da7c0','Magaly','Pineda','593987449358','magapro.ec@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(125,'a2154f91-74b7-11f1-8553-04ea567da7c0','Manolo','Vaca','593984897371','trabajosmanolo2@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(126,'a2155087-74b7-11f1-8553-04ea567da7c0','Marco','Rosero','593995610384','marco.rosero2307nuevocanal@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(127,'a215517b-74b7-11f1-8553-04ea567da7c0','Marissa','Alban','593961091840','marissalban19@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(128,'a2155269-74b7-11f1-8553-04ea567da7c0','Mateo','Romero','593978723565','mateo.romero88@icloud.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(129,'a215535a-74b7-11f1-8553-04ea567da7c0','Mauro','Chango','593995755030','xtremeadobe001@xtremekey.shop',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(130,'a215544f-74b7-11f1-8553-04ea567da7c0','Melanie','Cunalata','593983474561','resp.cuenta063@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(131,'a2155547-74b7-11f1-8553-04ea567da7c0','Migue','Barrionuevo','593983845390','siniestros@abtseguros.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(132,'a215563f-74b7-11f1-8553-04ea567da7c0','Naye','Imbago','593984785542','cue04xtremekey@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(133,'a2155735-74b7-11f1-8553-04ea567da7c0','Neotropic',NULL,'593997663669','neotropicexpeditionsmkt@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(134,'a2155849-74b7-11f1-8553-04ea567da7c0','Nicole','Vaca','593995609977','nimijalv03@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(135,'a215593c-74b7-11f1-8553-04ea567da7c0','Renato','Merchan','593996563518','rmerchanm@uoc.edu',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(136,'a2155a33-74b7-11f1-8553-04ea567da7c0','Revendedor',NULL,'593980207382','amaciasvalero@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(137,'a2155b19-74b7-11f1-8553-04ea567da7c0','Revendedor',NULL,'593998798450','christi.heymann@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(138,'a2155cb0-74b7-11f1-8553-04ea567da7c0','Ricardo','Recalde','593993160636','recaldenicolas165@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(139,'a2155dcd-74b7-11f1-8553-04ea567da7c0','Richard',NULL,'593999309827','an.richard99@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(140,'a2155ed5-74b7-11f1-8553-04ea567da7c0','Roberth','PesáNtez','593981404771','seguridadterrac17@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(141,'a2155fd5-74b7-11f1-8553-04ea567da7c0','Rolando','Vizuete','593961575506','erevejota.dfc@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(142,'a21560e5-74b7-11f1-8553-04ea567da7c0','Sari',NULL,'50764282409','sariisarii2708@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(143,'a21566c1-74b7-11f1-8553-04ea567da7c0','Saul','Martinez','593989587077','saulmartinez135@icloud.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(144,'a215681b-74b7-11f1-8553-04ea567da7c0','Sebas','Marcillo','593990302643','Sebasremix44@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','frecuente','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(145,'a21569ad-74b7-11f1-8553-04ea567da7c0','Tatiana','Vasquez','593981677487','tvasquezj25@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(146,'a2156b9f-74b7-11f1-8553-04ea567da7c0','Vladimir','Martinez','593963917379','kevinmarti9182@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(147,'a2156d08-74b7-11f1-8553-04ea567da7c0','Walter','Guachizaca','593986737914','lojanisimaorquesta@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(148,'a2156e1a-74b7-11f1-8553-04ea567da7c0','William','Cartagena','50360409157','wcartagena@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','ocasional','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(149,'a2157006-74b7-11f1-8553-04ea567da7c0','Xiomara','Quinde','593983850124','xquindecantos@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','ocasional','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(150,'a21571b2-74b7-11f1-8553-04ea567da7c0','Yasser',NULL,'593984423477','pandemonioprods@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(151,'a215787c-74b7-11f1-8553-04ea567da7c0','Kevin','Villarroel','593991345508','canvadiseno23@yahoo.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','ocasional','whatsapp',0,0,NULL,'activo','2026-05-12 22:49:39','2026-07-01 14:57:09'),(152,'a2157a05-74b7-11f1-8553-04ea567da7c0','May','Abad','593999906290','xtremeadobe001@xtremekey.shop',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','frecuente','whatsapp',1,1,NULL,'activo','2026-05-12 23:08:53','2026-07-01 14:57:09'),(153,'a2157b6c-74b7-11f1-8553-04ea567da7c0','Pablo','Rodriguez','593999044347','2005pablor@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-12 23:23:26','2026-07-01 14:57:09'),(154,'a2157cd0-74b7-11f1-8553-04ea567da7c0','Pruebas','Personal','593989560069','admin@xtremekey.shop',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-05-15 21:36:54','2026-07-01 14:57:09'),(155,'a2157e42-74b7-11f1-8553-04ea567da7c0','Alexis','Aguilar','593998142215',NULL,NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-06-11 17:13:55','2026-07-01 14:57:09'),(156,'a2157fbc-74b7-11f1-8553-04ea567da7c0','Joseph','Taco','593969790576','filmsjireh@gmail.com',NULL,NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'whatsapp',NULL,'persona','nuevo','whatsapp',1,1,NULL,'activo','2026-06-12 11:38:18','2026-07-01 14:57:09'),(160,'e83b9f06-5b9e-4912-85eb-4efe9c110c8d','Aron','-',NULL,'aronvilla099@gmail.com','eqx7E4pgP30Z3kTjvcu4k1IuAOJTam8i',NULL,0,NULL,NULL,NULL,'Ecuador',NULL,'ecommerce',NULL,'persona','nuevo','whatsapp',0,0,NULL,'activo','2026-07-01 16:47:10','2026-07-01 16:47:10');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compras` (
  `Id_Com` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Pro` int(11) NOT NULL,
  `Fec_Com` datetime DEFAULT current_timestamp(),
  `Sub_Tot_Com` decimal(12,2) NOT NULL,
  `Imp_Tot_Com` decimal(12,2) DEFAULT 0.00,
  `Tot_Com` decimal(12,2) NOT NULL,
  `Met_Pag_Com` varchar(50) DEFAULT NULL,
  `Not_Com` text DEFAULT NULL,
  `Est_Com` enum('pendiente','completada','cancelada') DEFAULT 'pendiente',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Com`),
  KEY `Id_Pro` (`Id_Pro`),
  KEY `idx_fec_com` (`Fec_Com`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,9,'2026-05-12 17:44:00',1.90,0.00,1.90,'Usdt',NULL,'completada','2026-05-12 12:44:53','2026-05-12 12:44:53');
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
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
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Con`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
INSERT INTO `configuracion` VALUES (1,'Xtremekey','Av. Principal 123','+593992706565','admin@xtremekey.shop',NULL,'USD','America/Guayaquil',15.00,0,'2026-04-16 11:30:47','2026-06-15 16:10:11');
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cuentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cuentas` (
  `Id_Cue` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Id_Pro` int(11) DEFAULT NULL,
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
  KEY `Id_Pro` (`Id_Pro`),
  KEY `idx_est_cue` (`Est_Cue`),
  KEY `idx_fec_ven_cue` (`Fec_Ven_Cue`),
  CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `cuentas_ibfk_2` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE SET NULL,
  CONSTRAINT `cuentas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `chk_cuentas_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cuentas` WRITE;
/*!40000 ALTER TABLE `cuentas` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuentas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cupones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cupones` (
  `Id_Cup` int(11) NOT NULL AUTO_INCREMENT,
  `Codigo_Cup` varchar(50) NOT NULL,
  `Descripcion_Cup` text DEFAULT NULL,
  `Tipo_Cup` enum('porcentaje','fijo') DEFAULT 'porcentaje',
  `Monto_Descuento` decimal(10,2) DEFAULT 0.00,
  `Minimo_Carrito` decimal(10,2) DEFAULT 0.00,
  `Maximo_Descuento` decimal(10,2) DEFAULT NULL,
  `Fecha_Desde` datetime NOT NULL,
  `Fecha_Hasta` datetime NOT NULL,
  `Limite_Uso` int(11) DEFAULT NULL,
  `Limite_Uso_Por_Usuario` int(11) DEFAULT 1,
  `Veces_Usado` int(11) DEFAULT 0,
  `Esta_Activo` tinyint(1) DEFAULT 1,
  `Estado_Cup` enum('activo','inactivo','expirado','programado') DEFAULT 'activo',
  `Aplica_A` enum('todos','productos_especificos','categorias_especificas') DEFAULT 'todos',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Cup`),
  UNIQUE KEY `Codigo_Cup` (`Codigo_Cup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
/*!40000 ALTER TABLE `cupones` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `cupones_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cupones_productos` (
  `Id_Cup` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  PRIMARY KEY (`Id_Cup`,`Id_Prd`),
  KEY `idx_cupones_productos_producto` (`Id_Prd`),
  CONSTRAINT `fk_cupones_productos_cupon` FOREIGN KEY (`Id_Cup`) REFERENCES `cupones` (`Id_Cup`) ON DELETE CASCADE,
  CONSTRAINT `fk_cupones_productos_producto` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cupones_productos` WRITE;
/*!40000 ALTER TABLE `cupones_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cupones_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `detalle_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalle_compras` (
  `Id_Dco` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Com` int(11) NOT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Can_Dco` int(11) DEFAULT 1,
  `Pre_Uni_Dco` decimal(12,2) NOT NULL,
  `Sub_Tot_Dco` decimal(12,2) NOT NULL,
  `Not_Dco` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Dco`),
  KEY `Id_Com` (`Id_Com`),
  KEY `Id_Prd` (`Id_Prd`),
  KEY `Id_Var` (`Id_Var`),
  CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`Id_Com`) REFERENCES `compras` (`Id_Com`) ON DELETE CASCADE,
  CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `detalle_compras_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `chk_detalle_compras_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `detalle_compras` WRITE;
/*!40000 ALTER TABLE `detalle_compras` DISABLE KEYS */;
INSERT INTO `detalle_compras` VALUES (1,1,19,31,1,1.90,1.90,NULL,'2026-05-12 12:44:53');
/*!40000 ALTER TABLE `detalle_compras` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `detalle_ventas` WRITE;
/*!40000 ALTER TABLE `detalle_ventas` DISABLE KEYS */;
INSERT INTO `detalle_ventas` VALUES (12,24,15,2,NULL,NULL,NULL,NULL,NULL,2,9.00,0.00,'2026-04-14 00:00:00','2026-05-14 00:00:00',NULL,'activo','2026-05-12 23:05:27','2026-05-12 23:05:27'),(13,25,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-13 00:00:00','2026-05-13 00:00:00',NULL,'activo','2026-05-12 23:07:21','2026-05-12 23:07:21'),(14,26,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-14 00:00:00','2026-05-14 00:00:00',NULL,'activo','2026-05-12 23:09:42','2026-05-12 23:09:42'),(15,27,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-14 00:00:00','2026-05-14 00:00:00',NULL,'activo','2026-05-12 23:10:52','2026-05-12 23:10:52'),(16,28,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-11 00:00:00','2026-05-11 00:00:00',NULL,'activo','2026-05-12 23:14:00','2026-05-12 23:14:00'),(17,29,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-11 00:00:00','2026-05-11 00:00:00',NULL,'activo','2026-05-12 23:16:38','2026-05-12 23:16:38'),(18,30,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-04-10 00:00:00','2026-05-10 00:00:00',NULL,'activo','2026-05-12 23:18:50','2026-05-12 23:18:50'),(19,31,15,26,NULL,NULL,NULL,NULL,NULL,1,26.00,0.00,'2026-05-12 00:00:00','2026-08-12 00:00:00',NULL,'activo','2026-05-12 23:20:29','2026-05-12 23:20:29'),(20,32,15,26,NULL,NULL,NULL,NULL,NULL,1,26.00,0.00,'2026-02-09 00:00:00','2026-05-09 00:00:00',NULL,'activo','2026-05-12 23:28:18','2026-05-12 23:28:18'),(21,33,21,32,NULL,NULL,NULL,NULL,NULL,1,4.00,0.00,'2026-04-17 00:00:00','2026-05-17 00:00:00',NULL,'activo','2026-05-12 23:32:41','2026-05-12 23:32:41'),(23,35,15,26,NULL,NULL,NULL,NULL,NULL,1,26.00,0.00,'2026-02-18 00:00:00','2026-05-18 00:00:00',NULL,'activo','2026-05-13 00:06:34','2026-05-13 00:06:34'),(24,36,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-05-14 00:00:00','2026-06-14 00:00:00',NULL,'activo','2026-05-14 19:52:10','2026-05-14 19:52:10'),(26,38,15,2,NULL,NULL,NULL,NULL,NULL,1,9.00,0.00,'2026-06-09 00:00:00','2026-07-09 00:00:00',NULL,'activo','2026-06-09 11:15:17','2026-06-12 12:08:34'),(29,41,15,2,NULL,NULL,NULL,'bricardoxd96@gmail.com',NULL,1,9.00,0.00,'2026-06-09 00:00:00','2026-07-09 00:00:00',NULL,'activo','2026-06-09 18:51:17','2026-06-09 18:51:17'),(30,42,15,2,NULL,NULL,NULL,'guederlyngstudio@gmail.com',NULL,1,6.00,0.00,'2026-06-10 00:00:00','2026-07-10 00:00:00',NULL,'activo','2026-06-09 19:04:33','2026-06-09 19:04:33'),(31,43,15,26,NULL,NULL,NULL,'luisfelipefilmmaker@gmail.com','Adobe.360@22',1,30.00,0.00,'2026-06-09 00:00:00','2026-09-09 00:00:00',NULL,'activo','2026-06-09 19:39:26','2026-06-09 22:50:35'),(32,44,16,6,NULL,NULL,NULL,'Pabloxavier1974@gmail.com',NULL,1,3.00,0.00,'2026-06-09 00:00:00','2027-06-09 00:00:00',NULL,'activo','2026-06-09 20:30:37','2026-06-09 22:48:06'),(38,50,21,32,NULL,NULL,NULL,'xtremeservicio001@xtremekey.shop',NULL,1,5.00,0.00,'2026-06-10 10:01:00','2026-07-10 10:01:00',NULL,'activo','2026-06-10 10:01:50','2026-06-10 10:01:50'),(39,51,15,25,NULL,NULL,NULL,'cynthiaguilar01@outlook.com','Purple.03#',1,45.00,0.00,'2026-06-11 17:13:00','2026-12-11 17:13:00',NULL,'activo','2026-06-11 17:14:23','2026-06-11 17:14:23'),(40,52,15,26,NULL,NULL,NULL,'bryansango.1997@gmail.com','Adobe.445@',1,30.00,0.00,'2026-06-10 11:32:00','2026-09-10 11:32:00',NULL,'activo','2026-06-12 11:33:02','2026-06-12 11:33:02'),(41,53,15,2,NULL,NULL,NULL,'filmsjireh@gmail.com',NULL,1,9.00,0.00,'2026-06-11 11:36:00','2026-07-11 11:36:00',NULL,'activo','2026-06-12 11:43:33','2026-06-12 11:43:33'),(42,54,19,23,NULL,NULL,NULL,'nafstoryec@gmail.com','nafstoryec432',1,6.00,0.00,'2026-06-12 11:55:00','2026-07-12 11:55:00',NULL,'activo','2026-06-12 11:56:38','2026-06-12 11:56:38'),(43,55,15,3,NULL,NULL,NULL,'jhonkarpedia9@gmail.com',NULL,1,20.00,0.00,'2026-06-12 12:19:00','2026-09-12 12:19:00',NULL,'activo','2026-06-12 12:21:00','2026-06-12 12:21:00'),(44,56,23,36,NULL,NULL,NULL,'gariya49@vodich1.com','Giare@123',1,30.00,0.00,'2026-06-10 12:28:00','2026-09-10 12:28:00',NULL,'activo','2026-06-12 12:29:21','2026-06-12 12:29:21'),(45,57,15,3,NULL,NULL,NULL,'elvis.campi@educacion.gob.ec',NULL,1,20.00,0.00,'2026-06-13 11:06:00','2026-09-13 11:06:00',NULL,'activo','2026-06-15 11:07:00','2026-06-15 11:07:00'),(46,58,18,37,NULL,NULL,NULL,'aeim4671@outlook.com','Wmriu0510',1,25.00,0.00,'2026-06-13 11:09:00','2027-06-13 11:09:00',NULL,'activo','2026-06-15 11:10:45','2026-06-15 11:10:45');
/*!40000 ALTER TABLE `detalle_ventas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `gastos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gastos` (
  `Id_Gas` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Gas` varchar(150) NOT NULL,
  `Des_Gas` text DEFAULT NULL,
  `Cat_Gas` enum('operativo','administrativo','marketing','proveedor','impuesto','otro') DEFAULT 'operativo',
  `Mon_Gas` decimal(12,2) NOT NULL,
  `Fec_Gas` date NOT NULL,
  `Id_Pro` int(11) DEFAULT NULL,
  `Id_Com` int(11) DEFAULT NULL,
  `Com_Gas` varchar(255) DEFAULT NULL,
  `Est_Gas` enum('registrado','pagado','cancelado') DEFAULT 'registrado',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Gas`),
  KEY `Id_Pro` (`Id_Pro`),
  KEY `Id_Com` (`Id_Com`),
  KEY `idx_fec_gas` (`Fec_Gas`),
  KEY `idx_cat_gas` (`Cat_Gas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `gastos` WRITE;
/*!40000 ALTER TABLE `gastos` DISABLE KEYS */;
/*!40000 ALTER TABLE `gastos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `imagenes_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `imagenes_productos` (
  `Id_Ima` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) NOT NULL,
  `Url_Ima` varchar(500) NOT NULL,
  `Texto_Alt` varchar(255) DEFAULT NULL,
  `Orden` int(11) DEFAULT 0,
  `Es_Primaria` tinyint(1) DEFAULT 0,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Ima`),
  KEY `idx_imagen_producto` (`Id_Prd`),
  CONSTRAINT `fk_imagenes_productos_producto` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `imagenes_productos` WRITE;
/*!40000 ALTER TABLE `imagenes_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagenes_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `items_orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items_orden` (
  `Id_Item_Ord` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Ord` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Id_Key` int(11) DEFAULT NULL,
  `Id_Cue` int(11) DEFAULT NULL,
  `Nombre_Prd` varchar(150) NOT NULL,
  `Nombre_Var` varchar(100) DEFAULT NULL,
  `Precio_Unitario` decimal(10,2) NOT NULL,
  `Cantidad` int(11) DEFAULT 1,
  `Precio_Total` decimal(10,2) NOT NULL,
  `Descuento_Item` decimal(10,2) DEFAULT 0.00,
  `Clave_Licencia` text DEFAULT NULL,
  `Correo_Asociado` varchar(150) DEFAULT NULL,
  `Contrasena_Asociada` varchar(255) DEFAULT NULL,
  `Fec_Ini_Licencia` datetime DEFAULT NULL,
  `Fec_Fin_Licencia` datetime DEFAULT NULL,
  `Estado_Item` enum('pendiente','entregado','cancelado') DEFAULT 'pendiente',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Item_Ord`),
  KEY `idx_item_orden` (`Id_Ord`),
  KEY `idx_item_producto` (`Id_Prd`),
  KEY `idx_item_variante` (`Id_Var`),
  KEY `idx_item_key` (`Id_Key`),
  KEY `idx_item_cuenta` (`Id_Cue`),
  CONSTRAINT `fk_items_orden_cuenta` FOREIGN KEY (`Id_Cue`) REFERENCES `cuentas` (`Id_Cue`) ON DELETE SET NULL,
  CONSTRAINT `fk_items_orden_key` FOREIGN KEY (`Id_Key`) REFERENCES `keys_productos` (`Id_Key`) ON DELETE SET NULL,
  CONSTRAINT `fk_items_orden_orden` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_orden_producto` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `fk_items_orden_variante` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `items_orden` WRITE;
/*!40000 ALTER TABLE `items_orden` DISABLE KEYS */;
/*!40000 ALTER TABLE `items_orden` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `keys_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keys_productos` (
  `Id_Key` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Id_Pro` int(11) DEFAULT NULL,
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
  KEY `Id_Pro` (`Id_Pro`),
  KEY `Id_Var` (`Id_Var`),
  KEY `idx_est_key` (`Est_Key`),
  KEY `idx_fec_ven_key` (`Fec_Ven_Key`),
  KEY `idx_id_prd_key` (`Id_Prd`),
  CONSTRAINT `keys_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `keys_productos_ibfk_2` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE SET NULL,
  CONSTRAINT `keys_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `chk_keys_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `keys_productos` WRITE;
/*!40000 ALTER TABLE `keys_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `keys_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `lista_deseos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lista_deseos` (
  `Id_Des` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cli` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Des`),
  UNIQUE KEY `uk_lista_deseos_cliente_producto` (`Id_Cli`,`Id_Prd`),
  KEY `idx_lista_deseos_producto` (`Id_Prd`),
  CONSTRAINT `fk_lista_deseos_cliente` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE CASCADE,
  CONSTRAINT `fk_lista_deseos_producto` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `lista_deseos` WRITE;
/*!40000 ALTER TABLE `lista_deseos` DISABLE KEYS */;
/*!40000 ALTER TABLE `lista_deseos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificaciones` (
  `Id_Not` int(11) NOT NULL AUTO_INCREMENT,
  `Tipo_Not` enum('nuevo_pedido','pago','stock_bajo','sistema') NOT NULL,
  `Titulo_Not` varchar(200) NOT NULL,
  `Mensaje_Not` text NOT NULL,
  `Datos_Not` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Datos_Not`)),
  `Leida` tinyint(1) DEFAULT 0,
  `Fecha_Lectura` datetime DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Not`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ordenes` (
  `Id_Ord` int(11) NOT NULL AUTO_INCREMENT,
  `Numero_Ord` varchar(50) NOT NULL,
  `Id_Cli` int(11) DEFAULT NULL,
  `Email_Invitado` varchar(150) DEFAULT NULL,
  `Estado_Ord` enum('pendiente','pagada','completada','cancelada','reembolsada') DEFAULT 'pendiente',
  `Estado_Pago` enum('pendiente','pagado','fallido','reembolsado','parcial') DEFAULT 'pendiente',
  `Moneda` varchar(10) DEFAULT 'USD',
  `Subtotal` decimal(10,2) NOT NULL,
  `Descuento` decimal(10,2) DEFAULT 0.00,
  `Total` decimal(10,2) NOT NULL,
  `Id_Cupon` int(11) DEFAULT NULL,
  `Codigo_Cupon` varchar(50) DEFAULT NULL,
  `Notas_Cliente` text DEFAULT NULL,
  `Notas_Internas` text DEFAULT NULL,
  `Metadatos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Metadatos`)),
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Ord`),
  UNIQUE KEY `Numero_Ord` (`Numero_Ord`),
  KEY `idx_orden_cliente` (`Id_Cli`),
  CONSTRAINT `fk_ordenes_cliente` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagos` (
  `Id_Pag` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Ord` int(11) NOT NULL,
  `Metodo_Pago` enum('tarjeta','paypal','cripto','transferencia') NOT NULL,
  `Proveedor_Pago` varchar(50) DEFAULT 'stripe',
  `Monto` decimal(10,2) NOT NULL,
  `Moneda` varchar(10) DEFAULT 'USD',
  `Estado_Pago_Prov` varchar(50) DEFAULT 'pendiente',
  `Id_Transaccion` varchar(255) DEFAULT NULL,
  `Stripe_PaymentIntent_Id` varchar(255) DEFAULT NULL,
  `Metadatos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Metadatos`)),
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Pag`),
  KEY `idx_pago_orden` (`Id_Ord`),
  CONSTRAINT `fk_pagos_orden` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
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
  `Slug_Prd` varchar(200) DEFAULT NULL,
  `Des_Prd` text DEFAULT NULL,
  `Des_Cor_Prd` varchar(255) DEFAULT NULL,
  `Precio_Venta` decimal(10,2) DEFAULT NULL,
  `Precio_Regular` decimal(10,2) DEFAULT NULL,
  `Id_Cat` int(11) DEFAULT NULL,
  `Tip_Prd` enum('servicio','producto','suscripcion') DEFAULT 'producto',
  `Ima_Prd` varchar(255) DEFAULT NULL,
  `Est_Prd` enum('activo','inactivo','agotado') DEFAULT 'activo',
  `Estado_Tienda` enum('borrador','activo','archivado') DEFAULT 'activo',
  `Es_Destacado` tinyint(1) NOT NULL DEFAULT 0,
  `Meta_Titulo` varchar(200) DEFAULT NULL,
  `Meta_Descripcion` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Prd`),
  UNIQUE KEY `Cod_Prd` (`Cod_Prd`),
  UNIQUE KEY `uk_slug_prd` (`Slug_Prd`),
  KEY `Id_Cat` (`Id_Cat`),
  KEY `idx_nom_prd` (`Nom_Prd`),
  KEY `idx_est_prd` (`Est_Prd`),
  KEY `idx_estado_tienda_prd` (`Estado_Tienda`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_Cat`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (15,NULL,'Adobe Creative 2026',NULL,NULL,'Paquete con +20 aplicaciones profesionales',NULL,NULL,9,'suscripcion','/uploads/productos/producto-1782856598416-683447582.svg','activo','activo',0,NULL,NULL,'2026-04-18 01:42:26','2026-06-30 16:56:38'),(16,NULL,'Canva',NULL,NULL,'Canva Pro versión Educativa',NULL,NULL,12,'suscripcion','/uploads/productos/producto-1782856557778-325777738.svg','activo','activo',0,NULL,NULL,'2026-04-21 10:14:35','2026-06-30 16:55:57'),(17,NULL,'Capcut',NULL,NULL,'Capcut Pro',NULL,NULL,11,'suscripcion','/uploads/productos/producto-1782856916394-821364214.svg','activo','activo',0,NULL,NULL,'2026-04-21 10:27:13','2026-06-30 17:01:56'),(18,NULL,'Microsoft 365',NULL,NULL,'Office 365',NULL,NULL,14,'suscripcion','/uploads/productos/producto-1782857610459-773944785.svg','activo','activo',0,NULL,NULL,'2026-04-21 10:27:58','2026-06-30 17:13:48'),(19,NULL,'Panel de Descargas',NULL,NULL,'Panel de Descargas Filecip',NULL,NULL,15,'suscripcion','/uploads/productos/producto-1782857060507-907534145.png','activo','activo',0,NULL,NULL,'2026-04-21 12:58:14','2026-06-30 17:04:20'),(20,NULL,'Windows 11 Pro',NULL,NULL,'Key de Windows 11 Pro',NULL,NULL,14,'producto','/uploads/productos/producto-1782856465107-786264957.svg','activo','activo',0,NULL,NULL,'2026-05-10 13:10:21','2026-06-30 16:54:25'),(21,NULL,'Perplexity Pro',NULL,NULL,NULL,NULL,NULL,10,'suscripcion','/uploads/productos/producto-1782856446629-586673172.svg','activo','activo',0,NULL,NULL,'2026-05-12 23:30:00','2026-06-30 16:54:06'),(22,NULL,'Autodesk',NULL,NULL,'Suite de Autodesk o Aplicación individual',NULL,NULL,13,'suscripcion','/uploads/productos/producto-1782856831599-83590974.svg','activo','activo',0,NULL,NULL,'2026-05-17 01:16:01','2026-06-30 17:00:31'),(23,NULL,'Grok',NULL,NULL,'Grok IA',NULL,NULL,10,'suscripcion','/uploads/productos/producto-1782856192347-786454583.svg','activo','activo',0,NULL,NULL,'2026-06-10 11:48:25','2026-06-30 16:49:52');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedores` (
  `Id_Pro` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Pro` varchar(150) NOT NULL,
  `Tip_Pro` enum('persona','empresa','plataforma','tienda_web','otro') DEFAULT 'empresa',
  `Con_Pri_Pro` varchar(100) DEFAULT NULL,
  `Tel_Pro` varchar(20) DEFAULT NULL,
  `Wha_Pro` varchar(20) DEFAULT NULL,
  `Ema_Pro` varchar(100) DEFAULT NULL,
  `Tel_Gram_Pro` varchar(100) DEFAULT NULL,
  `Web_Pro` varchar(200) DEFAULT NULL,
  `Pai_Pro` varchar(100) DEFAULT NULL,
  `Med_Con_Pro` enum('whatsapp','telegram','web','email','telefono') DEFAULT 'whatsapp',
  `Con_Com_Pro` text DEFAULT NULL,
  `Cal_Pro` int(11) DEFAULT 5,
  `Not_Pro` text DEFAULT NULL,
  `Est_Pro` enum('activo','inactivo','suspendido') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Pro`),
  KEY `idx_nom_pro` (`Nom_Pro`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (8,'Luffy Store','empresa','adobe-@TheSmilingcat_01-E',NULL,NULL,NULL,'@reselleradobeyoga',NULL,NULL,'telegram',NULL,5,NULL,'activo','2026-04-17 19:48:50','2026-04-17 19:48:50'),(9,'Digiupsell','persona','Digiupsell',NULL,NULL,NULL,'@proacco',NULL,NULL,'telegram',NULL,5,NULL,'activo','2026-04-17 19:50:23','2026-04-17 19:50:23'),(11,'vstore','empresa','vstore ⋆˙| premiumsHost',NULL,NULL,NULL,'@venuezstore',NULL,NULL,'telegram',NULL,5,NULL,'activo','2026-04-17 19:51:57','2026-04-17 19:51:57'),(12,'G2G','tienda_web','https://www.g2g.com',NULL,NULL,NULL,NULL,'https://www.g2g.com',NULL,'web',NULL,5,NULL,'activo','2026-05-12 21:57:02','2026-05-12 21:57:12');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `proveedores_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedores_productos` (
  `Id_Pro_Prd` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Pro` int(11) NOT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Pre_Com_Pro_Prd` decimal(12,2) DEFAULT NULL,
  `Es_Pri_Pro_Prd` tinyint(1) DEFAULT 0,
  `Not_Pro_Prd` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Pro_Prd`),
  UNIQUE KEY `uk_pro_prd` (`Id_Pro`,`Id_Prd`,`Id_Var`),
  KEY `Id_Prd` (`Id_Prd`),
  KEY `Id_Var` (`Id_Var`),
  CONSTRAINT `proveedores_productos_ibfk_1` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE CASCADE,
  CONSTRAINT `proveedores_productos_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE,
  CONSTRAINT `proveedores_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE CASCADE,
  CONSTRAINT `chk_proveedores_productos_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `proveedores_productos` WRITE;
/*!40000 ALTER TABLE `proveedores_productos` DISABLE KEYS */;
INSERT INTO `proveedores_productos` VALUES (1,9,19,NULL,NULL,1,NULL,'2026-05-12 12:43:57');
/*!40000 ALTER TABLE `proveedores_productos` ENABLE KEYS */;
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
DROP TABLE IF EXISTS `renovaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `renovaciones` (
  `Id_Ren` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Dve_Ori` int(11) NOT NULL,
  `Id_Dve_Nue` int(11) DEFAULT NULL,
  `Id_Cli` int(11) NOT NULL,
  `Uuid_Cli` char(36) DEFAULT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Fec_Ven_Ant_Ren` date NOT NULL,
  `Fec_Ini_Nue_Ren` date DEFAULT NULL,
  `Fec_Fin_Nue_Ren` date DEFAULT NULL,
  `Pre_Ori_Ren` decimal(12,2) DEFAULT NULL,
  `Pre_Ren` decimal(12,2) DEFAULT NULL,
  `Des_Ren` decimal(12,2) DEFAULT 0.00,
  `Tip_Ren` enum('automatica','manual','anticipada') DEFAULT 'manual',
  `Est_Ren` enum('pendiente','completada','rechazada','expirada') DEFAULT 'pendiente',
  `Not_Ren` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Ren`),
  KEY `Id_Dve_Ori` (`Id_Dve_Ori`),
  KEY `Id_Dve_Nue` (`Id_Dve_Nue`),
  KEY `Id_Cli` (`Id_Cli`),
  KEY `Id_Prd` (`Id_Prd`),
  KEY `Id_Var` (`Id_Var`),
  KEY `idx_fec_ven_ant_ren` (`Fec_Ven_Ant_Ren`),
  KEY `idx_est_ren` (`Est_Ren`),
  KEY `idx_renovaciones_uuid_cli` (`Uuid_Cli`),
  CONSTRAINT `fk_renovaciones_uuid_cli` FOREIGN KEY (`Uuid_Cli`) REFERENCES `clientes` (`Uuid_Cli`) ON UPDATE CASCADE,
  CONSTRAINT `renovaciones_ibfk_1` FOREIGN KEY (`Id_Dve_Ori`) REFERENCES `detalle_ventas` (`Id_Dve`),
  CONSTRAINT `renovaciones_ibfk_2` FOREIGN KEY (`Id_Dve_Nue`) REFERENCES `detalle_ventas` (`Id_Dve`) ON DELETE SET NULL,
  CONSTRAINT `renovaciones_ibfk_3` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `renovaciones_ibfk_4` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  CONSTRAINT `renovaciones_ibfk_5` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  CONSTRAINT `chk_renovaciones_producto_variante` CHECK (`Id_Prd` is not null or `Id_Var` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `renovaciones` WRITE;
/*!40000 ALTER TABLE `renovaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `renovaciones` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `resenias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resenias` (
  `Id_Res` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cli` int(11) NOT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Ord` int(11) NOT NULL,
  `Id_Item_Ord` int(11) NOT NULL,
  `Calificacion` tinyint(4) NOT NULL CHECK (`Calificacion` between 1 and 5),
  `Titulo_Res` varchar(200) NOT NULL,
  `Comentario_Res` text NOT NULL,
  `Estado_Res` enum('pendiente','aprobada','rechazada') DEFAULT 'aprobada',
  `Votos_Utiles` int(11) DEFAULT 0,
  `Es_Compra_Verificada` tinyint(1) DEFAULT 1,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Res`),
  KEY `idx_resenia_cliente` (`Id_Cli`),
  KEY `idx_resenia_producto` (`Id_Prd`),
  KEY `idx_resenia_orden` (`Id_Ord`),
  KEY `idx_resenia_item_orden` (`Id_Item_Ord`),
  CONSTRAINT `fk_resenias_cliente` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `fk_resenias_item_orden` FOREIGN KEY (`Id_Item_Ord`) REFERENCES `items_orden` (`Id_Item_Ord`),
  CONSTRAINT `fk_resenias_orden` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`),
  CONSTRAINT `fk_resenias_producto` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `resenias` WRITE;
/*!40000 ALTER TABLE `resenias` DISABLE KEYS */;
/*!40000 ALTER TABLE `resenias` ENABLE KEYS */;
UNLOCK TABLES;
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
INSERT INTO `session` VALUES ('e7InOVy1Gz3wYVGQ85LfhxeNlwuInmWt','2026-07-08 21:43:58.028','sL3XUrOm2HPAuOmp40zpiWxRmwKmNeFk','2026-07-01 21:43:58.028','2026-07-01 21:43:58.028','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('fpKthy8ZyRcmSGoGnTrNTU1w00n516FH','2026-07-08 03:31:50.513','d2oKKocCmkjkd2OV9QN8hLipJ0YwXM8G','2026-07-01 03:31:50.514','2026-07-01 03:31:50.514','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('OFo45moMM04ZdNfrVofGNkND3IoZ5K9u','2026-07-08 21:52:34.765','Eu9JSlznBH6KXMOOPset0PCLpY19ryJv','2026-07-01 21:52:34.765','2026-07-01 21:52:34.765','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL),('uvfeT4g1CPcaeLxmoMvAyspoz0Fn2mOe','2026-07-08 03:10:15.389','oRLK4Mo8qowCCiIvZNvxTIBqG3j5FSCw','2026-07-01 03:10:15.390','2026-07-01 03:10:15.390','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 OPR/132.0.0.0','SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2',NULL);
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
  `Id_Cli` int(11) NOT NULL,
  `Uuid_Cli` char(36) DEFAULT NULL,
  `Id_Prd` int(11) NOT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Fec_Ini_Sus` datetime NOT NULL,
  `Fec_Fin_Sus` datetime DEFAULT NULL,
  `Est_Sus` enum('activa','suspendida','cancelada','expirada') DEFAULT 'activa',
  `Ren_Auto` tinyint(1) DEFAULT 1,
  `Not_Sus` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Sus`),
  KEY `idx_suscripciones_cliente` (`Id_Cli`),
  KEY `idx_suscripciones_producto` (`Id_Prd`),
  KEY `idx_suscripciones_variante` (`Id_Var`),
  KEY `idx_suscripciones_uuid_cli` (`Uuid_Cli`),
  CONSTRAINT `fk_suscripciones_uuid_cli` FOREIGN KEY (`Uuid_Cli`) REFERENCES `clientes` (`Uuid_Cli`) ON UPDATE CASCADE,
  CONSTRAINT `suscripciones_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `suscripciones_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`),
  CONSTRAINT `suscripciones_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `suscripciones` WRITE;
/*!40000 ALTER TABLE `suscripciones` DISABLE KEYS */;
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
  `Uuid_Cli` char(36) DEFAULT NULL,
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
  KEY `idx_tareas_uuid_cli` (`Uuid_Cli`),
  CONSTRAINT `fk_tareas_uuid_cli` FOREIGN KEY (`Uuid_Cli`) REFERENCES `clientes` (`Uuid_Cli`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL,
  CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES (2,'Prueba',NULL,NULL,NULL,NULL,'2026-06-14','media',10,'pendiente',NULL,'2026-05-11 08:30:29','2026-05-17 00:52:49');
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
  `cliente_id` int(11) DEFAULT NULL,
  `banned` tinyint(1) DEFAULT 0,
  `banReason` text DEFAULT NULL,
  `banExpires` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`),
  KEY `idx_user_cliente_id` (`cliente_id`),
  CONSTRAINT `fk_user_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('eqx7E4pgP30Z3kTjvcu4k1IuAOJTam8i','Aron','aronvilla099@gmail.com',0,NULL,'2026-07-01 16:47:09.996','2026-07-01 21:36:26.969','cliente',160,0,NULL,NULL),('SF4tCwLRtvWpqsat55zAV4AZpjhJtwC2','Adrian Romero','pruebas@xtremekey.shop',1,NULL,'2026-06-30 19:12:28.679','2026-06-30 14:12:44.000','admin',NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `uso_cupones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uso_cupones` (
  `Id_Uso` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cup` int(11) NOT NULL,
  `Id_Cli` int(11) NOT NULL,
  `Id_Ord` int(11) DEFAULT NULL,
  `Descuento_Aplicado` decimal(10,2) DEFAULT 0.00,
  `Usado_En` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Uso`),
  KEY `idx_uso_cupon` (`Id_Cup`),
  KEY `idx_uso_cliente` (`Id_Cli`),
  KEY `idx_uso_orden` (`Id_Ord`),
  CONSTRAINT `fk_uso_cupones_cliente` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `fk_uso_cupones_cupon` FOREIGN KEY (`Id_Cup`) REFERENCES `cupones` (`Id_Cup`),
  CONSTRAINT `fk_uso_cupones_orden` FOREIGN KEY (`Id_Ord`) REFERENCES `ordenes` (`Id_Ord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `uso_cupones` WRITE;
/*!40000 ALTER TABLE `uso_cupones` DISABLE KEYS */;
/*!40000 ALTER TABLE `uso_cupones` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `variantes_productos` WRITE;
/*!40000 ALTER TABLE `variantes_productos` DISABLE KEYS */;
INSERT INTO `variantes_productos` VALUES (2,15,'Premium','Activación bajo perfiles de empresa',2.00,9.00,6.00,'meses',1,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\"}','inactivo','2026-04-18 01:43:03','2026-06-29 23:33:44'),(3,15,'Premium','Activación bajo perfiles de empresa',5.00,20.00,15.00,'meses',3,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"1 mes Envato o Freepik\"}','inactivo','2026-04-18 01:54:44','2026-06-29 23:33:39'),(4,15,'Premium','Activación bajo perfiles de empresa',8.00,32.00,28.00,'meses',6,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"1 mes Envato o Freepik\"}','inactivo','2026-04-18 01:56:32','2026-05-10 15:16:15'),(5,15,'Premium','Activación bajo perfiles de empresa',12.00,55.00,42.00,'meses',12,2,1,1,'{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"+3 meses Envato o Freepik + Canva Pro\"}','inactivo','2026-04-18 01:57:36','2026-05-10 15:16:26'),(6,16,'Pro Edu','Canva Pro versión Educativa, No incluye kit de marca',0.00,5.00,3.00,'meses',12,2,1,1,NULL,'activo','2026-04-21 10:16:19','2026-05-10 14:09:05'),(8,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',1.00,4.50,3.00,'meses',1,2,1,1,NULL,'inactivo','2026-04-21 12:06:13','2026-06-15 13:02:40'),(9,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',2.00,12.00,8.00,'meses',3,2,1,1,NULL,'inactivo','2026-04-21 12:07:03','2026-05-10 15:16:42'),(10,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',5.00,22.00,15.00,'meses',6,2,1,1,NULL,'inactivo','2026-04-21 12:07:40','2026-05-10 15:17:00'),(11,17,'Pro Team','Capcut Pro Team, No incluye almacenamiento',10.00,40.00,NULL,'meses',12,2,1,1,NULL,'inactivo','2026-04-21 12:08:07','2026-05-10 15:16:49'),(12,17,'Pro Individual','Capcut Pro Individual, Incluye 1tb de Almacenamiento',9.00,30.00,26.00,'meses',6,2,1,1,NULL,'inactivo','2026-04-21 12:09:00','2026-06-15 13:02:36'),(13,16,'Pro Edu','Canva Pro versión Educativa, No incluye kit de marca',0.00,3.00,2.00,'meses',6,2,1,1,NULL,'activo','2026-04-21 12:10:50','2026-05-10 14:09:21'),(19,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',13.00,32.00,25.00,'dias',365,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:00:39'),(20,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',8.50,18.00,15.00,'dias',180,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:00'),(21,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',5.00,13.00,11.00,'dias',90,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:04'),(22,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',3.00,10.00,7.00,'dias',60,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:13'),(23,19,'Envato','Panel de Descargas de Freepik, Hasta 30 descargas diarias',1.90,6.00,4.20,'dias',30,2,0,1,NULL,'activo','2026-04-21 13:09:52','2026-06-15 13:01:22'),(24,15,'Directo','Pago directo en la web oficial de adobe',35.00,75.00,65.00,'meses',12,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100GB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"bono\":\"+2 meses Envato o Freepik + Canva Pro\"}','inactivo','2026-04-21 13:12:30','2026-06-29 23:34:40'),(25,15,'Directo','Pago directo en la web oficial de adobe',20.00,45.00,35.00,'meses',6,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100GB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"bono\":\"1 mes Envato o Freepik + CanvaPro\"}','inactivo','2026-04-21 13:12:30','2026-06-29 23:34:45'),(26,15,'Directo','Pago directo en la web oficial de adobe',13.00,30.00,25.00,'meses',3,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100gb\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\"}','activo','2026-04-21 13:12:30','2026-06-09 19:38:06'),(27,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',1.90,6.00,4.20,'dias',30,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:29'),(28,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',3.00,10.00,7.00,'dias',60,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:32'),(29,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',5.00,13.00,11.00,'dias',90,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:46'),(30,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',8.50,18.00,15.00,'dias',180,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:49'),(31,19,'Freepik','Panel de Descargas de Freepik, Hasta 30 descargas diarias',13.00,32.00,25.00,'dias',365,2,0,1,NULL,'activo','2026-05-10 18:54:48','2026-06-15 13:01:52'),(32,21,'1 Mes',NULL,0.00,5.00,4.00,'meses',1,NULL,0,1,NULL,'activo','2026-05-12 23:31:02','2026-06-15 13:00:16'),(33,22,'Suite',NULL,0.00,15.00,10.00,'meses',12,NULL,1,1,NULL,'activo','2026-05-17 01:16:33','2026-05-17 01:16:33'),(34,22,'Aplicación Individual',NULL,0.00,8.00,5.00,'meses',12,NULL,1,1,NULL,'activo','2026-05-17 01:17:17','2026-05-17 01:17:17'),(35,23,'SuperGrok',NULL,6.00,12.00,NULL,'meses',1,NULL,1,1,NULL,'activo','2026-06-10 11:49:15','2026-06-10 11:49:15'),(36,23,'SuperGrok',NULL,11.00,30.00,26.00,'meses',3,NULL,1,1,NULL,'activo','2026-06-10 11:49:56','2026-06-10 11:49:56'),(37,18,'Familiar',NULL,6.00,30.00,25.00,'meses',12,NULL,0,1,NULL,'activo','2026-06-15 11:07:59','2026-06-15 13:02:02'),(38,18,'Personal',NULL,1.20,15.00,9.00,'meses',12,NULL,1,1,NULL,'activo','2026-06-15 11:08:59','2026-06-15 11:08:59'),(39,15,'Directo','Pago directo en la web oficial de adobe',5.00,15.00,12.00,'meses',1,2,1,1,'{\"plan\":\"directo\",\"almacenamiento\":\"100gb\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\"}','activo','2026-06-29 23:33:52','2026-06-29 23:34:19');
/*!40000 ALTER TABLE `variantes_productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ventas` (
  `Id_Ven` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Cli` int(11) DEFAULT NULL,
  `Uuid_Cli` char(36) DEFAULT NULL,
  `Auth_User_Id` varchar(36) DEFAULT NULL,
  `Id_Rev` int(11) DEFAULT NULL,
  `Fec_Ven` datetime DEFAULT current_timestamp(),
  `Des_Tot_Ven` decimal(12,2) DEFAULT 0.00,
  `Imp_Tot_Ven` decimal(12,2) DEFAULT 0.00,
  `Tot_Ven` decimal(12,2) NOT NULL,
  `Met_Pag_Ven` varchar(50) DEFAULT NULL,
  `Not_Ven` text DEFAULT NULL,
  `Est_Ven` enum('pendiente','completada','cancelada','reembolsada') DEFAULT 'pendiente',
  `Origen_Ven` enum('ecommerce','whatsapp','manual') NOT NULL DEFAULT 'manual',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`Id_Ven`),
  KEY `Id_Cli` (`Id_Cli`),
  KEY `idx_fec_ven` (`Fec_Ven`),
  KEY `idx_est_ven` (`Est_Ven`),
  KEY `Id_Rev` (`Id_Rev`),
  KEY `idx_ventas_uuid_cli` (`Uuid_Cli`),
  KEY `idx_ventas_auth_user` (`Auth_User_Id`),
  CONSTRAINT `fk_ventas_uuid_cli` FOREIGN KEY (`Uuid_Cli`) REFERENCES `clientes` (`Uuid_Cli`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (24,130,'a215544f-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-11 13:28:00',0.00,0.00,18.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:05:27','2026-07-01 15:00:32'),(25,129,'a215535a-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:05:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:07:21','2026-07-01 15:00:32'),(26,152,'a2157a05-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:07:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:09:42','2026-07-01 15:00:32'),(27,65,'a214f093-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 09:09:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:10:52','2026-07-01 15:00:32'),(28,81,'a2151675-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:10:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:14:00','2026-07-01 15:00:32'),(29,15,'a213eaf5-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:14:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:16:38','2026-07-01 15:00:32'),(30,23,'a21424df-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:16:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:18:50','2026-07-01 15:00:32'),(31,69,'a2150bd0-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:18:00',0.00,0.00,26.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:20:29','2026-07-01 15:00:32'),(32,147,'a2156d08-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 04:20:00',0.00,0.00,26.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:28:18','2026-07-01 15:00:32'),(33,95,'a215298f-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-12 16:45:00',0.00,0.00,4.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-12 23:32:41','2026-07-01 15:00:32'),(35,115,'a2154551-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 05:02:00',0.00,0.00,26.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-13 00:06:34','2026-07-01 15:00:32'),(36,152,'a2157a05-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-05-13 05:06:00',0.00,0.00,9.00,'Tranferencia',NULL,'completada','whatsapp','2026-05-14 19:52:10','2026-07-01 15:00:32'),(38,55,'a21462fd-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-10 12:28:00',0.00,0.00,9.00,'Transferencia',NULL,'completada','whatsapp','2026-06-09 11:15:17','2026-07-01 15:00:32'),(41,28,'a2143872-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-09 23:51:00',0.00,0.00,9.00,'Transferencia',NULL,'completada','whatsapp','2026-06-09 18:51:17','2026-07-01 15:00:32'),(42,NULL,NULL,NULL,2,'2026-06-09 23:07:00',0.00,0.00,6.00,'Transferencia',NULL,'completada','whatsapp','2026-06-09 19:04:33','2026-07-01 15:00:32'),(43,122,'a2154c70-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-09 22:42:00',0.00,0.00,30.00,'Transferencia',NULL,'completada','whatsapp','2026-06-09 19:39:26','2026-07-01 15:00:32'),(44,NULL,NULL,NULL,2,'2026-06-09 22:46:00',0.00,0.00,3.00,'Transferencia',NULL,'completada','whatsapp','2026-06-09 20:30:37','2026-07-01 15:00:32'),(50,57,'a214c7fa-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-10 10:01:00',0.00,0.00,5.00,'Transferencia',NULL,'completada','whatsapp','2026-06-10 10:01:50','2026-07-01 15:00:32'),(51,155,'a2157e42-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-11 17:13:00',0.00,0.00,45.00,'Transferencia',NULL,'completada','whatsapp','2026-06-11 17:14:23','2026-07-01 15:00:32'),(52,31,'a2143af7-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-12 11:32:00',0.00,0.00,30.00,'Transferencia',NULL,'completada','whatsapp','2026-06-12 11:33:02','2026-07-01 15:00:32'),(53,156,'a2157fbc-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-12 11:36:00',0.00,0.00,9.00,'Transferencia',NULL,'completada','whatsapp','2026-06-12 11:43:33','2026-07-01 15:00:32'),(54,55,'a21462fd-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-12 11:55:00',0.00,0.00,6.00,'Transferencia',NULL,'completada','whatsapp','2026-06-12 11:56:38','2026-07-01 15:00:32'),(55,93,'a21526d4-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-12 12:19:00',0.00,0.00,20.00,'Transferencia',NULL,'completada','whatsapp','2026-06-12 12:21:00','2026-07-01 15:00:32'),(56,107,'a2153b2b-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-12 12:28:00',0.00,0.00,30.00,'Transferencia',NULL,'completada','whatsapp','2026-06-12 12:29:21','2026-07-01 15:00:32'),(57,73,'a2150f8f-74b7-11f1-8553-04ea567da7c0',NULL,NULL,'2026-06-13 11:06:00',0.00,0.00,20.00,'Transferencia',NULL,'completada','whatsapp','2026-06-15 11:07:00','2026-07-01 15:00:32'),(58,NULL,NULL,NULL,3,'2026-06-13 11:09:00',0.00,0.00,25.00,'Transferencia',NULL,'completada','whatsapp','2026-06-15 11:10:45','2026-07-01 15:00:32');
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
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

