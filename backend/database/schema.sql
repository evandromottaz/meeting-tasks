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
CREATE TABLE tasks (

		id INTEGER PRIMARY KEY,

		task_title TEXT NOT NULL,

		created TEXT DEFAULT (datetime ('now', '-3 hours'))

	) STRICT;
INSERT INTO tasks VALUES(3,'Microfone Volante','2025-07-24 09:33:23');
INSERT INTO tasks VALUES(4,'Leitor Livro','2025-07-24 09:33:23');
INSERT INTO tasks VALUES(5,'Leitor Sentinela','2025-07-25 11:02:00');
INSERT INTO tasks VALUES(6,'Indicador Entrada','2025-07-25 11:11:28');
INSERT INTO tasks VALUES(7,'Indicador Auditório','2025-07-25 11:11:37');
CREATE TABLE IF NOT EXISTS "permissions" (

		id INTEGER PRIMARY KEY,

		"volunteer_id" INTEGER NOT NULL REFERENCES "volunteers" (id) ON DELETE CASCADE,

		task_id INTEGER NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,

		created TEXT DEFAULT (datetime ('now', '-3 hours')),

		UNIQUE ("volunteer_id", task_id)

	) STRICT;
CREATE TABLE meetings (

		id INTEGER PRIMARY KEY,

		date_iso TEXT NOT NULL,

		task_id INTEGER NOT NULL REFERENCES tasks (id),

		"volunteer_id" INTEGER NOT NULL REFERENCES "volunteers" (id),

		created TEXT DEFAULT (datetime ('now', '-3 hours'))

	) STRICT;

CREATE VIEW meetings_info AS

SELECT

	d.id,

	d.date_iso AS data,

	p.task_title AS papel,

	u."volunteer_name" AS usuario

FROM

	meetings AS d

	INNER JOIN tasks AS p ON p.id = d.task_id

	INNER JOIN "volunteers" AS u ON u.id = d."volunteer_name";
COMMIT;
