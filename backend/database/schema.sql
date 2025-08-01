PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE
	IF NOT EXISTS "volunteers" (
		id INTEGER PRIMARY KEY,
		"volunteer_name" TEXT NOT NULL UNIQUE COLLATE NOCASE,
		created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
	) STRICT;

INSERT INTO
	volunteers
VALUES
	(0, 'Evandro', '2025-07-29 09:56:32');

INSERT INTO
	volunteers
VALUES
	(1, 'Júlio', '2025-07-29 09:56:40');

INSERT INTO
	volunteers
VALUES
	(2, 'Paulo', '2025-07-29 09:56:48');

INSERT INTO
	volunteers
VALUES
	(3, 'João', '2025-07-29 09:56:56');

INSERT INTO
	volunteers
VALUES
	(4, 'Jonatã', '2025-07-29 09:57:04');

INSERT INTO
	volunteers
VALUES
	(5, 'Hugo', '2025-07-29 09:57:12');

INSERT INTO
	volunteers
VALUES
	(6, 'José', '2025-07-29 09:57:20');

INSERT INTO
	volunteers
VALUES
	(7, 'Sílvio', '2025-07-29 09:57:28');

INSERT INTO
	volunteers
VALUES
	(8, 'Rogério', '2025-07-29 09:57:36');

CREATE TABLE
	tasks (
		id INTEGER PRIMARY KEY,
		task_title TEXT NOT NULL UNIQUE COLLATE NOCASE,
		created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
	) STRICT;

INSERT INTO
	tasks
VALUES
	(1, 'Presidente', '2025-07-29 09:57:35');

INSERT INTO
	tasks
VALUES
	(
		2,
		'Tesouros da Palavra e Deus',
		'2025-07-29 09:57:40'
	);

INSERT INTO
	tasks
VALUES
	(
		3,
		'Encontre de Joias Espirituais',
		'2025-07-29 09:57:45'
	);

INSERT INTO
	tasks
VALUES
	(4, 'Estudo de Livro', '2025-07-29 09:57:50');

INSERT INTO
	tasks
VALUES
	(
		5,
		'Leitor do Estudo de Livro',
		'2025-07-29 09:57:55'
	);

INSERT INTO
	tasks
VALUES
	(6, 'Discurso', '2025-07-29 09:58:00');

INSERT INTO
	tasks
VALUES
	(7, 'Apresentação', '2025-07-29 09:58:05');

INSERT INTO
	tasks
VALUES
	(8, 'Leitura da Bíblia', '2025-07-29 09:58:10');

CREATE TABLE
	IF NOT EXISTS "permissions" (
		id INTEGER PRIMARY KEY,
		"volunteer_id" INTEGER NOT NULL REFERENCES "volunteers" (id) ON DELETE CASCADE,
		task_id INTEGER NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
		created_at TEXT DEFAULT (datetime ('now', '-3 hours')),
		UNIQUE ("volunteer_id", task_id)
	) STRICT;

INSERT INTO
	permissions
VALUES
	(1, 0, 1, '2025-07-29 09:59:06');

INSERT INTO
	permissions
VALUES
	(2, 5, 2, '2025-07-29 09:59:22');

INSERT INTO
	permissions
VALUES
	(3, 2, 3, '2025-07-29 09:59:38');

INSERT INTO
	permissions
VALUES
	(4, 3, 8, '2025-07-29 09:59:54');

INSERT INTO
	permissions
VALUES
	(5, 1, 7, '2025-07-29 10:00:10');

INSERT INTO
	permissions
VALUES
	(6, 4, 7, '2025-07-29 10:00:26');

INSERT INTO
	permissions
VALUES
	(7, 6, 4, '2025-07-29 10:00:42');

INSERT INTO
	permissions
VALUES
	(8, 7, 5, '2025-07-29 10:00:58');

CREATE TABLE
	meetings (
		date_iso TEXT NOT NULL PRIMARY KEY,
		chairman_id INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		"treasures_talker_id" INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		treasures_title TEXT,
		spiritual_gems_director_id INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		book_study_director_id INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		book_study_reader_id INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
	) WITHOUT ROWID,
	STRICT;

