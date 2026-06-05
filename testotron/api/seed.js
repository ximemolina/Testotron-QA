const bcrypt = require('bcrypt');
const { getDB } = require('./db');

function seed() {
  const db = getDB();

  console.log('🌱 Seed iniciando...');

  const hash = bcrypt.hashSync('pass', 10);

  // =====================================
  // CLEAN DATA
  // =====================================

  db.prepare('DELETE FROM attempt_answers').run();
  db.prepare('DELETE FROM attempts').run();
  db.prepare('DELETE FROM test_questions').run();
  db.prepare('DELETE FROM tests').run();
  db.prepare('DELETE FROM user_groups').run();
  db.prepare('DELETE FROM groups').run();

  // =====================================
  // USERS
  // =====================================

  db.prepare(`
    INSERT OR REPLACE INTO users
    (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    1,
    'Admin',
    'admin@test.com',
    hash,
    'admin'
  );

  db.prepare(`
    INSERT OR REPLACE INTO users
    (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    2,
    'Docente',
    'teacher@test.com',
    hash,
    'teacher'
  );

  db.prepare(`
    INSERT OR REPLACE INTO users
    (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    3,
    'Estudiante 1',
    'student1@test.com',
    hash,
    'student'
  );

  db.prepare(`
    INSERT OR REPLACE INTO users
    (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    4,
    'Estudiante 2',
    'student2@test.com',
    hash,
    'student'
  );

  // =====================================
  // GROUP
  // =====================================

  db.prepare(`
    INSERT INTO groups
    (code, name, owner_id, description)
    VALUES (?, ?, ?, ?)
  `).run(
    'ABC12',
    'Grupo Matemáticas',
    2,
    'Grupo de prueba'
  );

  // =====================================
  // USER GROUPS
  // =====================================

  db.prepare(`
    INSERT INTO user_groups
    (user_id, group_code)
    VALUES (?, ?)
  `).run(3, 'ABC12');

  db.prepare(`
    INSERT INTO user_groups
    (user_id, group_code)
    VALUES (?, ?)
  `).run(4, 'ABC12');

  // =====================================
  // TEST
  // =====================================

  db.prepare(`
    INSERT INTO tests
    (
      code,
      owner_id,
      group_code,
      title,
      description,
      status,
      min_score
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'TEST01',
    2,
    'ABC12',
    'Examen Demo',
    'Examen inicial',
    'published',
    60
  );

  // =====================================
  // QUESTIONS
  // =====================================

  db.prepare(`
    INSERT INTO test_questions
    (
      id,
      test_code,
      original_question_id,
      section_title,
      position,
      question,
      type,
      metadata,
      correct_answer,
      pts
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    1,
    'TEST01',
    null,
    null,
    1,
    '¿Cuánto es 2 + 2?',
    'multiple_choice',
    JSON.stringify({
      options: ['3', '4', '5']
    }),
    '1',
    1
  );

  db.prepare(`
    INSERT INTO test_questions
    (
      id,
      test_code,
      original_question_id,
      section_title,
      position,
      question,
      type,
      metadata,
      correct_answer,
      pts
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    2,
    'TEST01',
    null,
    null,
    2,
    'Capital de Chile',
    'multiple_choice',
    JSON.stringify({
      options: [
        'Santiago',
        'Valparaíso',
        'Lima'
      ]
    }),
    '0',
    1
  );

  // =====================================
  // ATTEMPT
  // =====================================

  db.prepare(`
    INSERT INTO attempts
    (
      id,
      user_id,
      test_code,
      status,
      score,
      max_score
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    1,
    3,
    'TEST01',
    'graded',
    2,
    2
  );

  // =====================================
  // ATTEMPT ANSWERS
  // =====================================

  db.prepare(`
    INSERT INTO attempt_answers
    (
      attempt_id,
      test_question_id,
      response,
      pts_obtained,
      feedback,
      graded_by,
      graded_at,
      created_at,
      updated_at
    )
    VALUES
    (
      ?, ?, ?, ?, ?, ?,
      datetime('now'),
      datetime('now'),
      datetime('now')
    )
  `).run(
    1,
    1,
    JSON.stringify(1),
    1,
    null,
    2
  );

  db.prepare(`
    INSERT INTO attempt_answers
    (
      attempt_id,
      test_question_id,
      response,
      pts_obtained,
      feedback,
      graded_by,
      graded_at,
      created_at,
      updated_at
    )
    VALUES
    (
      ?, ?, ?, ?, ?, ?,
      datetime('now'),
      datetime('now'),
      datetime('now')
    )
  `).run(
    1,
    2,
    JSON.stringify(0),
    1,
    null,
    2
  );

  console.log('✅ Seed completado correctamente');
}

module.exports = { seed };