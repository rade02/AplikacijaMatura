CREATE DATABASE bazaMatura;
USE bazaMatura;
CREATE TABLE IF NOT EXISTS Uporabniki (
    uporabnisko_ime VARCHAR(150) PRIMARY KEY,
    geslo VARCHAR(150) NOT NULL,
    vloga INT NOT NULL,
    omogocen BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS Stranke_in_zaposleni (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    uporabnisko_ime VARCHAR(150) DEFAULT NULL,
    elektronski_naslov VARCHAR(160) UNIQUE NOT NULL,
    ime VARCHAR(120) NOT NULL,
    priimek VARCHAR(130) NOT NULL,
    ulica_in_hisna_stevilka VARCHAR(160) DEFAULT NULL,
    kraj VARCHAR(130) DEFAULT NULL,
    postna_stevilka INT DEFAULT NULL CHECK (postna_stevilka < 10000
        AND postna_stevilka > 0),
    telefonska_stevilka VARCHAR(20) DEFAULT NULL,
    podjetje VARCHAR(255) DEFAULT NULL,
    oddelek VARCHAR(100) DEFAULT NULL,
    placa DOUBLE DEFAULT 0.00,
    CONSTRAINT fk_uime FOREIGN KEY (uporabnisko_ime)
        REFERENCES Uporabniki (uporabnisko_ime)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Narocila (
    ID_narocila INT PRIMARY KEY AUTO_INCREMENT,
    datum DATE NOT NULL,
    ID_stranke INT DEFAULT NULL,
    opravljeno BOOLEAN NOT NULL DEFAULT FALSE,
    imeStranke VARCHAR(50) DEFAULT NULL,
    priimekStranke VARCHAR(80) DEFAULT NULL,
    naslovDostave VARCHAR(80) DEFAULT NULL,
    postnina DOUBLE DEFAULT 0,
    CONSTRAINT fk_idstranke1 FOREIGN KEY (ID_stranke)
        REFERENCES Stranke_in_zaposleni (ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Racuni (
    ID_racuna INT PRIMARY KEY AUTO_INCREMENT,
    ID_narocila INT NOT NULL,
    kupec VARCHAR(150) NOT NULL,
    za_placilo DOUBLE NOT NULL,
    datumIzdaje DATE,
    CONSTRAINT fk_idnarocila FOREIGN KEY (ID_narocila)
        REFERENCES Narocila (ID_narocila)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Izdelki (
    ID_izdelka INT PRIMARY KEY AUTO_INCREMENT,
    ime VARCHAR(40) NOT NULL,
    kategorija VARCHAR(20) NOT NULL,
    cena_za_kos DOUBLE NOT NULL,
    kosov_na_voljo INT NOT NULL,
    kratek_opis VARCHAR(40) DEFAULT NULL,
    informacije TEXT DEFAULT NULL,
    popust INT DEFAULT 0,
    slika LONGBLOB
);
CREATE TABLE IF NOT EXISTS Izdelki_pri_narocilu (
    ID_narocila INT NOT NULL,
    ID_izdelka INT NOT NULL,
    kolicina INT NOT NULL,
    cena DOUBLE NOT NULL,
    CONSTRAINT fk_idnarocila1 FOREIGN KEY (ID_narocila)
        REFERENCES Narocila (ID_narocila)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_idizdelka FOREIGN KEY (ID_izdelka)
        REFERENCES Izdelki (ID_izdelka)
        ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO uporabniki VALUES ('admin', '8451029959740982', 0, default);	/* hash geslo: admin */
INSERT INTO stranke_in_zaposleni (uporabnisko_ime, elektronski_naslov, ime, priimek) VALUES ('admin', 'admin', 'admin', 'admin');