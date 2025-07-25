CREATE TABLE IF NOT EXISTS "volunteers" (
  id INTEGER PRIMARY KEY,
  "volunteer_name" TEXT NOT NULL,
  criado TEXT DEFAULT (datetime('now', '-3 hours'))
) STRICT;
CREATE TABLE papeis (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL COLLATE NOCASE UNIQUE,
  criado TEXT DEFAULT (datetime('now', '-3 hours'))
) STRICT;
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
INNER JOIN "volunteers" AS u ON u.id = d."volunteer_name"
/* designacoes_info(id,data,papel,usuario) */;
