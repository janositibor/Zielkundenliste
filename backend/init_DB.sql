SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
SET time_zone = "+00:00";

START TRANSACTION;

CREATE DATABASE IF NOT EXISTS `zielkundenliste_DB` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `zielkundenliste_DB`;

CREATE USER zielkundenliste_user@localhost IDENTIFIED BY 'pass_for_zielkundenliste_user';
GRANT ALL ON zielkundenliste_DB.* TO zielkundenliste_user@localhost;

CREATE TABLE `zielkundenliste_basicData` (
  `ZielKundenID` INT(11) NOT NULL AUTO_INCREMENT,
  `KundenPRIO` VARCHAR(16) COLLATE utf8_unicode_ci NOT NULL,
  `WerKummertSich` VARCHAR(64) COLLATE utf8_unicode_ci NOT NULL,
  `Firmenname` VARCHAR(64) COLLATE utf8_unicode_ci NOT NULL,
  `NameDesKontakts` VARCHAR(64) COLLATE utf8_unicode_ci NOT NULL,
  `RechnungsAdresse` VARCHAR(128) COLLATE utf8_unicode_ci NOT NULL,
  `Ort` VARCHAR(64) COLLATE utf8_unicode_ci NOT NULL,
  `Postleitzahl` VARCHAR(16) COLLATE utf8_unicode_ci NOT NULL,
  `Land_Region` VARCHAR(256) COLLATE utf8_unicode_ci NOT NULL,
  `Telefonnummer` VARCHAR(32) COLLATE utf8_unicode_ci NOT NULL,
  `EMailAdresse` VARCHAR(128) COLLATE utf8_unicode_ci NOT NULL,
  `Erinnerung_Outlook` DATE NOT NULL,
  `Anmerkungen` VARCHAR(65535) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ZielKundenID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `zielkundenliste_basicData` (`KundenPRIO`,`WerKummertSich`,`Firmenname`,`NameDesKontakts`,`RechnungsAdresse`,`Ort`,`Postleitzahl`,`Land_Region`,`Telefonnummer`,`EMailAdresse`,`Erinnerung_Outlook`,`Anmerkungen`) VALUES
('Level5','Tibor','Firmen101','NameDesKontakts','Tunder u. 40','Pécs','H-7621','Ungarn','0036 70 2949372','janositibor@gmail.com','2023-06-19','Lorem ipsum ...'),
('Level2','Lars','Firmen104','NameDesKontakts','Friedrich str. 56','Markdorf','88677','Deutschland','0036 70 2949372','TiVaDaR@gmail.com','2023-06-14','Lorem ipsum 2 ...'),
('Level1','Wolfgang','Firmen314','NameDesKontakts','Zeppelinstraße 8-10','Markdorf','88677','Deutschland','0036 70 2949372','Aranka101@gmail.com','2023-06-14','Lorem ipsum again ...');

COMMIT;