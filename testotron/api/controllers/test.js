const crypto = require('crypto');

const {
  createTest,
  getTest,
  listTests,
  updateTest,
  deleteTest,
  addTestQuestion,
  clearTestQuestions
} = require('../models/test');

const { getTestQuestions, addTestQuestion: addTQ } = require('../models/test-question');
const { getQuestion } = require('../models/questions');
const { getDB } = require('../db');
const { handleError } = require('./utils');

class TestController {

  /*
  =========================================
  CREATE TEST
  =========================================
  */
  static create(req, res) {

    try {

      const body = req.body;

      const code =
        crypto.randomBytes(4)
          .toString('hex');

      createTest({

        code,

        template_id:
          body.template_id || null,

        owner_id:
          req.user.id,

        group_code:
          body.group_code || null,

        title:
          body.title,

        description:
          body.description || '',

        instructions:
          body.instructions || '',

        status:
          body.status || 'draft',

        category:
          body.category || '',

        time_limit_minutes:
          body.time_limit_minutes || null,

        min_score:
          body.min_score || 60,

        show_answers:
          body.show_answers ? 1 : 0,

        allow_retries:
          body.allow_retries ? 1 : 0,

        settings:
          JSON.stringify(
            body.settings || {}
          ),

	shuffle_questions:
  body.shuffle_questions ? 1 : 0,

shuffle_answers:
  body.shuffle_answers ? 1 : 0,

        due_at: body.due_at || null,
      });

      /*
      =====================================
      SNAPSHOT QUESTIONS
      =====================================
      */

      if (Array.isArray(body.questions)) {

        body.questions.forEach((item, index) => {

          /*
          ===================================
          IMPORTED QUESTION
          ===================================
          */

          if (item.question_id) {

            const original =
              getQuestion(
                item.question_id
              );

            if (!original) {
              return;
            }

            addTestQuestion({

              test_code: code,

              original_question_id:
                original.id,

              section_title: '',

              position: index,

              question:
                original.question,

              type:
                original.type,

              metadata:
                JSON.stringify(
                  original.metadata || {}
                ),

              correct_answer:
                JSON.stringify(
                  original.correct_answer
                ),

              pts:
                item.pts || 1
            });

            return;
          }

          /*
          ===================================
          INLINE QUESTION
          ===================================
          */

          addTestQuestion({

            test_code: code,

            original_question_id: null,

            section_title: '',

            position: index,

            question:
              item.question,

            type:
              item.type,

            metadata:
              JSON.stringify(
                item.metadata || {}
              ),

            correct_answer:
              JSON.stringify(
                item.correct_answer
              ),

            pts:
              item.pts || 1
          });

        });

      }

      return res.status(201).json({
        success: true,
        code
      });

    } catch (err) {

      handleError(err, res);
    }
  }

  /*
  =========================================
  LIST TESTS
  =========================================
  */
  static list(req, res) {

    try {

      const q = {

        title:
          req.query.title,

        group_code:
          req.query.group_code,

        owner_id:
          req.query.owner_id
            ? Number(req.query.owner_id)
            : (
                req.user &&
                req.user.role === 'teacher'
              )
                ? req.user.id
                : undefined,

        status:
          req.query.status
      };

      const rows =
        listTests(q);

      res.json({
        tests: rows
      });

    } catch (err) {

      handleError(err, res);
    }
  }

  /*
  =========================================
  GET TEST
  =========================================
  */
  static get(req, res) {

    try {

      const test =
        getTest(req.params.code);

      if (!test) {

        return res.status(404).json({
          error: 'Quiz no encontrado'
        });
      }

      res.json({
        test
      });

    } catch (err) {

      handleError(err, res);
    }
  }

  /*
  =========================================
  TEST DETAIL
  =========================================
  */
  static detail(req, res) {

    try {

      const code =
        req.params.code;

      const test =
        getTest(code);

      if (!test) {

        return res.status(404).json({
          error: 'Cuestionario no encontrado'
        });
      }

      const questions =
        getTestQuestions(code);

      test.questions =
        questions;

      res.json({
        test
      });

    } catch (err) {

      handleError(err, res);
    }
  }

