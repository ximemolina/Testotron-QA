const express = require('express');
const controller = require('../controllers/student');

module.exports = function(baseContext) {

  const router = express.Router();

  router.get(
    '/quizzes',
    (req, res) =>
      controller.studentQuizzesPage(req, res, baseContext)
  );

  router.get(
    '/quiz/:code',
    (req, res) =>
      controller.studentQuizPage(req, res, baseContext)
  );

  router.get(
    '/result/:id',
    (req, res) =>
      controller.studentResultPage(req, res, baseContext)
  );

  return router;
};
