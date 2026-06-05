const Database = require('better-sqlite3');

let db;

function initDB(path = './data.sqlite') {
  if (db) return db;
  db = new Database(path);
  db.pragma('foreign_keys = ON');
  return db;
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
}

function createSchema() {
  const d = getDB();

  d.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
        CHECK(role IN ('student','teacher','admin'))
        DEFAULT 'student',
    bio TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS groups (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id INTEGER,
    description TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tests (
    code TEXT PRIMARY KEY,
    template_id INTEGER,
    owner_id INTEGER,
    group_code TEXT,
    title TEXT NOT NULL,
    category TEXT DEFAULT '',
    min_score REAL DEFAULT 60,
    show_answers INTEGER DEFAULT 0,
    allow_retries INTEGER DEFAULT 0,
    shuffle_questions INTEGER DEFAULT 0,
    shuffle_answers INTEGER DEFAULT 0,
    settings TEXT DEFAULT '{}',
    description TEXT DEFAULT '',
    instructions TEXT DEFAULT '',
    status TEXT
        CHECK(status IN ('draft','published','closed'))
        DEFAULT 'draft',
    time_limit_minutes INTEGER,
    published_at TEXT,
    due_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(template_id)
        REFERENCES quiz_templates(id)
        ON DELETE SET NULL,

    FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY(group_code)
        REFERENCES groups(code)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS test_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_code TEXT NOT NULL,
    original_question_id INTEGER,
    section_title TEXT,
    position INTEGER DEFAULT 0,
    question TEXT NOT NULL,
    type TEXT NOT NULL,
    metadata TEXT,
    correct_answer TEXT,
    pts INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(test_code)
        REFERENCES tests(code)
        ON DELETE CASCADE,

    FOREIGN KEY(original_question_id)
        REFERENCES questions(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS quiz_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    instructions TEXT DEFAULT '',
    time_limit_minutes INTEGER,
    shuffle_questions INTEGER DEFAULT 0,
    shuffle_answers INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS template_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(template_id)
        REFERENCES quiz_templates(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    type TEXT NOT NULL,
    source_type TEXT CHECK(source_type IN ('bank','quiz')) DEFAULT 'bank',
    metadata TEXT,
    correct_answer TEXT,
    difficulty TEXT DEFAULT 'medium',
    category TEXT DEFAULT '',
    is_public INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS template_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_section_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    pts INTEGER DEFAULT 1,
    required INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(template_section_id)
        REFERENCES template_sections(id)
        ON DELETE CASCADE,

    FOREIGN KEY(question_id)
        REFERENCES questions(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    test_code TEXT NOT NULL,
    status TEXT
        CHECK(status IN ('in_progress','submitted','graded'))
        DEFAULT 'in_progress',
    started_at TEXT DEFAULT (datetime('now')),
    submitted_at TEXT,
    graded_at TEXT,
    score REAL DEFAULT 0,
    max_score REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(test_code)
        REFERENCES tests(code)
        ON DELETE CASCADE
);

-- Indexes to speed ownership queries
CREATE INDEX IF NOT EXISTS idx_groups_owner
    ON groups(owner_id);

CREATE INDEX IF NOT EXISTS idx_tests_owner
    ON tests(owner_id);

CREATE INDEX IF NOT EXISTS idx_templates_owner
    ON quiz_templates(owner_id);

CREATE TABLE IF NOT EXISTS attempt_answers (
    attempt_id INTEGER NOT NULL,
    test_question_id INTEGER NOT NULL,
    response TEXT,
    pts_obtained REAL DEFAULT 0,
    feedback TEXT,
    graded_by INTEGER,
    graded_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    PRIMARY KEY(attempt_id, test_question_id),

    FOREIGN KEY(attempt_id)
        REFERENCES attempts(id)
        ON DELETE CASCADE,

    FOREIGN KEY(test_question_id)
        REFERENCES test_questions(id)
        ON DELETE CASCADE,

    FOREIGN KEY(graded_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- association: users in groups (many-to-many)
CREATE TABLE IF NOT EXISTS user_groups (
    user_id INTEGER NOT NULL,
    group_code TEXT NOT NULL,
    role_in_group TEXT DEFAULT 'member',
    created_at TEXT DEFAULT (datetime('now')),

    PRIMARY KEY(user_id, group_code),

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(group_code)
        REFERENCES groups(code)
        ON DELETE CASCADE
);`);

  return d;
}

module.exports = { initDB, getDB, createSchema };
