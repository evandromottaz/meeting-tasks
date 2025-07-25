PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "volunteers" (

		id INTEGER PRIMARY KEY,

		"volunteer_name" TEXT NOT NULL,

		created TEXT DEFAULT (datetime ('now', '-3 hours'))

	) STRICT;
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
CREATE TABLE roles (

		id INTEGER PRIMARY KEY,

		role_title TEXT NOT NULL,

		created TEXT DEFAULT (datetime ('now', '-3 hours'))

	) STRICT;
INSERT INTO roles VALUES(3,'Microfone Volante','2025-07-24 09:33:23');
INSERT INTO roles VALUES(4,'Leitor Livro','2025-07-24 09:33:23');
INSERT INTO roles VALUES(5,'Leitor Sentinela','2025-07-25 11:02:00');
INSERT INTO roles VALUES(6,'Indicador Entrada','2025-07-25 11:11:28');
INSERT INTO roles VALUES(7,'Indicador Auditório','2025-07-25 11:11:37');
CREATE TABLE IF NOT EXISTS "permissions" (

		id INTEGER PRIMARY KEY,

		"volunteer_id" INTEGER NOT NULL REFERENCES "volunteers" (id) ON DELETE CASCADE,

		role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,

		created TEXT DEFAULT (datetime ('now', '-3 hours')),

		UNIQUE ("volunteer_id", role_id)

	) STRICT;
CREATE TABLE designacoes (

		id INTEGER PRIMARY KEY,

		data_iso TEXT NOT NULL,

		role_id INTEGER NOT NULL REFERENCES roles (id),

		"volunteer_id" INTEGER NOT NULL REFERENCES "volunteers" (id),

		created TEXT DEFAULT (datetime ('now', '-3 hours'))

	) STRICT;
CREATE TABLE ausencias (

		data_iso TEXT NOT NULL,

		"volunteer_id" INTEGER NOT NULL,

		role_id INTEGER NOT NULL,

		motivo TEXT,

		created TEXT DEFAULT (datetime ('now', '-3 hours')),

		FOREIGN KEY (data_iso, role_id, "volunteer_id") REFERENCES designacoes (data_iso, role_id, "volunteer_id") ON DELETE CASCADE ON UPDATE CASCADE

	) STRICT;
CREATE VIEW designacoes_info AS

SELECT

	d.id,

	d.data_iso AS data,

	p.role_title AS papel,

	u."volunteer_name" AS usuario

FROM

	designacoes AS d

	INNER JOIN roles AS p ON p.id = d.role_id

	INNER JOIN "volunteers" AS u ON u.id = d."volunteer_name";
COMMIT;