  /*
  =========================================
  UPDATE TEST
  =========================================
  */
  static update(req, res) {

    try {

      const body =
        req.body;

      const code =
        req.params.code;

      updateTest(
        code,
        {

          template_id:
            body.template_id,

          group_code:
            body.group_code,

          title:
            body.title,

          description:
            body.description,

          instructions:
            body.instructions,

          status:
            body.status,

          category:
            body.category,

          time_limit_minutes:
            body.time_limit_minutes,

          min_score:
            body.min_score,

          show_answers:
            body.show_answers ? 1 : 0,

          allow_retries:
            body.allow_retries ? 1 : 0,

          settings:
            JSON.stringify(
              body.settings || {}
            ),

shuffle_questions:
  body.shuffle_questions ? 1 : 0,

shuffle_answers:
  body.shuffle_answers ? 1 : 0,

          due_at: body.due_at || null,

        }
      );

      /*
      =====================================
      REPLACE QUESTIONS
      =====================================
      */

      clearTestQuestions(code);

      if (Array.isArray(body.questions)) {

        body.questions.forEach((item, index) => {

          /*
          ===================================
          IMPORTED QUESTION
          ===================================
          */

          if (item.question_id) {

            const original =
              getQuestion(
                item.question_id
              );

            if (!original) {
              return;
            }

            addTestQuestion({

              test_code: code,

              original_question_id:
                original.id,

              section_title: '',

              position: index,

              question:
                original.question,

              type:
                original.type,

              metadata:
                JSON.stringify(
                  original.metadata || {}
                ),

              correct_answer:
                JSON.stringify(
                  original.correct_answer
                ),

              pts:
                item.pts || 1
            });

            return;
          }

          /*
          ===================================
          INLINE QUESTION
          ===================================
          */

          addTestQuestion({

            test_code: code,

            original_question_id: null,

            section_title: '',

            position: index,

            question:
              item.question,

            type:
              item.type,

            metadata:
              JSON.stringify(
                item.metadata || {}
              ),

            correct_answer:
              JSON.stringify(
                item.correct_answer
              ),

            pts:
              item.pts || 1
          });

        });

      }

      res.json({
        success: true
      });

    } catch (err) {

      handleError(err, res);
    }
  }

  /*
  =========================================
  DELETE TEST
  =========================================
  */
  static delete(req, res) {

    try {

      const code =
        req.params.code;

      const changes =
        deleteTest(code);

      res.json({
        deleted: changes
      });

    } catch (err) {

      handleError(err, res);
    }
  }

  /*
  =========================================
  PUBLISH TEST
  =========================================
  */
  static publish(req, res) {
    try {
      const db = getDB();
      const test = db.prepare('SELECT due_at FROM tests WHERE code = ?').get(req.params.code);
      if (!test) return res.status(404).json({ error: 'Quiz no encontrado' });
      if (!test.due_at) return res.status(400).json({ error: 'Debes establecer una fecha límite (due_at) antes de publicar.' });
      if (new Date(test.due_at) <= new Date()) return res.status(400).json({ error: 'La fecha límite debe ser posterior a la fecha actual.' });
      db.prepare(
        "UPDATE tests SET status='published', published_at=datetime('now'), updated_at=datetime('now') WHERE code=?"
      ).run(req.params.code);
      res.json({ published: true });
    } catch (err) { handleError(err, res); }
  }

  /*
  =========================================
  DUPLICATE TEST
  =========================================
  */
  static duplicate(req, res) {
    try {
      const original = getTest(req.params.code);
      if (!original) return res.status(404).json({ error: 'Quiz no encontrado' });

      const newCode = crypto.randomBytes(4).toString('hex');

      createTest({
        code: newCode,
        template_id: original.template_id || null,
        owner_id: req.user.id,
        group_code: original.group_code || null,
        title: original.title + ' (Copia)',
        description: original.description || '',
        instructions: original.instructions || '',
        status: 'draft',
        category: original.category || '',
        time_limit_minutes: original.time_limit_minutes || null,
        min_score: original.min_score || 60,
        show_answers: original.show_answers || 0,
        allow_retries: original.allow_retries || 0,
        shuffle_questions: original.shuffle_questions || 0,
        shuffle_answers: original.shuffle_answers || 0,
        settings: original.settings || '{}',
        due_at: null
      });

      const questions = getTestQuestions(req.params.code);
      questions.forEach((q, index) => {
        addTQ(newCode, {
          original_question_id: q.original_question_id || null,
          section_title: q.section_title || '',
          position: index,
          question: q.question,
          type: q.type,
          metadata: q.metadata || {},
          correct_answer: q.correct_answer,
          pts: q.pts || 1
        });
      });

      res.json({ success: true, code: newCode });
    } catch (err) { handleError(err, res); }
  }

  /*
  =========================================
  CLOSE TEST
  =========================================
  */
  static close(req, res) {
    try {
      getDB().prepare(
        "UPDATE tests SET status='closed', updated_at=datetime('now') WHERE code=?"
      ).run(req.params.code);
      res.json({ closed: true });
    } catch (err) { handleError(err, res); }
  }
}

module.exports = {
  TestController
};
