create database test2;
use test2;
SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE table_name = 'Uporabniki' AND table_schema = 'test2';
show tables;

/**** CREATE TABLES ****/
update Uporabniki set geslo = '5426335489528441' where uporabnisko_ime = 'andrez123';
create table if not exists Uporabniki(
    uporabnisko_ime varchar(150) primary key, 
    geslo varchar(150) not null,
    vloga int not null,   /* 0 - admin, 1 - zaposleni, 2 - stranka, 3 - racunovodja*/
    omogocen boolean not null default false
);
insert into Uporabniki values ('timnicar', 'timnicar', 2, default);
desc Uporabniki;
select * from Uporabniki;
alter table Uporabniki add column omogocen boolean not null default true after vloga;
alter table Uporabniki drop column onemogocen;
drop table Uporabniki;
update Uporabniki set vloga = 0 where uporabnisko_ime = 'admin';
select geslo, omogocen from Uporabniki;
delete from Uporabniki where geslo in ('hej','wesda');

create table if not exists Stranke_in_zaposleni(
	ID int primary key auto_increment,
    uporabnisko_ime varchar(150) default null,
    elektronski_naslov varchar(160) unique not null,
    ime varchar(120) not null,
    priimek varchar(130) not null,
    ulica_in_hisna_stevilka varchar(160) default null,
    kraj varchar(130) default null,
    postna_stevilka int default null check(postna_stevilka < 10000 and postna_stevilka > 0),
    telefonska_stevilka varchar(20) default null,
    podjetje varchar(255) default null,
    oddelek varchar(100) default null,
    placa double default 0.00,
    constraint fk_uime 
		foreign key (uporabnisko_ime)
		references Uporabniki(uporabnisko_ime)
	on delete cascade
    on update cascade
);
insert into Stranke_in_zaposleni values (
	default,
    'erikcar',
    'er@gmail.com',
    'Erik',
    'Radovičevič',
    'Muhaber 4b',
    'Novo mesto',
    8000,
    default, default,default,default
);
desc Stranke_in_zaposleni;
select * from Stranke_in_zaposleni;
delete from Stranke_in_zaposleni where ID = 2;
select * from Stranke_in_zaposleni where ID = 6;
select * from Stranke_in_zaposleni where (ID) = '6';

select geslo, omogocen from Uporabniki where uporabnisko_ime = 'ADMIN';
update Stranke_in_zaposleni set placa = 1000.90 where ime = 'e';


/* --------- */
/* --------- */
/* --------- */
create table if not exists Narocila(
	ID_narocila int primary key auto_increment,
    datum datetime not null,
    ID_stranke int default null,
    opravljeno boolean not null default false,
    imeStranke varchar(50) default null, 
    priimekStranke varchar(80) default null, 
    naslovDostave varchar(80) default null,
    constraint fk_idstranke1
		foreign key (ID_stranke)
        references Stranke_in_zaposleni(ID)
);
alter table Narocila add column postnina double default 0;
alter table Narocila add foreign key (ID_stranke)
        references Stranke_in_zaposleni(ID) on delete cascade on update cascade;
desc Narocila;
select * from Narocila;
insert into Narocila values
(default, '2023-01-27', 6, true),
(default, '2023-01-28', 7, false),
(default, '2023-01-29', 11, true),
(default, '2023-01-30', 13, false);
update Narocila set opravljeno = 1 where ID_narocila = 2;
select * from Narocila where datum = '2023-01-28';
select * from Narocila;
delete from Narocila where naslovDostave = 'B';
insert into Narocila (datum, ID_stranke, opravljeno, imeStranke, priimekStranke, naslovDostave) values ((select current_date() as cd), 7, default, 'Erik', 'Radovičevič', 'Mb 4b');
select * from Narocila where datum = '2023-03-02';
select * from Narocila where datum = '2023-03-01';
alter table Narocila modify column datum date;
delete from Narocila where ID_narocila in (1,2,3,4,5);
alter table Narocila add column (imeStranke varchar(50), priimekStranke varchar(80), naslovDostave varchar(80));
alter table Narocila modify column ID_stranke int default null;
alter table Narocila drop column naslovStranke ;
alter table Narocila add column naslovDostave varchar(80);
update Narocila set naslovDostave = '-';
delete from Narocila where ID_narocila = 12;
SET information_schema_stats_expiry = 0;
select auto_increment from information_schema.tables where table_schema = 'test2' and table_name = 'Narocila';

