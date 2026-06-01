const testModel = require('../../api/models/test');
const { getTest } = require('../../api/models/test');
const { getAttempt } = require('../../api/models/attempt');
const { getAttemptAnswers } = require('../../api/models/attempt-answer');
const { getDB } = require('../../api/db');

function studentQuizzesPage(req, res, baseContext) {
  if (!req.user) { return res.redirect('/auth/login'); }

  const db = getDB();
  const tests = db.prepare(`
    SELECT
      t.code,
      t.title,
      t.description,
      t.status,
      t.time_limit_minutes,
      t.due_at,
      t.created_at,
      g.name AS group_name,
      COUNT(tq.id) AS questions_count
    FROM tests t
    JOIN user_groups ug
      ON ug.group_code = t.group_code
    LEFT JOIN groups g
      ON g.code = t.group_code
    LEFT JOIN test_questions tq
      ON tq.test_code = t.code
    WHERE ug.user_id = ? AND t.status IN ('published', 'closed')
    GROUP BY t.code
    ORDER BY t.created_at DESC
  `).all(req.user.id);

  const attempts = db.prepare(`
    SELECT test_code, id, status, score, max_score
    FROM attempts
    WHERE user_id = ?
    ORDER BY id DESC
  `).all(req.user.id);

  const attemptByTest = {};
  attempts.forEach(a => {
    if (!attemptByTest[a.test_code]) attemptByTest[a.test_code] = a;
  });

  const completed = Object.keys(attemptByTest).filter(
    k => attemptByTest[k].status === 'submitted' || attemptByTest[k].status === 'graded'
  ).length;

  const quizzes = tests.map(t => {
    const attempt = attemptByTest[t.code];
    const attemptStatus = attempt ? attempt.status : null;

    let dueDate = null;
    if (t.due_at) {
      try {
        dueDate = new Date(t.due_at).toLocaleString('es-MX', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      } catch (_) { dueDate = t.due_at; }
    }

    return {
      title: t.title,
      code: t.code,
      group: t.group_name || '',
      questions: t.questions_count || 0,
      status: t.status,
      createdAt: t.created_at,
      timeLimit: t.time_limit_minutes || 0,
      dueDate,
      isClosed: t.status === 'closed',
      isInProgress: attemptStatus === 'in_progress',
      isPending: attemptStatus === 'submitted',
      isGraded: attemptStatus === 'graded',
      isCompleted: attemptStatus === 'submitted' || attemptStatus === 'graded',
      attemptId: attempt ? attempt.id : null,
      attemptStatus,
      score: attempt && attemptStatus === 'graded'
        ? `${attempt.score}/${attempt.max_score}`
        : null,
      canRetry: false
    };
  });

  const gradedAttempts = Object.values(attemptByTest).filter(a => a.status === 'graded');
  const averageScore = gradedAttempts.length
    ? Math.round(gradedAttempts.reduce((sum, a) => sum + (a.max_score > 0 ? (a.score * 100 / a.max_score) : 0), 0) / gradedAttempts.length)
    : 0;

  const ctx = baseContext(req, {
    pageTitle: 'Mis cuestionarios',
    active: { studentQuizzes: true },
    locals: {
      quizzes,
      stats: {
        totalAssigned: quizzes.length,
        completed,
        pending: Math.max(0, quizzes.length - completed),
        averageScore
      }
    }
  });

  res.render('student/quizzes', ctx);
}

function studentQuizPage(req, res, baseContext) {
  if (!req.user) return res.redirect('/auth/login');

  const test = getTest(req.params.code);
  if (!test) return res.redirect('/student/quizzes');

  if (test.status !== 'published') return res.redirect('/student/quizzes');

  const ctx = baseContext(req, {
    pageTitle: test.title,
    locals: {
      quizTitle: test.title,
      quizCode: test.code,
      quizInstructions: test.instructions || '',
      timeLimitMinutes: test.time_limit_minutes || 0
    }
  });

  res.render('student/quiz', ctx);
}

function studentResultPage(req, res, baseContext) {
  if (!req.user) return res.redirect('/auth/login');

  const attemptId = Number(req.params.id);
  const attempt = getAttempt(attemptId);

  if (!attempt || attempt.user_id !== req.user.id) return res.redirect('/student/quizzes');

  const test = getTest(attempt.test_code);
  const answers = attempt.status !== 'in_progress' ? getAttemptAnswers(attemptId) : [];

  const percentage = attempt.max_score > 0
    ? Math.round((attempt.score * 100) / attempt.max_score)
    : 0;

  const minScore = test ? (test.min_score || 60) : 60;
  const passed = attempt.status === 'graded' && percentage >= minScore;
  const showAnswers = test && test.show_answers && attempt.status === 'graded';

  const ctx = baseContext(req, {
    pageTitle: 'Resultado: ' + (test ? test.title : 'Cuestionario'),
    locals: {
      attempt,
      quizTitle: test ? test.title : '',
      quizCode: attempt.test_code,
      score: attempt.score || 0,
      maxScore: attempt.max_score || 0,
      percentage,
      passed,
      minScore,
      isGraded: attempt.status === 'graded',
      isSubmitted: attempt.status === 'submitted',
      showAnswers,
      answers
    }
  });

  res.render('student/result', ctx);
}

module.exports = { studentQuizzesPage, studentQuizPage, studentResultPage };