INSERT INTO
	meetings
VALUES
	(
		'2025-09-30',
		0,
		5,
		'Nome da parte de tesouros',
		2,
		6,
		7,
		'2025-07-29 10:20:19'
	);

CREATE TABLE
	meetings_christian_life (
		id INTEGER PRIMARY KEY,
		meeting_date TEXT NOT NULL REFERENCES meetings (date_iso) ON DELETE CASCADE,
		title TEXT NOT NULL,
		"director_id" INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
	);

INSERT INTO
	meetings_christian_life
VALUES
	(
		1,
		'2025-09-30',
		'Título nossa vida cristã',
		8,
		'2025-07-29 10:20:19'
	);

INSERT INTO
	meetings_christian_life
VALUES
	(
		2,
		'2025-09-30',
		'Outra parte',
		3,
		'2025-07-29 15:27:54'
	);

CREATE TABLE
	IF NOT EXISTS "meetings_field_ministry" (
		id INTEGER PRIMARY KEY,
		meeting_date TEXT NOT NULL REFERENCES meetings (date_iso) ON DELETE CASCADE,
		student_id INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		helper_id INTEGER REFERENCES volunteers (id) ON DELETE SET NULL,
		title TEXT,
		"task_id" INTEGER REFERENCES tasks (id) ON DELETE SET NULL,
		created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
	);

INSERT INTO
	meetings_field_ministry
VALUES
	(
		1,
		'2025-09-30',
		1,
		4,
		'Primeira conversa',
		7,
		'2025-07-29 10:20:19'
	);

INSERT INTO
	meetings_field_ministry
VALUES
	(
		2,
		'2025-09-30',
		3,
		NULL,
		NULL,
		8,
		'2025-07-29 10:20:19'
	);

CREATE VIEW
	`meetings_overview` AS
SELECT
	meetings.date_iso AS date_iso,
	chairman.id AS chairman_id,
	chairman.volunteer_name AS chairman_name,
	treasures_talker.id AS treasures_talker_id,
	treasures_talker.volunteer_name AS treasures_talker_name,
	meetings.treasures_title,
	spiritual_gems_director.id AS spiritual_gems_director_id,
	spiritual_gems_director.volunteer_name AS spiritual_gems_director_name,
	book_study_director.id AS book_study_director_id,
	book_study_director.volunteer_name AS book_study_director_name,
	book_study_reader.id AS book_study_reader_id,
	book_study_reader.volunteer_name AS book_study_reader_name
FROM
	meetings
	INNER JOIN volunteers chairman ON chairman.id = meetings.chairman_id
	INNER JOIN volunteers treasures_talker ON treasures_talker.id = meetings."treasures_talker_id"
	INNER JOIN volunteers spiritual_gems_director ON spiritual_gems_director.id = meetings.spiritual_gems_director_id
	INNER JOIN volunteers book_study_director ON book_study_director.id = meetings.book_study_director_id
	INNER JOIN volunteers book_study_reader ON book_study_reader.id = meetings.book_study_reader_id
ORDER BY
	meetings.created_at;

CREATE VIEW
	`meetings_field_ministry_overview` AS
SELECT
	m.id,
	m.meeting_date,
	m.student_id,
	student.volunteer_name AS student_name,
	m.helper_id,
	helper.volunteer_name AS helper_name,
	m.title
FROM
	meetings_field_ministry m
	INNER JOIN volunteers student ON student.id = m.student_id
	LEFT JOIN volunteers helper ON helper.id = m.helper_id
ORDER BY
	m.created_at;

CREATE VIEW
	`meetings_christian_life_overview` AS
SELECT
	m.id,
	m.meeting_date,
	m.director_id,
	v.volunteer_name AS director_name,
	m.title
FROM
	meetings_christian_life m
	INNER JOIN volunteers v ON v.id = m.director_id
ORDER BY
	m.created_at;

COMMIT;