select @@global.time_zone;
SET GLOBAL time_zone = '+0:00';
SET time_zone = timezone;
select now();
select * from Narocila where datum = '2023-01-27';


create table if not exists Racuni(
	ID_racuna int primary key auto_increment,
    ID_narocila int not null,
    kupec varchar(150) not null,
    za_placilo double not null,
    placano datetime,
    constraint fk_idnarocila
		foreign key (ID_narocila)
        references Narocila(ID_narocila)
);
insert into Racuni (ID_narocila, kupec, za_placilo, placano) values (60,'Erik Radovičevič',3000.99,'2023-03-03');
alter table Racuni modify column placano date;
desc Racuni;
select * from Racuni;
insert into Racuni values
(default, 1, 6, 6, '2023-02-27', 300.90, '2023-02-02'),
(default, 1, 7, 7, '2023-02-28', 1300.90, '2023-02-03'),
(default, 1, 11, 11, '2023-03-1', 900.90, '2023-02-04'),
(default, 1, 13, 13, '2023-03-02', 377.90, '2023-02-05');
drop table racuni;
alter table Racuni drop column datum_valute;
alter table Racuni add foreign key (ID_narocila)
        references Narocila(ID_narocila) on delete cascade on update cascade;
desc Racuni;
alter table Racuni rename column placano to datumIzdaje;

select * from Izdelki where (ID_izdelka not in (1, 2) and Izdelki.kategorija in ('televizor', 'telefon') and (Izdelki.cena_za_kos between 100 and 5000) and Izdelki.popust < 15) order by rand() limit 5;
select * from Izdelki;
select * from Izdelki where (ID_izdelka not in (6,13,1,7,10,9) and Izdelki.kategorija in ('zvočnik') and Izdelki.cena_za_kos < 50 and Izdelki.popust > 0 ) order by rand() limit 6;
select * from Izdelki where (ID_izdelka not in (7,5,13,3,8,11) and Izdelki.kategorija in ('mobilni telefon') and Izdelki.popust > 0 ) order by rand() limit 6;
select * from Izdelki where (Izdelki.kategorija in ('mobilni telefon') and (1 = 1) and Izdelki.popust >= 0 ) order by rand() limit 6;

create table if not exists Izdelki(
	ID_izdelka int primary key auto_increment,
    ime varchar(40) not null,
    kategorija varchar(20) not null,
    cena_za_kos double not null,
    kosov_na_voljo int not null,
    kratek_opis varchar(40) default null,
    informacije text default null,
    popust int default 0,
    slika blob
);
desc Izdelki;
select * from Izdelki;
alter table Izdelki alter column informacije set default null;
alter table Izdelki alter column popust set default 0;
alter table Izdelki modify informacije text;
delete from Izdelki where ime in ('github','w','e','Abc','edf','test', 'GH logo');
delete from Izdelki where ID_izdelka =48;
drop table Izdelki;
update Izdelki set ime = 'a', kategorija = 'b', cena_za_kos = 3.40, kosov_na_voljo = 2, kratek_opis = '', informacije = null, popust = 0 where ID_izdelka = 100;
select count(*) from Izdelki;
select distinct kategorija from Izdelki;
update Izdelki set kosov_na_voljo = 0 where cena_za_kos = 154.90;
alter table Izdelki modify slika blob;
select ime from Izdelki where ime like '%Sams%' order by ime desc;
select * from Izdelki where Izdelki.cena_za_kos * (1.0 - Izdelki.popust / 100.0) between 36 and 39;


create table if not exists Izdelki_pri_narocilu(
	ID_narocila int not null,
    ID_izdelka int not null,
    kolicina int not null,
    cena double not null,
    constraint fk_idnarocila1
		foreign key (ID_narocila)
        references Narocila(ID_narocila),
	constraint fk_idizdelka
		foreign key (ID_izdelka)
        references Izdelki(ID_izdelka)
);
alter table Izdelki_pri_narocilu drop foreign key fk_idnarocila1;
insert into Izdelki_pri_narocilu values (50,12,1,100);
desc Izdelki_pri_narocilu;
select * from Izdelki_pri_narocilu;
insert into Izdelki_pri_narocilu values
(1,1,1,650.99);
update Izdelki_pri_narocilu set cena = 3392 where ID_narocila = 1;
delete from Izdelki_pri_narocilu where ID_narocila between 61 and 75;
alter table Izdelki_pri_narocilu add foreign key (ID_narocila)
        references Narocila(ID_narocila) on delete cascade on update cascade;
