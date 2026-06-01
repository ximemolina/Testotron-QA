const { getDB } = require('../db');
const { updateAttemptScore } = require('../models/attempt');
const { handleError } = require('./utils');

class GradingController {
  // Auto-grade: recalculate total from stored pts_obtained values
  static grade(req, res) {
    try {
      const attemptId = Number(req.params.id);
      const db = getDB();
      const row = db.prepare(
        `SELECT SUM(aa.pts_obtained) as obtained, SUM(tq.pts) as max_pts
         FROM attempt_answers aa
         JOIN test_questions tq ON aa.test_question_id = tq.id
         WHERE aa.attempt_id = ?`
      ).get(attemptId);
      const obtained = row?.obtained || 0;
      const max = row?.max_pts || 0;
      updateAttemptScore(attemptId, obtained, max);
      res.json({ graded: true, score: obtained, max_score: max });
    } catch (err) { handleError(err, res); }
  }

  // Manual grade: teacher updates per-question scores and optional feedback
  static manualGrade(req, res) {
    try {
      const attemptId = Number(req.params.id);
      const { answers } = req.body; // [{test_question_id, pts_obtained, feedback?}]
      const db = getDB();

      if (Array.isArray(answers)) {
        const stmt = db.prepare(
          `UPDATE attempt_answers
           SET pts_obtained = ?, feedback = ?, graded_by = ?, graded_at = datetime('now'), updated_at = datetime('now')
           WHERE attempt_id = ? AND test_question_id = ?`
        );
        for (const a of answers) {
          stmt.run(
            Math.max(0, Number(a.pts_obtained) || 0),
            a.feedback || null,
            req.user.id,
            attemptId,
            Number(a.test_question_id)
          );
        }
      }

      // Recalculate totals from what's now in the DB
      const row = db.prepare(
        `SELECT SUM(aa.pts_obtained) as obtained, SUM(tq.pts) as max_pts
         FROM attempt_answers aa
         JOIN test_questions tq ON aa.test_question_id = tq.id
         WHERE aa.attempt_id = ?`
      ).get(attemptId);
      const obtained = row?.obtained || 0;
      const max = row?.max_pts || 0;
      updateAttemptScore(attemptId, obtained, max);

      res.json({ success: true, score: obtained, max_score: max });
    } catch (err) { handleError(err, res); }
  }
}

module.exports = { GradingController };
