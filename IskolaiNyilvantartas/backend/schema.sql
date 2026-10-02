CREATE DATABASE IskolaiNyilvantartas DEFAULT CHARACTER SET UTF8 COLLATE UTF8_HUNGARIAN_CI;

USE IskolaiNyilvantartas;

CREATE TABLE osztalyok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(255),
    szak VARCHAR(255),
    evfolyam INT
);

CREATE TABLE diakok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(255),
    email VARCHAR(255),
    osztaly_id INT,
    CONSTRAINT fk_diak FOREIGN KEY (osztaly_id) REFERENCES osztalyok(id)
);

INSERT INTO osztalyok (nev, szak, evfolyam) VALUES
('9.A', 'Informatika', 9),
('9.B', 'Gépészet', 9),
('9.C', 'Kereskedelem', 9),
('10.A', 'Informatika', 10),
('10.B', 'Gépészet', 10),
('10.C', 'Közgazdaság', 10),
('11.A', 'Informatika', 11),
('11.B', 'Elektrotechnika', 11),
('12.A', 'Informatika', 12),
('12.B', 'Közgazdaság', 12);

INSERT INTO diakok (nev, email, osztaly_id) VALUES
('Kovács Bence', 'kovacs.bence@example.com', 1),
('Nagy Anna', 'nagy.anna@example.com', 1),
('Szabó Dávid', 'szabo.david@example.com', 1),
('Horváth Eszter', 'horvath.eszter@example.com', 1),
('Tóth Máté', 'toth.mate@example.com', 1),

('Varga Levente', 'varga.levente@example.com', 2),
('Kiss Lili', 'kiss.lili@example.com', 2),
('Molnár Ádám', 'molnar.adam@example.com', 2),
('Németh Petra', 'nemeth.petra@example.com', 2),
('Farkas Zoltán', 'farkas.zoltan@example.com', 2),

('Balogh Dóra', 'balogh.dora@example.com', 3),
('Papp Márk', 'papp.mark@example.com', 3),
('Lakatos Réka', 'lakatos.reka@example.com', 3),
('Takács Gergő', 'takacs.gergo@example.com', 3),
('Juhász Vivien', 'juhasz.vivien@example.com', 3),

('Mészáros Áron', 'meszaros.aron@example.com', 4),
('Oláh Zsófia', 'olah.zsofia@example.com', 4),
('Simon Péter', 'simon.peter@example.com', 4),
('Rácz Nóra', 'racz.nora@example.com', 4),
('Fekete Tamás', 'fekete.tamas@example.com', 4),

('Kerekes Gábor', 'kerekes.gabor@example.com', 5),
('Sipos Laura', 'sipos.laura@example.com', 5),
('Bíró Kristóf', 'biro.kristof@example.com', 5),
('Vincze Emese', 'vincze.emese@example.com', 5),
('Fodor Roland', 'fodor.roland@example.com', 5),

('Bognár Eszter', 'bognar.eszter@example.com', 6),
('Pintér Balázs', 'pinter.balazs@example.com', 6),
('Szalai Boglárka', 'szalai.boglarka@example.com', 6),
('Hegedűs András', 'hegedus.andras@example.com', 6),
('Vass Fanni', 'vass.fanni@example.com', 6),

('Kocsis Dániel', 'kocsis.daniel@example.com', 7),
('Gál Júlia', 'gal.julia@example.com', 7),
('Veres Bálint', 'veres.balint@example.com', 7),
('Barta Dorina', 'barta.dorina@example.com', 7),
('Sárközi Norbert', 'sarkozi.norbert@example.com', 7),

('Kelemen Csenge', 'kelemen.csenge@example.com', 8),
('Somogyi Martin', 'somogyi.martin@example.com', 8),
('Boros Kinga', 'boros.kinga@example.com', 8),
('Illés Patrik', 'illes.patrik@example.com', 8),
('Dudás Alexandra', 'dudas.alexandra@example.com', 8),

('Makrai Zsolt', 'makrai.zsolt@example.com', 9),
('Katona Gréta', 'katona.greta@example.com', 9),
('Pálfi Gábor', 'palfi.gabor@example.com', 9),
('Benkő Luca', 'benko.luca@example.com', 9),
('Szűcs Erik', 'szucs.erik@example.com', 9),

('Váradi Mónika', 'varadi.monika@example.com', 10),
('Erdős Ákos', 'erdos.akos@example.com', 10),
('Király Sára', 'kiraly.sara@example.com', 10),
('Balla Milán', 'balla.milan@example.com', 10),
('Kárpáti Noémi', 'karpati.noemi@example.com', 10);