alter table Izdelki_pri_narocilu add foreign key (ID_izdelka)
        references Izdelki(ID_izdelka) on delete cascade on update cascade;

/**** INSERT DATA ****/
insert into Uporabniki values ('er@gmail.com', 'erik123', '12345');

select * from Narocila;
delete from Narocila where ID_narocila between 108 and 111;
delete from izdelki_pri_narocilu where ID_narocila between 108 and 111;
select max(ID_narocila) as MID from Narocila where ID_stranke = 7 and naslovDostave = 'ER';
select max(ID_narocila) as IDzadnjegaNarocila from Narocila where (ID_stranke = null or (imeStranke = 'q' and priimekStranke = 'w')) and naslovDostave = 'r';
insert into Narocila values (
	default,
    '2023-01-22 18:30:30',
    2,
    default
);
insert into Izdelki values
	(default, 'Samsung S21 FE 5G', 'mobilni telefon', 650.99, 3, 'Novi telefon Samsung', default, default, null),
    (default, 'Lenovo Tab M 10', 'tablica', 165.74, 1, 'Nova tablica Lenovo','tablični računalnik 4GB/64GB', 20, null),
    (default, 'Apple iPhone 12 mini', 'mobilni telefon', 559.00, 5, 'Novi telefon iPhone','Vrhunski mobilni telefon iPhone 12 mini je opremljen z osupljivim Super Retina XDR zaslonom velikosti 13,7 cm (5,4"), za brezhibno delo in zabavo pa bo poskrbel napreden in visoko zmogljiv čip A14 Bionic.', default, null),
    (default, 'Apple iPhone 14 Pro Max', 'mobilni telefon', 1696.00, 4, 'Novi telefon iPhone','17,02 cm (6,7") OLED Super Retina XDR zaslon z ločljivostjo 2796 × 1290 px, s širokim barvnim razponom HDR10, TrueTone in P3. Dynamic Island, Always-On, ProMotion s prilagodljivo frekvenco osveževanja 120 Hz, iOS 16, zelo zmogljiv A16 Bionic čip za maksimalno zmogljivost in znatno napredno strojno učenje.', default, null),
    (default, 'slušalke AirPods2', 'slušalke', 154.90, 7, 'Nove slušalke AirPods2','Apple slušalke AirPods2 s polnilnim ovitkom se takoj povežejo ter vas potopijo v bogat, visoko kakovosten zvok.', 5, null),
    (default, 'JBL Flip 5 prenosni zvočnik', 'zvočnik', 109.00, 2, 'Novi zvočnik JBL','Prenosni zvočnik navdušuje s svojo vzdržljivostjo in odpornostjo na zunanje vplive, saj je IPX7 vodoodporen. Hkrati je tudi zelo zmogljiv, omogoča namreč do 12 h poslušanja glasbe z izjemnim značilnim JBL zvokom in izrazitimi basi.', default, null),
    (default, 'Asus TUF Gaming A15 prenosnik', 'prenosnik', 799.90, 3, 'Novi prenosnik Asus','R5 4600H/ 16GB/SSD512GB/ GTX1650/15,6FHD/W11H Prenosnik serije TUF Gaming A15 prinaša 39,6 cm (15,6") velik IPS zaslon z visoko ločljivostjo Full HD (1920 × 1080) in hitrostjo osveževanja kar 144 Hz.', default, null),
    (default, 'Acer Nitro 5 prenosnik', 'prenosnik', 1053.73, 4, 'Novi prenosnik Acer','R7 5800H/16GB /SSD512GB/RTX3050 /15,6FHD/DOS Gaming prenosnik Nitro 5 je odlična izbira za vse ljubitelje igranja iger, ki hkrati želijo mobilnost. Poganja ga visoko zmogljiv procesor AMD Ryzen™ 7 5800H, za visoko grafično zmogljivost pa bo poskrbela samostojna grafična kartica NVIDIA GeForce RTX 3050.', default, null),
    (default, 'DELL P2422H monitor, 60,45 cm', 'monitor', 176.99, 2, 'Novi monitor Dell','Zaslon DELL P2422H ponuja zaslon z diagonalo 60,45 cm (23,8"), ločljivost Full HD 1920 × 1080, odlično sliko, polno prilagodljivost in eleganten dizajn.', default, null),
    (default, 'Samsung 8K televizor, Neo QLED', 'televizor', 4199.00, 1, 'Novi televizor Samsung','Vrhunski televizor Smart Neo QLED z ločljivostjo 8K Ultra HD (7680×4320) pri 163 cm (65“). Umetna inteligenca – Neural Quantum Processor 8K + Multi-Intelligence 20 nevronskih mrež, Q HDR 3000 (HDR10+ Adaptive, HLG), dvojni tuner DVB-T/T2 (HEVC/H.265) )/C/S/S/S/S2, operacijski sistem Tizen, Wi-Fi, spletni brskalnik, Bluetooth, AirPlay, DLNA, HbbTV, video klici, način igre, slika v sliki (PIP), predvajanje prek USB, snemanje oddaj prek USB, glasovno upravljanje (AJ). Povezljivost: 4× HDMI 2.1 (eARC), 3× USB 2.0, 1× LAN, 1× optični avdio izhod, 1× Cl+ (1.4).', 10, null),
    (default, 'JBL T570 brezžične slušalke', 'slušalke', 39.90, 4, 'Nove slušalke JBL','Naglavne JBL slušalke Tune T570 se ponašajo s kakovostnim zvokom, avtonomijo delovanja do kar 40 ur ter lahko in zložljivo zasnovo.', default, null)
