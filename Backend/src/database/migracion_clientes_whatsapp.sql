ALTER TABLE `clientes`
  DROP COLUMN `Usu_Tel_Cli`,
  CHANGE COLUMN `Ace_Not_Tel_Cli` `Ace_Not_What_Cli` tinyint(1) DEFAULT 1;

UPDATE `clientes`
SET
  `Ace_Not_What_Cli` = 1,
  `Ace_Not_Cor_Cli` = 1;
