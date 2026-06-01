const { createAttempt, getAttempt, submitAttempt, updateAttemptScore } = require('../models/attempt');
const { getDB } = require('../db');
const { handleError } = require('./utils');

function safeJson(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return val; }
}

class AttemptController {
  static start(req, res) {
    try {
      const testCode = req.params.code;
      const userId = req.user.id;

      const db = getDB();

      // Verify quiz is published
      const test = db.prepare('SELECT status FROM tests WHERE code = ?').get(testCode);
      if (!test || test.status !== 'published') {
        return res.status(403).json({ error: 'El cuestionario no está disponible' });
      }

      // Resume existing in-progress attempt instead of creating a duplicate
      const existing = db.prepare(
        `SELECT id FROM attempts WHERE user_id = ? AND test_code = ? AND status = 'in_progress' ORDER BY id DESC LIMIT 1`
      ).get(userId, testCode);

      if (existing) {
        return res.json({ attempt: { id: existing.id, user_id: userId, test_code: testCode, resumed: true } });
      }

      const a = createAttempt(userId, testCode);
      res.status(201).json({ attempt: a });
    } catch (err) { handleError(err, res); }
  }

  static get(req, res) {
    try {
      const id = Number(req.params.id);
      const a = getAttempt(id);
      if (!a) return res.status(404).json({ error: 'Intento no encontrado' });
      res.json({ attempt: a });
    } catch (err) { handleError(err, res); }
  }

  static submit(req, res) {
    try {
      const id = Number(req.params.id);
      const db = getDB();

      const attempt = getAttempt(id);
      if (!attempt) return res.status(404).json({ error: 'Intento no encontrado' });

      // Verify quiz is still open and within due date
      const test = db.prepare('SELECT status, due_at FROM tests WHERE code = ?').get(attempt.test_code);
      if (test && test.status === 'closed') {
        return res.status(403).json({ error: 'El cuestionario está cerrado' });
      }
      if (test && test.due_at && new Date() > new Date(test.due_at)) {
        return res.status(403).json({ error: 'La fecha límite ha pasado' });
      }

      submitAttempt(id);

      // Auto-grade all answers
      const answers = db.prepare(`
        SELECT aa.test_question_id, aa.response, tq.type, tq.correct_answer, tq.pts
        FROM attempt_answers aa
        JOIN test_questions tq ON aa.test_question_id = tq.id
        WHERE aa.attempt_id = ?
      `).all(id);

      let totalScore = 0;
      let maxScore = 0;

      for (const answer of answers) {
        const response = safeJson(answer.response);
        const correct = safeJson(answer.correct_answer);
        const pts = answer.pts || 1;
        maxScore += pts;

        let earned = 0;

        switch (answer.type) {
          case 'essay':
            earned = pts; // full points until manual review
            break;
          case 'multiple_choice':
            earned = (Number(response) === Number(correct)) ? pts : 0;
            break;
          case 'multiple_response': {
            const r = (Array.isArray(response) ? response.map(Number) : []).sort((a, b) => a - b);
            const c = (Array.isArray(correct) ? correct.map(Number) : []).sort((a, b) => a - b);
            earned = JSON.stringify(r) === JSON.stringify(c) ? pts : 0;
            break;
          }
          case 'true_false':
            earned = String(response) === String(correct) ? pts : 0;
            break;
          case 'short_answer':
          case 'fill_blank':
            earned = String(response || '').trim().toLowerCase() === String(correct || '').trim().toLowerCase() ? pts : 0;
            break;
          case 'numeric':
            earned = Number(response) === Number(correct) ? pts : 0;
            break;
          case 'matching': {
            if (Array.isArray(response) && Array.isArray(correct)) {
              const allMatch = correct.length > 0 && correct.every((c, i) =>
                response[i] && response[i].left === c.left && response[i].right === c.right
              );
              earned = allMatch ? pts : 0;
            }
            break;
          }
        }

        db.prepare(
          'UPDATE attempt_answers SET pts_obtained = ? WHERE attempt_id = ? AND test_question_id = ?'
        ).run(earned, id, answer.test_question_id);
        totalScore += earned;
      }

      updateAttemptScore(id, totalScore, maxScore);

      res.json({ submitted: true, score: totalScore, max_score: maxScore });
    } catch (err) { handleError(err, res); }
  }
}

module.exports = { AttemptController };
