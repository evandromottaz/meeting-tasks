PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  criado TEXT DEFAULT (datetime('now', '-3 hours'))
) STRICT;
INSERT INTO usuarios VALUES(1,'José Alves','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(2,'Paulo Filho','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(3,'Paulo pai','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(4,'Ulisses','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(5,'Pedro Souza','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(6,'Luis Martins','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(7,'Gustavo','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(8,'Hobert','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(9,'Hugo','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(10,'Evandro','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(11,'Genivaldo','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(12,'Sílvio','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(13,'Jonatã','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(14,'Sabino','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(15,'Vladimir','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(16,'Roberto','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(17,'Rogério','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(18,'Ocimar','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(19,'Carlos','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(20,'Parra','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(21,'Azene','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(22,'João','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(23,'Júlio','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(24,'Adriel','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(25,'Ronaldo','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(26,'Antônio Carlos','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(27,'Osvaldo','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(28,'Roni','2025-07-24 09:33:23');
INSERT INTO usuarios VALUES(29,'Evandro duplicado','2025-07-24 10:01:31');
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
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  papel_id INTEGER NOT NULL REFERENCES papeis(id) ON DELETE CASCADE,
  criado TEXT DEFAULT (datetime('now', '-3 hours')),
  UNIQUE(usuario_id, papel_id)
) STRICT;
CREATE TABLE designacoes (
  data_iso TEXT NOT NULL,
  papel_id INTEGER NOT NULL REFERENCES papeis(id),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  criado TEXT DEFAULT (datetime('now', '-3 hours')),
  PRIMARY KEY (data_iso, papel_id, usuario_id)
) STRICT;
CREATE TABLE ausencias (
  data_iso TEXT NOT NULL,
  usuario_id INTEGER NOT NULL,
  papel_id INTEGER NOT NULL,
  motivo TEXT,
  criado TEXT DEFAULT (datetime('now', '-3 hours')),
  FOREIGN KEY (data_iso, papel_id, usuario_id) REFERENCES designacoes(data_iso, papel_id, usuario_id) ON DELETE CASCADE
) STRICT;
COMMIT;
