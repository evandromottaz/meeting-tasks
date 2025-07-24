CREATE TABLE usuarios (

  id INTEGER PRIMARY KEY,

  nome TEXT NOT NULL,

  criado TEXT DEFAULT (datetime('now', '-3 hours'))

) STRICT;
CREATE TABLE papeis (

  id INTEGER PRIMARY KEY,

  titulo TEXT NOT NULL COLLATE NOCASE UNIQUE,

  criado TEXT DEFAULT (datetime('now', '-3 hours'))

) STRICT;
CREATE TABLE privilegios (

  id INTEGER PRIMARY KEY,

  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

  papel_id INTEGER NOT NULL REFERENCES papeis(id) ON DELETE CASCADE,

  criado TEXT DEFAULT (datetime('now', '-3 hours')),

  UNIQUE(usuario_id, papel_id)

) STRICT;
CREATE TABLE designacoes (

  id INTEGER PRIMARY KEY,

  data_iso TEXT NOT NULL,

  papel_id INTEGER NOT NULL REFERENCES papeis(id),

  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),

  criado TEXT DEFAULT (datetime('now', '-3 hours')),

  UNIQUE (data_iso, papel_id, usuario_id)

) STRICT;
CREATE TABLE ausencias (

  data_iso TEXT NOT NULL,

  usuario_id INTEGER NOT NULL,

  papel_id INTEGER NOT NULL,

  motivo TEXT,

  criado TEXT DEFAULT (datetime('now', '-3 hours')),

  FOREIGN KEY (data_iso, papel_id, usuario_id) REFERENCES designacoes(data_iso, papel_id, usuario_id) ON DELETE CASCADE ON UPDATE CASCADE

) STRICT;
CREATE VIEW designacoes_info AS

SELECT d.id, d.data_iso AS data, p.titulo AS papel, u.nome AS usuario

FROM designacoes AS d

INNER JOIN papeis AS p ON p.id = d.papel_id

INNER JOIN usuarios AS u ON u.id = d.usuario_id
/* designacoes_info(id,data,papel,usuario) */;
