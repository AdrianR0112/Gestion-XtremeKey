SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-05:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `sistema_gestion_xk` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sistema_gestion_xk`;

DROP TABLE IF EXISTS `categorias_productos`;
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

DROP TABLE IF EXISTS `clientes`;
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

DROP TABLE IF EXISTS `compras`;
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

DROP TABLE IF EXISTS `configuracion`;
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

DROP TABLE IF EXISTS `cuentas`;
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

DROP TABLE IF EXISTS `detalle_compras`;
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

DROP TABLE IF EXISTS `detalle_ventas`;
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

DROP TABLE IF EXISTS `gastos`;
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

DROP TABLE IF EXISTS `keys_productos`;
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

DROP TABLE IF EXISTS `plantillas_notificacion`;
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

DROP TABLE IF EXISTS `productos`;
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

DROP TABLE IF EXISTS `proveedores`;
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

DROP TABLE IF EXISTS `proveedores_productos`;
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

DROP TABLE IF EXISTS `renovaciones`;
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

DROP TABLE IF EXISTS `revendedores`;
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

DROP TABLE IF EXISTS `tareas`;
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

DROP TABLE IF EXISTS `usuarios`;
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

DROP TABLE IF EXISTS `variantes_productos`;
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

DROP TABLE IF EXISTS `ventas`;
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


ALTER TABLE `categorias_productos`
  ADD PRIMARY KEY (`Id_Cat`),
  ADD KEY `Id_Cat_Pad` (`Id_Cat_Pad`);

ALTER TABLE `clientes`
  ADD PRIMARY KEY (`Id_Cli`),
  ADD UNIQUE KEY `uk_tel_cli` (`Tel_Cli`),
  ADD KEY `idx_nom_cli` (`Nom_Cli`,`Ape_Cli`),
  ADD KEY `idx_tel_cli` (`Tel_Cli`),
  ADD KEY `idx_ema_cli` (`Ema_Cli`);

ALTER TABLE `compras`
  ADD PRIMARY KEY (`Id_Com`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `idx_fec_com` (`Fec_Com`);

ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`Id_Con`);

ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`Id_Cue`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `idx_est_cue` (`Est_Cue`),
  ADD KEY `idx_fec_ven_cue` (`Fec_Ven_Cue`);

ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`Id_Dco`),
  ADD KEY `Id_Com` (`Id_Com`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`);

ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`Id_Dve`),
  ADD KEY `Id_Ven` (`Id_Ven`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `Id_Cue` (`Id_Cue`),
  ADD KEY `Id_Key` (`Id_Key`),
  ADD KEY `idx_fec_fin_dve` (`Fec_Fin_Dve`),
  ADD KEY `idx_est_dve` (`Est_Dve`);

ALTER TABLE `gastos`
  ADD PRIMARY KEY (`Id_Gas`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `Id_Com` (`Id_Com`),
  ADD KEY `idx_fec_gas` (`Fec_Gas`),
  ADD KEY `idx_cat_gas` (`Cat_Gas`);

ALTER TABLE `keys_productos`
  ADD PRIMARY KEY (`Id_Key`),
  ADD KEY `Id_Pro` (`Id_Pro`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `idx_est_key` (`Est_Key`),
  ADD KEY `idx_fec_ven_key` (`Fec_Ven_Key`),
  ADD KEY `idx_id_prd_key` (`Id_Prd`);

ALTER TABLE `plantillas_notificacion`
  ADD PRIMARY KEY (`Id_Pla`);

ALTER TABLE `productos`
  ADD PRIMARY KEY (`Id_Prd`),
  ADD UNIQUE KEY `Cod_Prd` (`Cod_Prd`),
  ADD KEY `Id_Cat` (`Id_Cat`),
  ADD KEY `idx_nom_prd` (`Nom_Prd`),
  ADD KEY `idx_est_prd` (`Est_Prd`);

ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`Id_Pro`),
  ADD KEY `idx_nom_pro` (`Nom_Pro`);

ALTER TABLE `proveedores_productos`
  ADD PRIMARY KEY (`Id_Pro_Prd`),
  ADD UNIQUE KEY `uk_pro_prd` (`Id_Pro`,`Id_Prd`,`Id_Var`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`);

ALTER TABLE `renovaciones`
  ADD PRIMARY KEY (`Id_Ren`),
  ADD KEY `Id_Dve_Ori` (`Id_Dve_Ori`),
  ADD KEY `Id_Dve_Nue` (`Id_Dve_Nue`),
  ADD KEY `Id_Cli` (`Id_Cli`),
  ADD KEY `Id_Prd` (`Id_Prd`),
  ADD KEY `Id_Var` (`Id_Var`),
  ADD KEY `idx_fec_ven_ant_ren` (`Fec_Ven_Ant_Ren`),
  ADD KEY `idx_est_ren` (`Est_Ren`);

ALTER TABLE `revendedores`
  ADD PRIMARY KEY (`Id_Rev`),
  ADD UNIQUE KEY `uk_tel_rev` (`Tel_Rev`),
  ADD KEY `idx_nom_rev` (`Nom_Rev`,`Ape_Rev`),
  ADD KEY `idx_tel_rev` (`Tel_Rev`);

ALTER TABLE `tareas`
  ADD PRIMARY KEY (`Id_Tar`),
  ADD KEY `Id_Cli` (`Id_Cli`),
  ADD KEY `Id_Ven` (`Id_Ven`),
  ADD KEY `idx_fec_lim_tar` (`Fec_Lim_Tar`),
  ADD KEY `idx_est_tar` (`Est_Tar`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id_Usu`),
  ADD UNIQUE KEY `Ema_Usu` (`Ema_Usu`);

ALTER TABLE `variantes_productos`
  ADD PRIMARY KEY (`Id_Var`),
  ADD KEY `Id_Prd` (`Id_Prd`);

ALTER TABLE `ventas`
  ADD PRIMARY KEY (`Id_Ven`),
  ADD KEY `Id_Cli` (`Id_Cli`),
  ADD KEY `Id_Rev` (`Id_Rev`),
  ADD KEY `idx_fec_ven` (`Fec_Ven`),
  ADD KEY `idx_est_ven` (`Est_Ven`);


ALTER TABLE `categorias_productos`
  MODIFY `Id_Cat` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `clientes`
  MODIFY `Id_Cli` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `compras`
  MODIFY `Id_Com` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `configuracion`
  MODIFY `Id_Con` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cuentas`
  MODIFY `Id_Cue` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `detalle_compras`
  MODIFY `Id_Dco` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `detalle_ventas`
  MODIFY `Id_Dve` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `gastos`
  MODIFY `Id_Gas` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `keys_productos`
  MODIFY `Id_Key` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `plantillas_notificacion`
  MODIFY `Id_Pla` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `productos`
  MODIFY `Id_Prd` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `proveedores`
  MODIFY `Id_Pro` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `proveedores_productos`
  MODIFY `Id_Pro_Prd` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `renovaciones`
  MODIFY `Id_Ren` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `revendedores`
  MODIFY `Id_Rev` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tareas`
  MODIFY `Id_Tar` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuarios`
  MODIFY `Id_Usu` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `variantes_productos`
  MODIFY `Id_Var` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ventas`
  MODIFY `Id_Ven` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `categorias_productos`
  ADD CONSTRAINT `categorias_productos_ibfk_1` FOREIGN KEY (`Id_Cat_Pad`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL;

ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`);

ALTER TABLE `cuentas`
  ADD CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `cuentas_ibfk_2` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE SET NULL,
  ADD CONSTRAINT `cuentas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`Id_Com`) REFERENCES `compras` (`Id_Com`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_compras_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_ventas_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_ventas_ibfk_4` FOREIGN KEY (`Id_Cue`) REFERENCES `cuentas` (`Id_Cue`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_ventas_ibfk_5` FOREIGN KEY (`Id_Key`) REFERENCES `keys_productos` (`Id_Key`) ON DELETE SET NULL;

ALTER TABLE `keys_productos`
  ADD CONSTRAINT `keys_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `keys_productos_ibfk_2` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE SET NULL,
  ADD CONSTRAINT `keys_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_Cat`) REFERENCES `categorias_productos` (`Id_Cat`) ON DELETE SET NULL;

ALTER TABLE `proveedores_productos`
  ADD CONSTRAINT `proveedores_productos_ibfk_1` FOREIGN KEY (`Id_Pro`) REFERENCES `proveedores` (`Id_Pro`) ON DELETE CASCADE,
  ADD CONSTRAINT `proveedores_productos_ibfk_2` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE,
  ADD CONSTRAINT `proveedores_productos_ibfk_3` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE CASCADE;

ALTER TABLE `renovaciones`
  ADD CONSTRAINT `renovaciones_ibfk_1` FOREIGN KEY (`Id_Dve_Ori`) REFERENCES `detalle_ventas` (`Id_Dve`),
  ADD CONSTRAINT `renovaciones_ibfk_2` FOREIGN KEY (`Id_Dve_Nue`) REFERENCES `detalle_ventas` (`Id_Dve`) ON DELETE SET NULL,
  ADD CONSTRAINT `renovaciones_ibfk_3` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  ADD CONSTRAINT `renovaciones_ibfk_4` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE SET NULL,
  ADD CONSTRAINT `renovaciones_ibfk_5` FOREIGN KEY (`Id_Var`) REFERENCES `variantes_productos` (`Id_Var`) ON DELETE SET NULL;

ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`) ON DELETE SET NULL,
  ADD CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`Id_Ven`) REFERENCES `ventas` (`Id_Ven`) ON DELETE SET NULL;

ALTER TABLE `variantes_productos`
  ADD CONSTRAINT `variantes_productos_ibfk_1` FOREIGN KEY (`Id_Prd`) REFERENCES `productos` (`Id_Prd`) ON DELETE CASCADE;

ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`Id_Cli`) REFERENCES `clientes` (`Id_Cli`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`Id_Rev`) REFERENCES `revendedores` (`Id_Rev`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
