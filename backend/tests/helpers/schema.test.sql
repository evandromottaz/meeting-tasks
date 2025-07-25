CREATE TABLE IF NOT EXISTS "volunteers" (
		id INTEGER PRIMARY KEY,
		"volunteer_name" TEXT NOT NULL,
		created TEXT DEFAULT (datetime ('now', '-3 hours'))
	) STRICT;
CREATE TABLE roles (
		id INTEGER PRIMARY KEY,
		role_title TEXT NOT NULL,
		created TEXT DEFAULT (datetime ('now', '-3 hours'))
	) STRICT;
CREATE TABLE privilegios (
		id INTEGER PRIMARY KEY,
		"volunteer_name" INTEGER NOT NULL REFERENCES "volunteers" (id) ON DELETE CASCADE,
		role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
		created TEXT DEFAULT (datetime ('now', '-3 hours')),
		UNIQUE ("volunteer_name", role_id)
	) STRICT;
CREATE TABLE designacoes (
		id INTEGER PRIMARY KEY,
		data_iso TEXT NOT NULL,
		role_id INTEGER NOT NULL REFERENCES roles (id),
		"volunteer_name" INTEGER NOT NULL REFERENCES "volunteers" (id),
		created TEXT DEFAULT (datetime ('now', '-3 hours'))
	) STRICT;
CREATE TABLE ausencias (
		data_iso TEXT NOT NULL,
		"volunteer_name" INTEGER NOT NULL,
		role_id INTEGER NOT NULL,
		motivo TEXT,
		created TEXT DEFAULT (datetime ('now', '-3 hours')),
		FOREIGN KEY (data_iso, role_id, "volunteer_name") REFERENCES designacoes (data_iso, role_id, "volunteer_name") ON DELETE CASCADE ON UPDATE CASCADE
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
	INNER JOIN "volunteers" AS u ON u.id = d."volunteer_name"
/* designacoes_info(id,data,papel,usuario) */;
