const express = require('express');
const bcrypt = require('bcrypt');
const { getTest } = require('../../api/models/test');
const { getDB } = require('../../api/db');
const { generateToken } = require('../../api/middleware/auth');

module.exports = function(baseContext) {
  const router = express.Router();

  // GET /quizzes/join?code=XYZ
  router.get('/join', (req, res) => {
    const code = (req.query.code || '').trim();
    if (!code) return res.redirect('/auth/login');

    const test = getTest(code);
    if (!test || test.status !== 'published') {
      return res.redirect('/auth/login');
    }

    // Logged-in user → go to their student quiz page
    if (req.user) {
      return res.redirect(`/student/quiz/${test.code}`);
    }

    // Guest → show name entry form
    const ctx = baseContext(req, {
      pageTitle: test.title,
      layout: 'guest',
      locals: { quizTitle: test.title, quizCode: code }
    });
    return res.render('student/guest-join', ctx);
  });

  // POST /quizzes/join — create temporary guest session
  router.post('/join', async (req, res) => {
    const code = (req.body.code || '').trim();
    const name = (req.body.name || '').trim().slice(0, 80);

    if (!code) return res.redirect('/auth/login');

    const test = getTest(code);
    if (!test || test.status !== 'published') {
      return res.redirect('/auth/login');
    }

    const guestName = name || 'Invitado';
    const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@tmp.local`;
    const hash = await bcrypt.hash(Math.random().toString(36), 8);

    const db = getDB();
    const result = db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')"
    ).run(guestName, guestEmail, hash);

    const token = generateToken({
      id: result.lastInsertRowid,
      name: guestName,
      email: guestEmail,
      role: 'student',
      is_guest: true,
      quiz_code: code
    });

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    return res.redirect(`/quizzes/take/${code}`);
  });

  // GET /quizzes/take/:code — guest quiz view (no navbar/sidebar)
  router.get('/take/:code', (req, res) => {
    if (!req.user) return res.redirect(`/quizzes/join?code=${req.params.code}`);

    const test = getTest(req.params.code);
    if (!test || test.status !== 'published') return res.redirect('/auth/login');

    const ctx = baseContext(req, {
      pageTitle: test.title,
      layout: 'guest',
      locals: {
        quizTitle: test.title,
        quizCode: test.code,
        quizInstructions: test.instructions || '',
        timeLimitMinutes: test.time_limit_minutes || 0,
        isGuest: true
      }
    });
    return res.render('student/quiz', ctx);
  });

  // GET /quizzes/done — guest finished, clear session
  router.get('/done', (req, res) => {
    res.clearCookie('token');
    const ctx = baseContext(req, {
      pageTitle: 'Cuestionario enviado',
      layout: 'guest',
      locals: {}
    });
    return res.render('student/guest-done', ctx);
  });

  return router;
};
