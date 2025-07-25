PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "volunteers" (
  id INTEGER PRIMARY KEY,
  "volunteer_name" TEXT NOT NULL,
  criado TEXT DEFAULT (datetime('now', '-3 hours'))
) STRICT;
INSERT INTO volunteers VALUES(1,'Novo Nome','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(2,'Paulo Filho','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(3,'Paulo pai','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(4,'Ulisses','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(5,'Pedro Souza','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(6,'Luis Martins','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(7,'Gustavo','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(8,'Hobert','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(9,'Hugo','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(10,'Evandro','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(11,'Genivaldo','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(12,'Sílvio','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(13,'Jonatã','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(14,'Sabino','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(15,'Vladimir','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(16,'Roberto','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(17,'Rogério','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(18,'Ocimar','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(19,'Carlos','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(21,'Azene','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(22,'João','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(23,'Júlio','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(24,'Adriel','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(25,'Ronaldo','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(26,'Antônio Carlos','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(27,'Osvaldo','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(28,'Roni','2025-07-24 09:33:23');
INSERT INTO volunteers VALUES(29,'Evandro','2025-07-24 17:28:07');
INSERT INTO volunteers VALUES(30,'Antigo Nome','2025-07-24 17:28:07');
INSERT INTO volunteers VALUES(31,'Evandro','2025-07-24 17:29:51');
INSERT INTO volunteers VALUES(32,'Antigo Nome','2025-07-24 17:29:51');
INSERT INTO volunteers VALUES(33,'Evandro','2025-07-24 17:29:59');
INSERT INTO volunteers VALUES(34,'Antigo Nome','2025-07-24 17:29:59');
INSERT INTO volunteers VALUES(35,'Evandro','2025-07-24 17:35:15');
INSERT INTO volunteers VALUES(36,'Antigo Nome','2025-07-24 17:35:15');
INSERT INTO volunteers VALUES(37,'Evandro','2025-07-24 17:39:05');
INSERT INTO volunteers VALUES(38,'Antigo Nome','2025-07-24 17:39:05');
INSERT INTO volunteers VALUES(39,'Evandro','2025-07-24 17:40:19');
INSERT INTO volunteers VALUES(40,'Antigo Nome','2025-07-24 17:40:19');
CREATE TABLE papeis (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL COLLATE NOCASE UNIQUE,
  criado TEXT DEFAULT (datetime('now', '-3 hours'))
) STRICT;
INSERT INTO papeis VALUES(1,'Indicador Entrada','2025-07-24 09:33:23');
INSERT INTO papeis VALUES(2,'Indicador Auditório','2025-07-24 09:33:23');
INSERT INTO papeis VALUES(3,'Microfone Volante','2025-07-24 09:33:23');
INSERT INTO papeis VALUES(4,'Leitor','2025-07-24 09:33:23');
INSERT INTO papeis VALUES(5,'Leitor duplicado','2025-07-24 11:33:51');
CREATE TABLE privilegios (
  id INTEGER PRIMARY KEY,
  "volunteer_name" INTEGER NOT NULL REFERENCES "volunteers"(id) ON DELETE CASCADE,
  papel_id INTEGER NOT NULL REFERENCES papeis(id) ON DELETE CASCADE,
  criado TEXT DEFAULT (datetime('now', '-3 hours')),
  UNIQUE("volunteer_name", papel_id)
) STRICT;
CREATE TABLE designacoes (
	id INTEGER PRIMARY KEY,
  data_iso TEXT NOT NULL,
  papel_id INTEGER NOT NULL REFERENCES papeis(id),
  "volunteer_name" INTEGER NOT NULL REFERENCES "volunteers"(id),
  criado TEXT DEFAULT (datetime('now', '-3 hours')),
  UNIQUE (data_iso, papel_id, "volunteer_name")
) STRICT;
CREATE TABLE ausencias (
  data_iso TEXT NOT NULL,
  "volunteer_name" INTEGER NOT NULL,
  papel_id INTEGER NOT NULL,
  motivo TEXT,
  criado TEXT DEFAULT (datetime('now', '-3 hours')),
  FOREIGN KEY (data_iso, papel_id, "volunteer_name") REFERENCES designacoes(data_iso, papel_id, "volunteer_name") ON DELETE CASCADE ON UPDATE CASCADE
) STRICT;
CREATE VIEW designacoes_info AS
SELECT d.id, d.data_iso AS data, p.titulo AS papel, u."volunteer_name" AS usuario
FROM designacoes AS d
INNER JOIN papeis AS p ON p.id = d.papel_id
INNER JOIN "volunteers" AS u ON u.id = d."volunteer_name";
COMMIT;