;
insert into Izdelki values (default, 'Lorem ipsum dolor sit amet, consectetuer', 'Lorem ipsum dolor si', 39.90, 3, 'Lorem ipsum dolor sit amet, consectetuer','Naglavne JBL slušalke Tune T570 se ponašajo s kakovostnim zvokom, avtonomijo delovanja do kar 40 ur ter lahko in zložljivo zasnovo.', 90, null);
insert into Izdelki_pri_narocilu values
	(2, 67, 1, 650.99),
	(2, 76, 1, 3779.1)
;
insert into Racuni values (default, 2, '{}', '{}', '2023-01-27', 4430.09, null);
	

SET information_schema_stats_expiry = 0;
select auto_increment from information_schema.tables where table_schema = 'test2' and table_name = 'Narocila';
select * from Narocila;
select * from Izdelki_pri_narocilu;
select * from Racuni;
SHOW TABLE STATUS WHERE NAME LIKE "Narocila";
delete from Izdelki_pri_narocilu where ID_narocila = 76;
update Narocila set opravljeno = false where ID_narocila = 89;

select max(ID_narocila) from Narocila where ID_stranke = 7;

desc Narocila;
insert into Narocila values(default, str_to_date('07-25-2012','%m-%d-%Y'), 7,default,default,default,'A');
select * from Narocila;
select datum from Narocila where ID_narocila = 87;
select * from Racuni;

select * from Racuni where ID_racuna;
select * from Izdelki;
update Izdelki set kosov_na_voljo = kosov_na_voljo - 1 where ID_izdelka = 3;
select * from Racuni;
select * from Narocila;
select * from Uporabniki where uporabnisko_ime = 'Aleš';
select * from Stranke_in_zaposleni where ID = 19;
delete from Izdelki where ID_izdelka = 67;
update Izdelki set slika = default;





select distinct ID_stranke from Racuni inner join Narocila on Racuni.ID_narocila = Narocila.ID_narocila where ID_stranke is not null;
select ID from Stranke_in_zaposleni where uporabnisko_ime = 'Aleš';

select * from Racuni where ID_narocila in (select ID_narocila from Narocila where ID_stranke = (select ID from Stranke_in_zaposleni where uporabnisko_ime = 'Aleš'));

select slika from Izdelki where ID_izdelka = 37;
desc Izdelki;

select * from Izdelki where (Izdelki.cena_za_kos <= 500 and Izdelki.popust >= 0 and Izdelki.kosov_na_voljo > 0) order by rand();
select * from Izdelki where (Izdelki.cena_za_kos between 100 and 200 and Izdelki.popust >= 0 and Izdelki.kosov_na_voljo > 0) order by rand() limit 6;
select ID from Stranke_in_zaposleni where uporabnisko_ime = 'admin';
select * from stranke_in_zaposleni;
desc Stranke_in_zaposleni;
insert into Stranke_in_zaposleni(uporabnisko_ime, elektronski_naslov, ime, priimek) values('admin','admin@gmail.com','admin','admin');


