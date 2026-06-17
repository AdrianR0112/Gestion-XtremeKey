-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-06-2026 a las 03:03:27
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_gestion_xk`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_productos`
--

CREATE TABLE `categorias_productos` (
  `Id_Cat` int(11) NOT NULL,
  `Nom_Cat` varchar(100) NOT NULL,
  `Des_Cat` text DEFAULT NULL,
  `Id_Cat_Pad` int(11) DEFAULT NULL,
  `Ico_Cat` varchar(50) DEFAULT NULL,
  `Ord_Cat` int(11) DEFAULT 0,
  `Est_Cat` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_productos`
--

INSERT INTO `categorias_productos` (`Id_Cat`, `Nom_Cat`, `Des_Cat`, `Id_Cat_Pad`, `Ico_Cat`, `Ord_Cat`, `Est_Cat`, `Fec_Cre`, `Fec_Mod`) VALUES
(9, 'Adobe Creative Cloud', 'Adobe Creative Cloud', NULL, NULL, 1, 'activo', '2026-04-17 20:02:46', '2026-04-17 21:10:19'),
(10, 'Herramientas IA', 'Herramientas IA', NULL, NULL, 2, 'activo', '2026-04-17 20:03:12', '2026-04-17 20:03:12'),
(11, 'Edición de Video', 'Herramientas para Edición de Video', NULL, NULL, 3, 'activo', '2026-04-17 20:03:34', '2026-04-17 20:04:36'),
(12, 'Diseño Gráfico', 'Herramientas para Diseño Gráfico', NULL, NULL, 4, 'activo', '2026-04-17 20:03:48', '2026-04-17 20:04:26'),
(13, 'CAD y Arquitectura', 'Herramientas para CAD y Arquitectura', NULL, NULL, 5, 'activo', '2026-04-17 20:04:08', '2026-04-17 20:04:08'),
(14, 'Productividad', 'Herramientas de Productividad y Oficina', NULL, NULL, 6, 'activo', '2026-04-17 20:05:12', '2026-04-17 20:05:12'),
(15, 'Paneles de Descargas', 'Paneles de Descargas de recursos premium', NULL, NULL, 7, 'activo', '2026-04-17 20:05:36', '2026-04-17 20:05:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `Id_Cli` int(11) NOT NULL,
  `Nom_Cli` varchar(100) DEFAULT NULL,
  `Ape_Cli` varchar(100) DEFAULT NULL,
  `Tel_Cli` varchar(20) NOT NULL,
  `Ema_Cli` varchar(100) DEFAULT NULL,
  `Usu_Tel_Cli` varchar(100) DEFAULT NULL,
  `Pai_Cli` varchar(100) DEFAULT 'Ecuador',
  `Doc_Cli` varchar(50) DEFAULT NULL,
  `Cat_Cli` enum('nuevo','ocasional','frecuente','vip') DEFAULT 'nuevo',
  `Pre_Con_Cli` enum('whatsapp','email','instagram','messenger','telegram') DEFAULT 'whatsapp',
  `Ace_Not_Tel_Cli` tinyint(1) DEFAULT 1,
  `Ace_Not_Cor_Cli` tinyint(1) DEFAULT 1,
  `Not_Cli` text DEFAULT NULL,
  `Est_Cli` enum('activo','inactivo','suspendido') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`Id_Cli`, `Nom_Cli`, `Ape_Cli`, `Tel_Cli`, `Ema_Cli`, `Usu_Tel_Cli`, `Pai_Cli`, `Doc_Cli`, `Cat_Cli`, `Pre_Con_Cli`, `Ace_Not_Tel_Cli`, `Ace_Not_Cor_Cli`, `Not_Cli`, `Est_Cli`, `Fec_Cre`, `Fec_Mod`) VALUES
(12, 'Aaron', 'Perkinsin', '50763105362', 'aaronperkinson@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(13, 'Abigail', 'Tuston', '593987078337', 'abby.tuston@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(14, 'Adrian', 'Mero', '593960283551', 'hola@lobulo.ec', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(15, 'Adrian', 'Orozco', '593999795668', 'rainafterpainn@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(16, 'Alejandro', 'Campos', '593982047963', 'buyaccesories2@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(17, 'Alesso', NULL, '593996798621', 'alessandroosmar.sanchezmacias@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(18, 'Alex', 'Quinche', '593995581013', 'alexquinche810@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(19, 'Alexander', 'Villamar', '593968951625', 'alexinusa2911@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(20, 'Amazonia', 'Ec', '593984669911', 'ego.amazonia@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(21, 'Andrea', 'Quinde', '593985811723', 'andreaquinde20@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(22, 'Andres', 'Pilco', '593978896167', 'locosxlasana@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(23, 'Andrés', 'Reinoso', '593983460995', 'andres.reinoso.ec@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:17:17'),
(24, 'Andrés', 'Yanez', '593963984990', 'vectorsie7@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(25, 'Angelo', 'Ayllon', '593962034424', 'angeloaylloncedeno@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(26, 'Billy', 'Cajas', '593963105846', 'bcajas94@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(27, 'Bryan', NULL, '593962992736', 'bryan.alex1996@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(28, 'Bryan', 'Flores', '593999139775', 'bricardoxd96@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(29, 'Bryan', 'Ortiz', '593963715869', 'ricardo.oh2001@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(30, 'Bryan', NULL, '593984274379', 'bryanad2026@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(31, 'Bryan', 'Sango', '593963461506', 'bryansango.1997@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(32, 'Carlos', 'Gualacata', '593939650322', 'identikaec@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(33, 'Carlos', 'Urgieles', '593979037652', 'licurgiles@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(34, 'Carlos', 'Aranda', '5218712406472', 'carandam57@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(35, 'Carlos', 'Clavijo', '593990800738', 'carlospatricioclavijo@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(36, 'Carlos', 'Enríquez', '593989833272', 'carlosconsorcioec@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(37, 'Carlos', 'Mendez', '593995774404', 'carlosdaniel.mendezcrespo15@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(38, 'Christian', 'Muñoz', '593988436139', 'kinghoststudio@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(39, 'Cliente', NULL, '593969452362', 'thebignoslen@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(40, 'Cliente', NULL, '593990809901', 'edilove257@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(41, 'Cliente', NULL, '593962210777', 'aotoristudiodesing@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(42, 'Cliente', NULL, '593983491843', 'asminerayambientaljcr@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(43, 'Cliente', NULL, '593959891648', 'rodriguezlainezpeter@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(44, 'Cliente', NULL, '593985696766', 'amayorga@andoarq.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(45, 'Cliente', NULL, '593998110899', 'nanguieta@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(46, 'Cliente', NULL, '593961778447', 'arleve1320@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(47, 'Cliente', NULL, '593995244996', 'echangzarate@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(48, 'Cliente', NULL, '593981192585', 'dpilamungac@unemi.edu.ec', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(49, 'Cliente', NULL, '593964164069', 'cuentaadobe30qw@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(50, 'Cliente', NULL, '593997809625', 'criptoprimero120@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(51, 'Cliente', NULL, '593998315630', 'rydancr@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(52, 'Cliente', NULL, '593962761671', 'adalgoti@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(53, 'Cliente', NULL, '593969365510', 'wach_uno@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(54, 'Cliente', NULL, '593986457060', 'alfrredocarvajal@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(55, 'Geovanny', 'Brito', '593984268359', 'geovafercho123@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-06-09 11:15:51'),
(56, 'Copycenter', 'Connect', '593995617391', 'mrojas@ecsoporte.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(57, 'Cristian', 'Lopez', '593997383057', 'turisteandoconelchris@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(58, 'Daniel', 'Mata', '593990340743', 'safecuenta24@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(59, 'Daniel', 'Guano', '593987273196', 'dguanoq1011@outlook.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(60, 'Dario', 'Paredes', '593987092143', 'ruso_dario@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(61, 'Darwin', 'Pico', '593963805772', 'tiendas.sombreros@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(62, 'Darwin', 'Lema', '593967146550', 'darwin_lema2025@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(63, 'David', 'Supe', '593993045003', 'dsupe2@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(64, 'David', 'Romero', '593959890638', 'mrhazelgitah@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(65, 'Dayler', 'Noboa', '593962717999', 'daylerg8@gmail.com', NULL, 'Ecuador', NULL, 'frecuente', 'whatsapp', 0, 1, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:11:50'),
(66, 'Diego', 'Obando', '593997624883', 'dcero84@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(67, 'Diego', 'Chacho', '593963179762', 'orangefb@icloud.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(68, 'Dimitri', 'Duran', '593986427317', 'cue05xtremekey@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(69, 'Domenica', 'Ruiz', '593986452166', 'domenicaruiz554@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(70, 'Dou', NULL, '593988132346', 'daecheverria29@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(71, 'Dylan', 'Cardenas', '593998372027', 'saqra.yaku@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(72, 'Edison', 'Palomo', '593998800089', 'edison1698german@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(73, 'Elvis', 'Campi', '593967590511', 'elvis.campi@educacion.gob.ec', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(74, 'Erick', NULL, '593997442648', 'esanlucas@yahoo.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(75, 'Evelyn', NULL, '593980775978', 'resp.cuenta064@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(76, 'Frank', NULL, '5219921022049', 'franksanchezfonsec@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(77, 'Franklin', 'Tapia', '593989231521', 'fgtpia2010@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(78, 'G', 'Panameno41', '50376856830', 'g.panameno41@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(79, 'Gabo', NULL, '593982175599', 'gaboc1301@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(80, 'Gabriel', 'Jurado', '593962391911', 'articmonkey210@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(81, 'Gabriel', NULL, '593963215886', 'gabrielcevallosf@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(82, 'Gabriel', 'Manjarres', '593939913267', 'gabriel.manjarres.1998@outlook.es', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(83, 'Gabriela', 'Luje', '593984493493', 'gabyluje0@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(84, 'Geremias', 'Burgos', '593996175190', 'wbayron@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(85, 'Hernadez', 'Villamar', '593962807598', 'djingtyrone@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(86, 'Ilades', NULL, '593995476267', 'munlla2010@icloud.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(87, 'Israel', 'Naula', '593999964617', 'israel_naula@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(88, 'Ivan', 'Maza', '593999823378', 'agenciastratix@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(89, 'Jaime', NULL, '593983545056', 'cue03xtremekey@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(90, 'Janes', 'Masaquiza', '593962150075', 'janesmasaquiza@yahoo.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(91, 'Jeremy', 'Ortega', '593962303679', 'isaias.jer2007@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(92, 'Jhon', 'Simbana', '593979595923', 'simbanajhon22@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(93, 'Jhon', 'Macias', '593960181040', 'jhonkarpedia9@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(94, 'Jhon', 'Encalada', '593939242994', 'jmencalada@istdabloja.edu.ec', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(95, 'Jhonatan', 'Cardona', '50768048602', 'xtremeservicio002@xtremekey.shop', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(96, 'Jhoossu', NULL, '593997066102', 'loyolac1@unemi.edu.ec', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(97, 'Jimmy', 'Rosales', '593988898965', 'jimsoul087@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(98, 'Jonathan', 'Vera', '593990569289', 'ozeanagencia@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(99, 'Jorge', 'Burneo', '593991970688', 'jeburneo@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(100, 'Jorge', 'HernáNdez', '593983013269', 'luisjosee@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(101, 'Jorge', 'Chalen', '593987458288', 'tinochalen@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(102, 'Jorge', 'Flores', '593981932641', 'kenzokamallagua@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(103, 'Jose', 'Antonio', '593986995621', 'ppitogarzon@yahoo.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(104, 'José', 'BeltráN', '593989648912', 'jolubelflan@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(105, 'Joseph', 'Cueva', '593980052634', 'jcueva2@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(106, 'Josue', 'Mina', '593988745108', 'tatianalooracosta@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(107, 'Juan', 'ABK', '593987712343', 'asistencia.abkrea04@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(108, 'Juan', 'Maldonado', '593999881182', 'juanandresmaldonadoneira@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(109, 'Juan', 'Villalba', '593993459987', 'jcv1200@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(110, 'Juan', 'Pineda', '593995043312', 'iuanesd@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(111, 'Julio', 'Portilla', '593982463314', 'danielaportillaxd13@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(112, 'Justin', 'Minda', '593999964297', 'justin0035m@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(113, 'Karla', 'Ruiz', '593991869903', 'karlaruiz1907@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(114, 'Kevin', 'Salazar', '593983053825', 'Businessnigiri@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(115, 'Kevin', 'Reyes', '593997648646', 'krear.0925@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(116, 'Keyla', 'Muños', '593963776059', 'festijuegosanimaciones1@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:56:32'),
(117, 'Klever', 'Morales', '593995010590', 'publistudioec@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(118, 'Leonardo', NULL, '5218131593301', 'co.leonardo.ms@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(119, 'Luis', 'Aizprúa', '593984172690', 'aizprualuis14061997@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(120, 'Luis', 'Hernandez', '5215525353112', 'luishernandez11267@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(121, 'Luis', 'Pincay', '593959825398', 'lcr7_@hotmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(122, 'Luis', 'Baque', '593980000579', 'luisfelipefilmmaker@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(123, 'Madeleine', 'Orellana', '593998682872', 'cue02xtremekey@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(124, 'Magaly', 'Pineda', '593987449358', 'magapro.ec@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(125, 'Manolo', 'Vaca', '593984897371', 'trabajosmanolo2@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(126, 'Marco', 'Rosero', '593995610384', 'marco.rosero2307nuevocanal@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(127, 'Marissa', 'Alban', '593961091840', 'marissalban19@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(128, 'Mateo', 'Romero', '593978723565', 'mateo.romero88@icloud.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(129, 'Mauro', 'Chango', '593995755030', 'xtremeadobe001@xtremekey.shop', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(130, 'Melanie', 'Cunalata', '593983474561', 'resp.cuenta063@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(131, 'Migue', 'Barrionuevo', '593983845390', 'siniestros@abtseguros.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(132, 'Naye', 'Imbago', '593984785542', 'cue04xtremekey@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(133, 'Neotropic', NULL, '593997663669', 'neotropicexpeditionsmkt@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(134, 'Nicole', 'Vaca', '593995609977', 'nimijalv03@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(135, 'Renato', 'Merchan', '593996563518', 'rmerchanm@uoc.edu', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(136, 'Revendedor', NULL, '593980207382', 'amaciasvalero@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(137, 'Revendedor', NULL, '593998798450', 'christi.heymann@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(138, 'Ricardo', 'Recalde', '593993160636', 'recaldenicolas165@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(139, 'Richard', NULL, '593999309827', 'an.richard99@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(140, 'Roberth', 'PesáNtez', '593981404771', 'seguridadterrac17@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(141, 'Rolando', 'Vizuete', '593961575506', 'erevejota.dfc@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(142, 'Sari', NULL, '50764282409', 'sariisarii2708@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(143, 'Saul', 'Martinez', '593989587077', 'saulmartinez135@icloud.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(144, 'Sebas', 'Marcillo', '593990302643', 'Sebasremix44@gmail.com', NULL, 'Ecuador', NULL, 'frecuente', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:02:09'),
(145, 'Tatiana', 'Vasquez', '593981677487', 'tvasquezj25@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:01:59'),
(146, 'Vladimir', 'Martinez', '593963917379', 'kevinmarti9182@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(147, 'Walter', 'Guachizaca', '593986737914', 'lojanisimaorquesta@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(148, 'William', 'Cartagena', '50360409157', 'wcartagena@gmail.com', NULL, 'Ecuador', NULL, 'ocasional', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:01:44'),
(149, 'Xiomara', 'Quinde', '593983850124', 'xquindecantos@gmail.com', NULL, 'Ecuador', NULL, 'ocasional', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:01:37'),
(150, 'Yasser', NULL, '593984423477', 'pandemonioprods@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 22:49:39'),
(151, 'Kevin', 'Villarroel', '593991345508', 'canvadiseno23@yahoo.com', NULL, 'Ecuador', NULL, 'ocasional', 'whatsapp', 0, 0, NULL, 'activo', '2026-05-12 22:49:39', '2026-05-12 23:01:28'),
(152, 'May', 'Abad', '593999906290', 'xtremeadobe001@xtremekey.shop', NULL, 'Ecuador', NULL, 'frecuente', 'whatsapp', 1, 1, NULL, 'activo', '2026-05-12 23:08:53', '2026-05-12 23:08:53'),
(153, 'Pablo', 'Rodriguez', '593999044347', '2005pablor@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 1, 1, NULL, 'activo', '2026-05-12 23:23:26', '2026-05-12 23:25:08'),
(154, 'Pruebas', 'Personal', '593989560069', 'admin@xtremekey.shop', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 1, 1, NULL, 'activo', '2026-05-15 21:36:54', '2026-06-15 14:30:40'),
(155, 'Alexis', 'Aguilar', '593998142215', NULL, NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 1, 1, NULL, 'activo', '2026-06-11 17:13:55', '2026-06-11 17:13:55'),
(156, 'Joseph', 'Taco', '593969790576', 'filmsjireh@gmail.com', NULL, 'Ecuador', NULL, 'nuevo', 'whatsapp', 1, 1, NULL, 'activo', '2026-06-12 11:38:18', '2026-06-12 11:44:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `Id_Com` int(11) NOT NULL,
  `Id_Pro` int(11) NOT NULL,
  `Fec_Com` datetime DEFAULT current_timestamp(),
  `Sub_Tot_Com` decimal(12,2) NOT NULL,
  `Imp_Tot_Com` decimal(12,2) DEFAULT 0.00,
  `Tot_Com` decimal(12,2) NOT NULL,
  `Met_Pag_Com` varchar(50) DEFAULT NULL,
  `Not_Com` text DEFAULT NULL,
  `Est_Com` enum('pendiente','completada','cancelada') DEFAULT 'pendiente',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`Id_Com`, `Id_Pro`, `Fec_Com`, `Sub_Tot_Com`, `Imp_Tot_Com`, `Tot_Com`, `Met_Pag_Com`, `Not_Com`, `Est_Com`, `Fec_Cre`, `Fec_Mod`) VALUES
(1, 9, '2026-05-12 17:44:00', 1.90, 0.00, 1.90, 'Usdt', NULL, 'completada', '2026-05-12 12:44:53', '2026-05-12 12:44:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `Id_Con` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`Id_Con`, `Nom_Emp_Con`, `Dir_Con`, `Tel_Con`, `Ema_Con`, `Log_Con`, `Mon_Con`, `Zon_Hor_Con`, `Imp_Con`, `Hab_Imp_Con`, `Fec_Cre`, `Fec_Mod`) VALUES
(1, 'Xtremekey', 'Av. Principal 123', '+593992706565', 'admin@xtremekey.shop', NULL, 'USD', 'America/Guayaquil', 15.00, 0, '2026-04-16 11:30:47', '2026-06-15 16:10:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas`
--

CREATE TABLE `cuentas` (
  `Id_Cue` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `Id_Dco` int(11) NOT NULL,
  `Id_Com` int(11) NOT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Can_Dco` int(11) DEFAULT 1,
  `Pre_Uni_Dco` decimal(12,2) NOT NULL,
  `Sub_Tot_Dco` decimal(12,2) NOT NULL,
  `Not_Dco` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `detalle_compras`
--

INSERT INTO `detalle_compras` (`Id_Dco`, `Id_Com`, `Id_Prd`, `Id_Var`, `Can_Dco`, `Pre_Uni_Dco`, `Sub_Tot_Dco`, `Not_Dco`, `Fec_Cre`) VALUES
(1, 1, 19, 31, 1, 1.90, 1.90, NULL, '2026-05-12 12:44:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `Id_Dve` int(11) NOT NULL,
  `Id_Ven` int(11) NOT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`Id_Dve`, `Id_Ven`, `Id_Prd`, `Id_Var`, `Id_Cue`, `Id_Key`, `Cor_Cue`, `Con_Cue`, `Can_Dve`, `Pre_Uni_Dve`, `Des_Uni_Dve`, `Fec_Ini_Dve`, `Fec_Fin_Dve`, `Not_Dve`, `Est_Dve`, `Fec_Cre`, `Fec_Mod`) VALUES
(12, 24, 15, 2, NULL, NULL, NULL, NULL, 2, 9.00, 0.00, '2026-04-14 00:00:00', '2026-05-14 00:00:00', NULL, 'activo', '2026-05-12 23:05:27', '2026-05-12 23:05:27'),
(13, 25, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-04-13 00:00:00', '2026-05-13 00:00:00', NULL, 'activo', '2026-05-12 23:07:21', '2026-05-12 23:07:21'),
(14, 26, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-04-14 00:00:00', '2026-05-14 00:00:00', NULL, 'activo', '2026-05-12 23:09:42', '2026-05-12 23:09:42'),
(15, 27, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-04-14 00:00:00', '2026-05-14 00:00:00', NULL, 'activo', '2026-05-12 23:10:52', '2026-05-12 23:10:52'),
(16, 28, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-04-11 00:00:00', '2026-05-11 00:00:00', NULL, 'activo', '2026-05-12 23:14:00', '2026-05-12 23:14:00'),
(17, 29, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-04-11 00:00:00', '2026-05-11 00:00:00', NULL, 'activo', '2026-05-12 23:16:38', '2026-05-12 23:16:38'),
(18, 30, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-04-10 00:00:00', '2026-05-10 00:00:00', NULL, 'activo', '2026-05-12 23:18:50', '2026-05-12 23:18:50'),
(19, 31, 15, 26, NULL, NULL, NULL, NULL, 1, 26.00, 0.00, '2026-05-12 00:00:00', '2026-08-12 00:00:00', NULL, 'activo', '2026-05-12 23:20:29', '2026-05-12 23:20:29'),
(20, 32, 15, 26, NULL, NULL, NULL, NULL, 1, 26.00, 0.00, '2026-02-09 00:00:00', '2026-05-09 00:00:00', NULL, 'activo', '2026-05-12 23:28:18', '2026-05-12 23:28:18'),
(21, 33, 21, 32, NULL, NULL, NULL, NULL, 1, 4.00, 0.00, '2026-04-17 00:00:00', '2026-05-17 00:00:00', NULL, 'activo', '2026-05-12 23:32:41', '2026-05-12 23:32:41'),
(23, 35, 15, 26, NULL, NULL, NULL, NULL, 1, 26.00, 0.00, '2026-02-18 00:00:00', '2026-05-18 00:00:00', NULL, 'activo', '2026-05-13 00:06:34', '2026-05-13 00:06:34'),
(24, 36, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-05-14 00:00:00', '2026-06-14 00:00:00', NULL, 'activo', '2026-05-14 19:52:10', '2026-05-14 19:52:10'),
(26, 38, 15, 2, NULL, NULL, NULL, NULL, 1, 9.00, 0.00, '2026-06-09 00:00:00', '2026-07-09 00:00:00', NULL, 'activo', '2026-06-09 11:15:17', '2026-06-12 12:08:34'),
(29, 41, 15, 2, NULL, NULL, 'bricardoxd96@gmail.com', NULL, 1, 9.00, 0.00, '2026-06-09 00:00:00', '2026-07-09 00:00:00', NULL, 'activo', '2026-06-09 18:51:17', '2026-06-09 18:51:17'),
(30, 42, 15, 2, NULL, NULL, 'guederlyngstudio@gmail.com', NULL, 1, 6.00, 0.00, '2026-06-10 00:00:00', '2026-07-10 00:00:00', NULL, 'activo', '2026-06-09 19:04:33', '2026-06-09 19:04:33'),
(31, 43, 15, 26, NULL, NULL, 'luisfelipefilmmaker@gmail.com', 'Adobe.360@22', 1, 30.00, 0.00, '2026-06-09 00:00:00', '2026-09-09 00:00:00', NULL, 'activo', '2026-06-09 19:39:26', '2026-06-09 22:50:35'),
(32, 44, 16, 6, NULL, NULL, 'Pabloxavier1974@gmail.com', NULL, 1, 3.00, 0.00, '2026-06-09 00:00:00', '2027-06-09 00:00:00', NULL, 'activo', '2026-06-09 20:30:37', '2026-06-09 22:48:06'),
(38, 50, 21, 32, NULL, NULL, 'xtremeservicio001@xtremekey.shop', NULL, 1, 5.00, 0.00, '2026-06-10 10:01:00', '2026-07-10 10:01:00', NULL, 'activo', '2026-06-10 10:01:50', '2026-06-10 10:01:50'),
(39, 51, 15, 25, NULL, NULL, 'cynthiaguilar01@outlook.com', 'Purple.03#', 1, 45.00, 0.00, '2026-06-11 17:13:00', '2026-12-11 17:13:00', NULL, 'activo', '2026-06-11 17:14:23', '2026-06-11 17:14:23'),
(40, 52, 15, 26, NULL, NULL, 'bryansango.1997@gmail.com', 'Adobe.445@', 1, 30.00, 0.00, '2026-06-10 11:32:00', '2026-09-10 11:32:00', NULL, 'activo', '2026-06-12 11:33:02', '2026-06-12 11:33:02'),
(41, 53, 15, 2, NULL, NULL, 'filmsjireh@gmail.com', NULL, 1, 9.00, 0.00, '2026-06-11 11:36:00', '2026-07-11 11:36:00', NULL, 'activo', '2026-06-12 11:43:33', '2026-06-12 11:43:33'),
(42, 54, 19, 23, NULL, NULL, 'nafstoryec@gmail.com', 'nafstoryec432', 1, 6.00, 0.00, '2026-06-12 11:55:00', '2026-07-12 11:55:00', NULL, 'activo', '2026-06-12 11:56:38', '2026-06-12 11:56:38'),
(43, 55, 15, 3, NULL, NULL, 'jhonkarpedia9@gmail.com', NULL, 1, 20.00, 0.00, '2026-06-12 12:19:00', '2026-09-12 12:19:00', NULL, 'activo', '2026-06-12 12:21:00', '2026-06-12 12:21:00'),
(44, 56, 23, 36, NULL, NULL, 'gariya49@vodich1.com', 'Giare@123', 1, 30.00, 0.00, '2026-06-10 12:28:00', '2026-09-10 12:28:00', NULL, 'activo', '2026-06-12 12:29:21', '2026-06-12 12:29:21'),
(45, 57, 15, 3, NULL, NULL, 'elvis.campi@educacion.gob.ec', NULL, 1, 20.00, 0.00, '2026-06-13 11:06:00', '2026-09-13 11:06:00', NULL, 'activo', '2026-06-15 11:07:00', '2026-06-15 11:07:00'),
(46, 58, 18, 37, NULL, NULL, 'aeim4671@outlook.com', 'Wmriu0510', 1, 25.00, 0.00, '2026-06-13 11:09:00', '2027-06-13 11:09:00', NULL, 'activo', '2026-06-15 11:10:45', '2026-06-15 11:10:45'),
(47, 59, 18, 38, NULL, NULL, NULL, NULL, 1, 9.99, 0.00, '2026-06-15 14:30:40', '2026-06-18 14:30:40', 'TEST_REMINDER_NORMAL_154', 'activo', '2026-06-15 14:30:40', '2026-06-15 14:30:40'),
(48, 60, 18, 38, NULL, NULL, 'correo-ignorado-prueba@example.com', NULL, 1, 12.99, 0.00, '2026-05-16 14:30:40', '2026-06-15 14:30:40', 'TEST_REMINDER_RESELLER_154', 'activo', '2026-06-15 14:30:40', '2026-06-15 14:30:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `Id_Gas` int(11) NOT NULL,
  `Nom_Gas` varchar(150) NOT NULL,
  `Des_Gas` text DEFAULT NULL,
  `Cat_Gas` enum('operativo','administrativo','marketing','proveedor','impuesto','otro') DEFAULT 'operativo',
  `Mon_Gas` decimal(12,2) NOT NULL,
  `Fec_Gas` date NOT NULL,
  `Id_Pro` int(11) DEFAULT NULL,
  `Id_Com` int(11) DEFAULT NULL,
  `Com_Gas` varchar(255) DEFAULT NULL,
  `Est_Gas` enum('registrado','pagado','cancelado') DEFAULT 'registrado',
  `Fec_Cre` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `keys_productos`
--

CREATE TABLE `keys_productos` (
  `Id_Key` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plantillas_notificacion`
--

CREATE TABLE `plantillas_notificacion` (
  `Id_Pla` int(11) NOT NULL,
  `Nom_Pla` varchar(150) NOT NULL,
  `Tip_Pla` enum('bienvenida','venta','renovacion','vencimiento','recordatorio','personalizado') DEFAULT 'personalizado',
  `Can_Pla` enum('whatsapp','email','sms','push') DEFAULT 'whatsapp',
  `Asu_Pla` varchar(200) DEFAULT NULL,
  `Cue_Pla` text NOT NULL,
  `Var_Pla` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Var_Pla`)),
  `Est_Pla` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `plantillas_notificacion`
--

INSERT INTO `plantillas_notificacion` (`Id_Pla`, `Nom_Pla`, `Tip_Pla`, `Can_Pla`, `Asu_Pla`, `Cue_Pla`, `Var_Pla`, `Est_Pla`, `Fec_Cre`, `Fec_Mod`) VALUES
(1, 'Bienvienida', 'bienvenida', 'email', 'Bienvenido a XtremeKey', 'Gracias por confiar en nosotros. Bienvenid@ a nuestra familia XtremeKey', '{}', 'activo', '2026-05-10 23:58:56', '2026-05-10 23:58:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `Id_Prd` int(11) NOT NULL,
  `Cod_Prd` varchar(50) DEFAULT NULL,
  `Nom_Prd` varchar(150) NOT NULL,
  `Des_Prd` text DEFAULT NULL,
  `Des_Cor_Prd` varchar(255) DEFAULT NULL,
  `Id_Cat` int(11) DEFAULT NULL,
  `Tip_Prd` enum('servicio','producto','suscripcion') DEFAULT 'producto',
  `Ima_Prd` varchar(255) DEFAULT NULL,
  `Est_Prd` enum('activo','inactivo','agotado') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`Id_Prd`, `Cod_Prd`, `Nom_Prd`, `Des_Prd`, `Des_Cor_Prd`, `Id_Cat`, `Tip_Prd`, `Ima_Prd`, `Est_Prd`, `Fec_Cre`, `Fec_Mod`) VALUES
(15, NULL, 'Adobe Creative 2026', NULL, 'Paquete con +20 aplicaciones profesionales', 9, 'suscripcion', NULL, 'activo', '2026-04-18 01:42:26', '2026-05-10 13:00:51'),
(16, NULL, 'Canva', NULL, 'Canva Pro versión Educativa', 12, 'suscripcion', NULL, 'activo', '2026-04-21 10:14:35', '2026-05-10 14:02:09'),
(17, NULL, 'Capcut', NULL, 'Capcut Pro', 11, 'suscripcion', NULL, 'activo', '2026-04-21 10:27:13', '2026-05-10 14:08:27'),
(18, NULL, 'Office 365', NULL, 'Office 365', 14, 'suscripcion', NULL, 'activo', '2026-04-21 10:27:58', '2026-05-10 13:14:16'),
(19, NULL, 'Panel de Descargas', NULL, 'Panel de Descargas Filecip', 15, 'suscripcion', NULL, 'activo', '2026-04-21 12:58:14', '2026-05-10 13:14:06'),
(20, NULL, 'Windows 11 Pro', NULL, 'Key de Windows 11 Pro', 14, 'producto', NULL, 'activo', '2026-05-10 13:10:21', '2026-05-10 13:10:21'),
(21, NULL, 'Perplexity Pro', NULL, NULL, 10, 'suscripcion', NULL, 'activo', '2026-05-12 23:30:00', '2026-05-12 23:30:00'),
(22, NULL, 'Autodesk', NULL, 'Suite de Autodesk o Aplicación individual', 13, 'suscripcion', NULL, 'activo', '2026-05-17 01:16:01', '2026-05-17 01:16:01'),
(23, NULL, 'Grok', NULL, 'Grok IA', 10, 'suscripcion', NULL, 'activo', '2026-06-10 11:48:25', '2026-06-10 11:48:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `Id_Pro` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`Id_Pro`, `Nom_Pro`, `Tip_Pro`, `Con_Pri_Pro`, `Tel_Pro`, `Wha_Pro`, `Ema_Pro`, `Tel_Gram_Pro`, `Web_Pro`, `Pai_Pro`, `Med_Con_Pro`, `Con_Com_Pro`, `Cal_Pro`, `Not_Pro`, `Est_Pro`, `Fec_Cre`, `Fec_Mod`) VALUES
(8, 'Luffy Store', 'empresa', 'adobe-@TheSmilingcat_01-E', NULL, NULL, NULL, '@reselleradobeyoga', NULL, NULL, 'telegram', NULL, 5, NULL, 'activo', '2026-04-17 19:48:50', '2026-04-17 19:48:50'),
(9, 'Digiupsell', 'persona', 'Digiupsell', NULL, NULL, NULL, '@proacco', NULL, NULL, 'telegram', NULL, 5, NULL, 'activo', '2026-04-17 19:50:23', '2026-04-17 19:50:23'),
(11, 'vstore', 'empresa', 'vstore ⋆˙| premiumsHost', NULL, NULL, NULL, '@venuezstore', NULL, NULL, 'telegram', NULL, 5, NULL, 'activo', '2026-04-17 19:51:57', '2026-04-17 19:51:57'),
(12, 'G2G', 'tienda_web', 'https://www.g2g.com', NULL, NULL, NULL, NULL, 'https://www.g2g.com', NULL, 'web', NULL, 5, NULL, 'activo', '2026-05-12 21:57:02', '2026-05-12 21:57:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores_productos`
--

CREATE TABLE `proveedores_productos` (
  `Id_Pro_Prd` int(11) NOT NULL,
  `Id_Pro` int(11) NOT NULL,
  `Id_Prd` int(11) DEFAULT NULL,
  `Id_Var` int(11) DEFAULT NULL,
  `Pre_Com_Pro_Prd` decimal(12,2) DEFAULT NULL,
  `Es_Pri_Pro_Prd` tinyint(1) DEFAULT 0,
  `Not_Pro_Prd` text DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `proveedores_productos`
--

INSERT INTO `proveedores_productos` (`Id_Pro_Prd`, `Id_Pro`, `Id_Prd`, `Id_Var`, `Pre_Com_Pro_Prd`, `Es_Pri_Pro_Prd`, `Not_Pro_Prd`, `Fec_Cre`) VALUES
(1, 9, 19, NULL, NULL, 1, NULL, '2026-05-12 12:43:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recordatorios_vencimiento_email`
--

CREATE TABLE `recordatorios_vencimiento_email` (
  `Id_Rec` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `renovaciones`
--

CREATE TABLE `renovaciones` (
  `Id_Ren` int(11) NOT NULL,
  `Id_Dve_Ori` int(11) NOT NULL,
  `Id_Dve_Nue` int(11) DEFAULT NULL,
  `Id_Cli` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revendedores`
--

CREATE TABLE `revendedores` (
  `Id_Rev` int(11) NOT NULL,
  `Tel_Rev` varchar(20) NOT NULL,
  `Nom_Rev` varchar(100) DEFAULT NULL,
  `Ape_Rev` varchar(100) DEFAULT NULL,
  `Ema_Rev` varchar(100) DEFAULT NULL,
  `Doc_Rev` varchar(50) DEFAULT NULL,
  `Not_Rev` text DEFAULT NULL,
  `Est_Rev` enum('activo','inactivo') DEFAULT 'activo',
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `revendedores`
--

INSERT INTO `revendedores` (`Id_Rev`, `Tel_Rev`, `Nom_Rev`, `Ape_Rev`, `Ema_Rev`, `Doc_Rev`, `Not_Rev`, `Est_Rev`, `Fec_Cre`, `Fec_Mod`) VALUES
(1, '50664417220', 'BIOCDKEYS', NULL, 'support@biocdkeys.com', NULL, NULL, 'activo', '2026-06-09 15:20:14', '2026-06-09 15:20:14'),
(2, '593980207382', 'Data Pack Studio', NULL, NULL, NULL, NULL, 'activo', '2026-06-09 15:21:01', '2026-06-09 15:21:01'),
(3, '593998798450', 'David', 'Jiménez', NULL, NULL, NULL, 'activo', '2026-06-15 11:09:36', '2026-06-15 11:09:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `Id_Tar` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`Id_Tar`, `Tit_Tar`, `Des_Tar`, `Id_Cli`, `Id_Ven`, `Fec_Lim_Tar`, `Pri_Tar`, `Pro_Tar`, `Est_Tar`, `Fec_Com_Tar`, `Fec_Cre`, `Fec_Mod`) VALUES
(2, 'Prueba', NULL, NULL, NULL, '2026-06-14', 'media', 10, 'pendiente', NULL, '2026-05-11 08:30:29', '2026-05-17 00:52:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id_Usu` int(11) NOT NULL,
  `Nom_Usu` varchar(100) NOT NULL,
  `Ape_Usu` varchar(100) NOT NULL,
  `Ema_Usu` varchar(100) NOT NULL,
  `Pas_Usu` varchar(255) NOT NULL,
  `Tel_Usu` varchar(20) DEFAULT NULL,
  `Rol_Usu` enum('admin','vendedor') DEFAULT 'vendedor',
  `Est_Usu` enum('activo','inactivo','bloqueado') DEFAULT 'activo',
  `Ult_Acc_Usu` datetime DEFAULT NULL,
  `Fec_Cre` datetime DEFAULT current_timestamp(),
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id_Usu`, `Nom_Usu`, `Ape_Usu`, `Ema_Usu`, `Pas_Usu`, `Tel_Usu`, `Rol_Usu`, `Est_Usu`, `Ult_Acc_Usu`, `Fec_Cre`, `Fec_Mod`) VALUES
(25, 'Adrian', 'Romero', 'pruebas@xtremekey.shop', '$2b$10$tTZFDudQE/XXdq0XXPdRIulLwLSslCv5R3807J3VjHTWRGO3D4wZC', '0989560069', 'admin', 'activo', '2026-06-15 11:05:36', '2026-04-17 01:26:44', '2026-06-15 11:05:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variantes_productos`
--

CREATE TABLE `variantes_productos` (
  `Id_Var` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `variantes_productos`
--

INSERT INTO `variantes_productos` (`Id_Var`, `Id_Prd`, `Nom_Var`, `Des_Var`, `Pre_Cos_Var`, `Pre_Ven_Var`, `Pre_Rev_Var`, `Dur_Tip_Var`, `Dur_Val_Var`, `Max_Usu_Var`, `Not_Ven_Cor_Var`, `Not_Ven_Wsp_Var`, `Atr_Var`, `Est_Var`, `Fec_Cre`, `Fec_Mod`) VALUES
(2, 15, 'Premium', 'Activación bajo perfiles de empresa', 2.00, 9.00, 6.00, 'meses', 1, 2, 1, 1, '{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\"}', 'activo', '2026-04-18 01:43:03', '2026-05-10 15:15:46'),
(3, 15, 'Premium', 'Activación bajo perfiles de empresa', 5.00, 20.00, 15.00, 'meses', 3, 2, 1, 1, '{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"1 mes Envato o Freepik\"}', 'activo', '2026-04-18 01:54:44', '2026-05-10 15:15:17'),
(4, 15, 'Premium', 'Activación bajo perfiles de empresa', 8.00, 32.00, 28.00, 'meses', 6, 2, 1, 1, '{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"1 mes Envato o Freepik\"}', 'inactivo', '2026-04-18 01:56:32', '2026-05-10 15:16:15'),
(5, 15, 'Premium', 'Activación bajo perfiles de empresa', 12.00, 55.00, 42.00, 'meses', 12, 2, 1, 1, '{\"plan\":\"premium\",\"almacenamiento\":\"1TB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"perfil\":\"empresa\",\"bono\":\"+3 meses Envato o Freepik + Canva Pro\"}', 'inactivo', '2026-04-18 01:57:36', '2026-05-10 15:16:26'),
(6, 16, 'Pro Edu', 'Canva Pro versión Educativa, No incluye kit de marca', 0.00, 5.00, 3.00, 'meses', 12, 2, 1, 1, NULL, 'activo', '2026-04-21 10:16:19', '2026-05-10 14:09:05'),
(8, 17, 'Pro Team', 'Capcut Pro Team, No incluye almacenamiento', 1.00, 4.50, 3.00, 'meses', 1, 2, 1, 1, NULL, 'inactivo', '2026-04-21 12:06:13', '2026-06-15 13:02:40'),
(9, 17, 'Pro Team', 'Capcut Pro Team, No incluye almacenamiento', 2.00, 12.00, 8.00, 'meses', 3, 2, 1, 1, NULL, 'inactivo', '2026-04-21 12:07:03', '2026-05-10 15:16:42'),
(10, 17, 'Pro Team', 'Capcut Pro Team, No incluye almacenamiento', 5.00, 22.00, 15.00, 'meses', 6, 2, 1, 1, NULL, 'inactivo', '2026-04-21 12:07:40', '2026-05-10 15:17:00'),
(11, 17, 'Pro Team', 'Capcut Pro Team, No incluye almacenamiento', 10.00, 40.00, NULL, 'meses', 12, 2, 1, 1, NULL, 'inactivo', '2026-04-21 12:08:07', '2026-05-10 15:16:49'),
(12, 17, 'Pro Individual', 'Capcut Pro Individual, Incluye 1tb de Almacenamiento', 9.00, 30.00, 26.00, 'meses', 6, 2, 1, 1, NULL, 'inactivo', '2026-04-21 12:09:00', '2026-06-15 13:02:36'),
(13, 16, 'Pro Edu', 'Canva Pro versión Educativa, No incluye kit de marca', 0.00, 3.00, 2.00, 'meses', 6, 2, 1, 1, NULL, 'activo', '2026-04-21 12:10:50', '2026-05-10 14:09:21'),
(19, 19, 'Envato', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 13.00, 32.00, 25.00, 'dias', 365, 2, 0, 1, NULL, 'activo', '2026-04-21 13:09:52', '2026-06-15 13:00:39'),
(20, 19, 'Envato', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 8.50, 18.00, 15.00, 'dias', 180, 2, 0, 1, NULL, 'activo', '2026-04-21 13:09:52', '2026-06-15 13:01:00'),
(21, 19, 'Envato', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 5.00, 13.00, 11.00, 'dias', 90, 2, 0, 1, NULL, 'activo', '2026-04-21 13:09:52', '2026-06-15 13:01:04'),
(22, 19, 'Envato', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 3.00, 10.00, 7.00, 'dias', 60, 2, 0, 1, NULL, 'activo', '2026-04-21 13:09:52', '2026-06-15 13:01:13'),
(23, 19, 'Envato', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 1.90, 6.00, 4.20, 'dias', 30, 2, 0, 1, NULL, 'activo', '2026-04-21 13:09:52', '2026-06-15 13:01:22'),
(24, 15, 'Directo', 'Pago directo en la web oficial de adobe', 35.00, 75.00, 65.00, 'meses', 12, 2, 1, 1, '{\"plan\":\"directo\",\"almacenamiento\":\"100GB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"bono\":\"+2 meses Envato o Freepik + Canva Pro\"}', 'activo', '2026-04-21 13:12:30', '2026-05-10 14:07:56'),
(25, 15, 'Directo', 'Pago directo en la web oficial de adobe', 20.00, 45.00, 35.00, 'meses', 6, 2, 1, 1, '{\"plan\":\"directo\",\"almacenamiento\":\"100GB\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\",\"bono\":\"1 mes Envato o Freepik + CanvaPro\"}', 'activo', '2026-04-21 13:12:30', '2026-06-09 19:38:11'),
(26, 15, 'Directo', 'Pago directo en la web oficial de adobe', 13.00, 30.00, 25.00, 'meses', 3, 2, 1, 1, '{\"plan\":\"directo\",\"almacenamiento\":\"100gb\",\"creditos_ia\":4000,\"tipo_activacion\":\"correo\"}', 'activo', '2026-04-21 13:12:30', '2026-06-09 19:38:06'),
(27, 19, 'Freepik', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 1.90, 6.00, 4.20, 'dias', 30, 2, 0, 1, NULL, 'activo', '2026-05-10 18:54:48', '2026-06-15 13:01:29'),
(28, 19, 'Freepik', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 3.00, 10.00, 7.00, 'dias', 60, 2, 0, 1, NULL, 'activo', '2026-05-10 18:54:48', '2026-06-15 13:01:32'),
(29, 19, 'Freepik', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 5.00, 13.00, 11.00, 'dias', 90, 2, 0, 1, NULL, 'activo', '2026-05-10 18:54:48', '2026-06-15 13:01:46'),
(30, 19, 'Freepik', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 8.50, 18.00, 15.00, 'dias', 180, 2, 0, 1, NULL, 'activo', '2026-05-10 18:54:48', '2026-06-15 13:01:49'),
(31, 19, 'Freepik', 'Panel de Descargas de Freepik, Hasta 30 descargas diarias', 13.00, 32.00, 25.00, 'dias', 365, 2, 0, 1, NULL, 'activo', '2026-05-10 18:54:48', '2026-06-15 13:01:52'),
(32, 21, '1 Mes', NULL, 0.00, 5.00, 4.00, 'meses', 1, NULL, 0, 1, NULL, 'activo', '2026-05-12 23:31:02', '2026-06-15 13:00:16'),
(33, 22, 'Suite', NULL, 0.00, 15.00, 10.00, 'meses', 12, NULL, 1, 1, NULL, 'activo', '2026-05-17 01:16:33', '2026-05-17 01:16:33'),
(34, 22, 'Aplicación Individual', NULL, 0.00, 8.00, 5.00, 'meses', 12, NULL, 1, 1, NULL, 'activo', '2026-05-17 01:17:17', '2026-05-17 01:17:17'),
(35, 23, 'SuperGrok', NULL, 6.00, 12.00, NULL, 'meses', 1, NULL, 1, 1, NULL, 'activo', '2026-06-10 11:49:15', '2026-06-10 11:49:15'),
(36, 23, 'SuperGrok', NULL, 11.00, 30.00, 26.00, 'meses', 3, NULL, 1, 1, NULL, 'activo', '2026-06-10 11:49:56', '2026-06-10 11:49:56'),
(37, 18, 'Familiar', NULL, 6.00, 30.00, 25.00, 'meses', 12, NULL, 0, 1, NULL, 'activo', '2026-06-15 11:07:59', '2026-06-15 13:02:02'),
(38, 18, 'Personal', NULL, 1.20, 15.00, 9.00, 'meses', 12, NULL, 1, 1, NULL, 'activo', '2026-06-15 11:08:59', '2026-06-15 11:08:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `Id_Ven` int(11) NOT NULL,
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
  `Fec_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`Id_Ven`, `Id_Cli`, `Id_Rev`, `Fec_Ven`, `Des_Tot_Ven`, `Imp_Tot_Ven`, `Tot_Ven`, `Met_Pag_Ven`, `Not_Ven`, `Est_Ven`, `Fec_Cre`, `Fec_Mod`) VALUES
(24, 130, NULL, '2026-05-11 13:28:00', 0.00, 0.00, 18.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:05:27', '2026-05-12 23:05:27'),
(25, 129, NULL, '2026-05-13 04:05:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:07:21', '2026-05-12 23:07:21'),
(26, 152, NULL, '2026-05-13 04:07:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:09:42', '2026-05-12 23:09:42'),
(27, 65, NULL, '2026-05-13 09:09:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:10:52', '2026-05-14 19:53:49'),
(28, 81, NULL, '2026-05-13 04:10:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:14:00', '2026-05-12 23:14:00'),
(29, 15, NULL, '2026-05-13 04:14:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:16:38', '2026-05-12 23:16:38'),
(30, 23, NULL, '2026-05-13 04:16:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:18:50', '2026-05-12 23:18:50'),
(31, 69, NULL, '2026-05-13 04:18:00', 0.00, 0.00, 26.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:20:29', '2026-05-12 23:20:29'),
(32, 147, NULL, '2026-05-13 04:20:00', 0.00, 0.00, 26.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:28:18', '2026-05-12 23:28:18'),
(33, 95, NULL, '2026-05-12 16:45:00', 0.00, 0.00, 4.00, 'Tranferencia', NULL, 'completada', '2026-05-12 23:32:41', '2026-05-12 23:45:47'),
(35, 115, NULL, '2026-05-13 05:02:00', 0.00, 0.00, 26.00, 'Tranferencia', NULL, 'completada', '2026-05-13 00:06:34', '2026-05-13 00:06:34'),
(36, 152, NULL, '2026-05-13 05:06:00', 0.00, 0.00, 9.00, 'Tranferencia', NULL, 'completada', '2026-05-14 19:52:10', '2026-05-14 19:52:10'),
(38, 55, NULL, '2026-06-10 12:28:00', 0.00, 0.00, 9.00, 'Transferencia', NULL, 'completada', '2026-06-09 11:15:17', '2026-06-10 12:28:09'),
(41, 28, NULL, '2026-06-09 23:51:00', 0.00, 0.00, 9.00, 'Transferencia', NULL, 'completada', '2026-06-09 18:51:17', '2026-06-09 18:51:17'),
(42, NULL, 2, '2026-06-09 23:07:00', 0.00, 0.00, 6.00, 'Transferencia', NULL, 'completada', '2026-06-09 19:04:33', '2026-06-09 23:07:04'),
(43, 122, NULL, '2026-06-09 22:42:00', 0.00, 0.00, 30.00, 'Transferencia', NULL, 'completada', '2026-06-09 19:39:26', '2026-06-09 22:42:58'),
(44, NULL, 2, '2026-06-09 22:46:00', 0.00, 0.00, 3.00, 'Transferencia', NULL, 'completada', '2026-06-09 20:30:37', '2026-06-09 22:46:14'),
(50, 57, NULL, '2026-06-10 10:01:00', 0.00, 0.00, 5.00, 'Transferencia', NULL, 'completada', '2026-06-10 10:01:50', '2026-06-10 10:01:50'),
(51, 155, NULL, '2026-06-11 17:13:00', 0.00, 0.00, 45.00, 'Transferencia', NULL, 'completada', '2026-06-11 17:14:23', '2026-06-11 17:14:23'),
(52, 31, NULL, '2026-06-12 11:32:00', 0.00, 0.00, 30.00, 'Transferencia', NULL, 'completada', '2026-06-12 11:33:02', '2026-06-12 11:33:02'),
(53, 156, NULL, '2026-06-12 11:36:00', 0.00, 0.00, 9.00, 'Transferencia', NULL, 'completada', '2026-06-12 11:43:33', '2026-06-12 11:43:33'),
(54, 55, NULL, '2026-06-12 11:55:00', 0.00, 0.00, 6.00, 'Transferencia', NULL, 'completada', '2026-06-12 11:56:38', '2026-06-12 11:56:38'),
(55, 93, NULL, '2026-06-12 12:19:00', 0.00, 0.00, 20.00, 'Transferencia', NULL, 'completada', '2026-06-12 12:21:00', '2026-06-12 12:21:00'),
(56, 107, NULL, '2026-06-12 12:28:00', 0.00, 0.00, 30.00, 'Transferencia', NULL, 'completada', '2026-06-12 12:29:21', '2026-06-12 12:29:21'),
(57, 73, NULL, '2026-06-13 11:06:00', 0.00, 0.00, 20.00, 'Transferencia', NULL, 'completada', '2026-06-15 11:07:00', '2026-06-15 11:07:00'),
(58, NULL, 3, '2026-06-13 11:09:00', 0.00, 0.00, 25.00, 'Transferencia', NULL, 'completada', '2026-06-15 11:10:45', '2026-06-15 12:12:01'),
(59, 154, NULL, '2026-06-15 14:30:40', 0.00, 0.00, 9.99, 'prueba', 'TEST_REMINDER_NORMAL_154', 'completada', '2026-06-15 14:30:40', '2026-06-15 14:30:40'),
(60, 154, 1, '2026-06-15 14:30:40', 0.00, 0.00, 12.99, 'prueba', 'TEST_REMINDER_RESELLER_154', 'completada', '2026-06-15 14:30:40', '2026-06-15 14:30:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_productos`
--
ALTER TABLE `categorias_productos`
  ADD PRIMARY KEY (`Id_Cat`),
  ADD KEY `Id_Cat_Pad` (`Id_Cat_Pad`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`Id_Cli`),
  ADD UNIQUE KEY `uk_tel_cli` (`Tel_Cli`),
  ADD KEY `idx_nom_cli` (`Nom_Cli`,`Ape_Cli`),
  ADD KEY `idx_tel_cli` (`Tel_Cli`),
  ADD KEY `idx_ema_cli` (`Ema_Cli`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`Id_Com`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `idx_fec_com` (`Fec_Com`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`Id_Con`);

--
-- Indices de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`Id_Cue`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `idx_est_cue` (`Est_Cue`),
  ADD KEY `idx_fec_ven_cue` (`Fec_Ven_Cue`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`Id_Dco`),
  ADD KEY `Id_Com` (`Id_Com`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`Id_Dve`),
  ADD KEY `Id_Ven` (`Id_Ven`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `Id_Cue` (`Id_Cue`),
  ADD KEY `Id_Key` (`Id_Key`),
  ADD KEY `idx_fec_fin_dve` (`Fec_Fin_Dve`),
  ADD KEY `idx_est_dve` (`Est_Dve`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`Id_Gas`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `Id_Com` (`Id_Com`),
  ADD KEY `idx_fec_gas` (`Fec_Gas`),
  ADD KEY `idx_cat_gas` (`Cat_Gas`);

--
-- Indices de la tabla `keys_productos`
--
ALTER TABLE `keys_productos`
  ADD PRIMARY KEY (`Id_Key`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `idx_est_key` (`Est_Key`),
  ADD KEY `idx_fec_ven_key` (`Fec_Ven_Key`),
  ADD KEY `idx_id_prd_key` (`Id_Prd`);

--
-- Indices de la tabla `plantillas_notificacion`
--
ALTER TABLE `plantillas_notificacion`
  ADD PRIMARY KEY (`Id_Pla`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`Id_Prd`),
  ADD UNIQUE KEY `Cod_Prd` (`Cod_Prd`),
  ADD KEY `Id_Cat` (`Id_Cat`),
  ADD KEY `idx_nom_prd` (`Nom_Prd`),
  ADD KEY `idx_est_prd` (`Est_Prd`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`Id_Pro`),
  ADD KEY `idx_nom_pro` (`Nom_Pro`);

--
-- Indices de la tabla `proveedores_productos`
--
ALTER TABLE `proveedores_productos`
  ADD PRIMARY KEY (`Id_Pro_Prd`),
  ADD UNIQUE KEY `uk_pro_prd` (`Id_Pro`,`Id_Prd`,`Id_Var`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`);

--
-- Indices de la tabla `recordatorios_vencimiento_email`
--
ALTER TABLE `recordatorios_vencimiento_email`
  ADD PRIMARY KEY (`Id_Rec`),
  ADD UNIQUE KEY `uq_recordatorio_vencimiento` (`Id_Dve`,`Tip_Rec`,`Fec_Objetivo`),
  ADD KEY `idx_recordatorios_destino` (`Ema_Destino`),
  ADD KEY `idx_recordatorios_detalle` (`Id_Dve`);

--
-- Indices de la tabla `renovaciones`
--
ALTER TABLE `renovaciones`
  ADD PRIMARY KEY (`Id_Ren`),
  ADD KEY `Id_Dve_Ori` (`Id_Dve_Ori`),
  ADD KEY `Id_Dve_Nue` (`Id_Dve_Nue`),
  ADD KEY `Id_Cli` (`Id_Cli`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `idx_fec_ven_ant_ren` (`Fec_Ven_Ant_Ren`),
  ADD KEY `idx_est_ren` (`Est_Ren`);

--
-- Indices de la tabla `revendedores`
--
ALTER TABLE `revendedores`
  ADD PRIMARY KEY (`Id_Rev`),
  ADD UNIQUE KEY `uk_tel_rev` (`Tel_Rev`),
  ADD KEY `idx_nom_rev` (`Nom_Rev`,`Ape_Rev`),
  ADD KEY `idx_tel_rev` (`Tel_Rev`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`Id_Tar`),
  ADD KEY `Id_Cli` (`Id_Cli`),
  ADD KEY `Id_Ven` (`Id_Ven`),
  ADD KEY `idx_fec_lim_tar` (`Fec_Lim_Tar`),
  ADD KEY `idx_est_tar` (`Est_Tar`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id_Usu`),
  ADD UNIQUE KEY `Ema_Usu` (`Ema_Usu`);

--
-- Indices de la tabla `variantes_productos`
--
ALTER TABLE `variantes_productos`
  ADD PRIMARY KEY (`Id_Var`),
  ADD KEY `Id_Prd` (`Id_Prd`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`Id_Ven`),
  ADD KEY `Id_Cli` (`Id_Cli`),
  ADD KEY `idx_fec_ven` (`Fec_Ven`),
  ADD KEY `idx_est_ven` (`Est_Ven`),
  ADD KEY `Id_Rev` (`Id_Rev`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_productos`
--
ALTER TABLE `categorias_productos`
  MODIFY `Id_Cat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `Id_Cli` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `Id_Com` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `Id_Con` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  MODIFY `Id_Cue` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `Id_Dco` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `Id_Dve` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `Id_Gas` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `keys_productos`
--
ALTER TABLE `keys_productos`
  MODIFY `Id_Key` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plantillas_notificacion`
--
ALTER TABLE `plantillas_notificacion`
  MODIFY `Id_Pla` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `Id_Prd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `Id_Pro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `proveedores_productos`
--
ALTER TABLE `proveedores_productos`
  MODIFY `Id_Pro_Prd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recordatorios_vencimiento_email`
--
ALTER TABLE `recordatorios_vencimiento_email`
  MODIFY `Id_Rec` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `renovaciones`
--
ALTER TABLE `renovaciones`
  MODIFY `Id_Ren` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `revendedores`
--
ALTER TABLE `revendedores`
  MODIFY `Id_Rev` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `Id_Tar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id_Usu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `variantes_productos`
--
ALTER TABLE `variantes_productos`
  MODIFY `Id_Var` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `Id_Ven` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categorias_productos`
--
ALTER TABLE `categorias_productos`
  ADD CONSTRAINT `categorias_productos_ibfk_1` FOREIGN KEY (`Id_Cat_Pad`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL;

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`);

--
-- Filtros para la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `cuentas_ibfk_2` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE SET NULL,
  ADD CONSTRAINT `cuentas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`Id_Com`) REFERENCES `compras` (`Id_Com`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_compras_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_ventas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_ventas_ibfk_4` FOREIGN KEY (`Id_Cue`) REFERENCES `cuentas` (`Id_Cue`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_ventas_ibfk_5` FOREIGN KEY (`Id_Key`) REFERENCES `keys_productos` (`Id_Key`) ON DELETE SET NULL;

--
-- Filtros para la tabla `keys_productos`
--
ALTER TABLE `keys_productos`
  ADD CONSTRAINT `keys_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `keys_productos_ibfk_2` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE SET NULL,
  ADD CONSTRAINT `keys_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_Cat`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL;

--
-- Filtros para la tabla `proveedores_productos`
--
ALTER TABLE `proveedores_productos`
  ADD CONSTRAINT `proveedores_productos_ibfk_1` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE CASCADE,
  ADD CONSTRAINT `proveedores_productos_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE,
  ADD CONSTRAINT `proveedores_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE CASCADE;

--
-- Filtros para la tabla `renovaciones`
--
ALTER TABLE `renovaciones`
  ADD CONSTRAINT `renovaciones_ibfk_1` FOREIGN KEY (`Id_Dve_Ori`) REFERENCES `detalle_ventas` (`Id_Dve`),
  ADD CONSTRAINT `renovaciones_ibfk_2` FOREIGN KEY (`Id_Dve_Nue`) REFERENCES `detalle_ventas` (`Id_Dve`) ON DELETE SET NULL,
  ADD CONSTRAINT `renovaciones_ibfk_3` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  ADD CONSTRAINT `renovaciones_ibfk_4` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `renovaciones_ibfk_5` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL,
  ADD CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE SET NULL;

--
-- Filtros para la tabla `variantes_productos`
--
ALTER TABLE `variantes_productos`
  ADD CONSTRAINT `variantes_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
