PRAGMA foreign_keys=1;

PRAGMA journal_mode = WAL; -- Persiste
PRAGMA synchronous = NORMAL;

PRAGMA cache_size = 2000;
PRAGMA busy_timeout = 5000;
PRAGMA temp_store = memory;

PRAGMA analysis_limit = 1000;
PRAGMA optimize = 0x10002;

BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "volunteers" (
	id INTEGER PRIMARY KEY,
	"volunteer_name" TEXT NOT NULL UNIQUE COLLATE NOCASE,
	created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
) STRICT;

CREATE TABLE tasks (
	id INTEGER PRIMARY KEY,
	task_title TEXT NOT NULL UNIQUE COLLATE NOCASE,
	created_at TEXT DEFAULT (datetime ('now', '-3 hours'))
) STRICT;

CREATE TABLE IF NOT EXISTS "permissions" (
	id INTEGER PRIMARY KEY,
	"volunteer_id" INTEGER NOT NULL REFERENCES "volunteers" (id) ON DELETE CASCADE,
	task_id INTEGER NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
	created_at TEXT DEFAULT (datetime ('now', '-3 hours')),
	UNIQUE ("volunteer_id", task_id)
) STRICT;

CREATE TABLE meetings (
    date_iso TEXT NOT NULL PRIMARY KEY,
    chairman TEXT NOT NULL,
    treasures_part TEXT NOT NULL,
    spiritual_gems TEXT NOT NULL,
    discourse TEXT,
    bible_reading TEXT NOT NULL,
    living_as_christians TEXT NOT NULL,
    book_study TEXT,
    created_at TEXT DEFAULT (datetime('now', '-3 hours'))
) WITHOUT ROWID, STRICT;
COMMIT;
