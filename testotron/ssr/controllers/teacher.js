const { getDB } = require('../../api/db');
const { listGroups } = require('../../api/models/group');
const { listTeacherResults, getAttemptAnswers } = require('../../api/models/attempt-answer');
const { getTest } = require('../../api/models/test');
const { getTemplate } =  require('../../api/models/template');
const { getAttempt } = require('../../api/models/attempt');

const TYPE_LABELS = {
  multiple_choice: 'Selección única',
  multiple_response: 'Selección múltiple',
  true_false: 'Verdadero / Falso',
  short_answer: 'Respuesta corta',
  fill_blank: 'Completar espacios',
  numeric: 'Numérica',
  essay: 'Ensayo',
  matching: 'Relación de columnas'
};

const DIFF_LABELS = { easy: 'Fácil', medium: 'Media', hard: 'Difícil' };
const DIFF_VARIANTS = {
  easy: 'success', Fácil: 'success',
  medium: 'warning', Media: 'warning',
  hard: 'danger', Difícil: 'danger'
};

function teacherQuizzesPage(req, res, baseContext) {

  if (!req.user) {
    return res.redirect('/auth/login');
  }

  /*
  =====================================
  AUTH
  =====================================
  */

  if (
    req.user.role !== 'teacher' &&
    req.user.role !== 'admin'
  ) {

    return res.redirect('/auth/login');
  }

  const db = getDB();

  /*
  =====================================
  FETCH TESTS
  =====================================
  */

  let quizzes = [];

  const quizQuery = `
    SELECT
      tests.*,
      groups.name as group_name,
      COUNT(DISTINCT tq.id) as questions_count,
      COUNT(DISTINCT a.id) as responses_count
    FROM tests
    LEFT JOIN groups ON groups.code = tests.group_code
    LEFT JOIN test_questions tq ON tq.test_code = tests.code
    LEFT JOIN attempts a ON a.test_code = tests.code
    {WHERE}
    GROUP BY tests.code
    ORDER BY tests.created_at DESC
  `;

  if (req.user.role === 'admin') {
    quizzes = db.prepare(quizQuery.replace('{WHERE}', '')).all();
  } else {
    quizzes = db.prepare(quizQuery.replace('{WHERE}', 'WHERE tests.owner_id = ?')).all(req.user.id);
  }

  /*
  =====================================
  COMPUTED DATA
  =====================================
  */

  quizzes = quizzes.map(q => ({
    code: q.code,
    title: q.title,
    description: q.description,
    status: q.status || 'draft',
    group: q.group_name || 'Sin grupo',
    group_name: q.group_name || 'Sin grupo',
    createdAt: q.created_at,
    created_at: q.created_at,
    questions: q.questions_count || 0,
    responses: q.responses_count || 0,
    statusVariant:
      q.status === 'published' ? 'success'
      : q.status === 'closed' ? 'danger'
      : 'warning'
  }));

  /*
  =====================================
  STATS
  =====================================
  */

  const stats = {
    total: quizzes.length,
    totalQuizzes: quizzes.length,
    active: quizzes.filter(q => q.status === 'published').length,
    published: quizzes.filter(q => q.status === 'published').length,
    drafts: quizzes.filter(q => q.status === 'draft').length,
    closed: quizzes.filter(q => q.status === 'closed').length,
    totalResponses: quizzes.reduce((sum, q) => sum + q.responses, 0)
  };

  /*
  =====================================
  RENDER
  =====================================
  */

  const ctx = baseContext(req, {

    pageTitle:
      'Mis cuestionarios',

    active: {
      quizzes: true
    },

    locals: {

      quizzes,

      stats
    }
  });

  return res.render(
    'teacher/quizzes',
    ctx
  );
}

function questionsPage(req, res, baseContext) {

  if (!req.user) {
    return res.redirect('/auth/login');
  }

  const db = getDB();

  let questions = [];

  const usesJoin = `LEFT JOIN test_questions tq ON tq.original_question_id = q.id`;

  if (req.user.role === 'teacher') {

    questions = db.prepare(`
      SELECT q.*, COUNT(tq.id) as use_count
      FROM questions q
      ${usesJoin}
      WHERE q.owner_id = ?
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `).all(req.user.id);

  } else if (req.user.role === 'admin') {

    questions = db.prepare(`
      SELECT q.*, COUNT(tq.id) as use_count
      FROM questions q
      ${usesJoin}
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `).all();
  }

  questions = questions.map(q => {
    const rawDiff = q.difficulty || 'medium';
    const diffLabel = DIFF_LABELS[rawDiff] || rawDiff;
    return {
      id: q.id,
      question: q.question,
      type: TYPE_LABELS[q.type] || q.type,
      rawType: q.type,
      difficulty: diffLabel,
      difficultyVariant: DIFF_VARIANTS[rawDiff] || DIFF_VARIANTS[diffLabel] || 'warning',
      uses: q.use_count || 0
    };
  });

  const usedCount = questions.filter(q => q.uses > 0).length;

  const ctx = baseContext(req, {
    pageTitle: 'Banco de preguntas',
    active: { questionBank: true },
    locals: {
      questions,
      stats: {
        totalQuestions: questions.length,
        mostUsed: usedCount
      }
    }
  });

  return res.render('teacher/questions', ctx);
}

function templatesPage(req, res, baseContext) {

  if (!req.user) {
    return res.redirect('/auth/login');
  }

  const db = getDB();

  let templates = [];

  const templateQuery = `
    SELECT qt.*,
      (SELECT COUNT(*) FROM template_sections ts
       JOIN template_questions tq ON tq.template_section_id = ts.id
       WHERE ts.template_id = qt.id) AS questions
    FROM quiz_templates qt
  `;

  if (req.user.role === 'admin') {

    templates = db.prepare(templateQuery + ' ORDER BY qt.created_at DESC').all();

  } else {

    templates = db.prepare(templateQuery + ' WHERE qt.owner_id = ? ORDER BY qt.created_at DESC').all(req.user.id);
  }

  const ctx = baseContext(req, {
    pageTitle: 'Plantillas',
    active: { templates: true },
    locals: { templates }
  });

  return res.render('teacher/templates', ctx);
}

function createQuizPage(req, res, baseContext) {

  if (!req.user) {
    return res.redirect('/auth/login');
  }

  const groups =
    req.user.role === 'teacher'
      ? listGroups({ owner_id: req.user.id })
      : listGroups();

  let quiz = null;
  let pageTitle = 'Crear nuevo cuestionario';

  const fromTemplateId = req.query.from_template;
  if (fromTemplateId) {
    const tpl = getTemplate(Number(fromTemplateId));
    if (tpl) {
      pageTitle = `Nuevo cuestionario desde: ${tpl.title}`;
      quiz = {
        name: tpl.title,
        description: tpl.description || '',
        timeLimit: tpl.time_limit_minutes || 0,
        shuffleQuestions: Boolean(tpl.shuffle_questions),
        shuffleAnswers: Boolean(tpl.shuffle_answers),
        questions: (tpl.questions || []).map(q => ({
          question_id: q.question_id,
          question: q.question,
          type: q.type,
          pts: q.pts || 1
        }))
      };
    }
  }

  const ctx = baseContext(req, {
    pageTitle,
    active: { createQuiz: true },
    locals: {
      groups,
      quiz,
      difficulties: ['Fácil', 'Media', 'Difícil']
    }
  });

  return res.render('teacher/create_quiz', ctx);
}


function quizzesResultsPage(req, res, baseContext) {

    /*
    =========================================
    AUTH
    =========================================
    */

    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (
        req.user.role !== 'teacher' &&
        req.user.role !== 'admin'
    ) {
        return res.redirect('/');
    }

    /*
    =========================================
    FILTERS
    =========================================
    */

    const {
        search = '',
        group = '',
        status = ''
    } = req.query;

    /*
    =========================================
    RESULTS
    =========================================
    */

    const results =
        listTeacherResults({

            owner_id:
                req.user.role === 'admin'
                    ? null
                    : req.user.id,

            search: search.trim(),

            group_code:
                group || null
        });

    /*
    =========================================
    STATUS FILTER
    =========================================
    */

    let filteredResults = results;

    if (status) {

        filteredResults =
            filteredResults.filter(
                r => r.status === status
            );
    }

    /*
    =========================================
    TEACHER GROUPS
    =========================================
    */

    const groups =
        listGroups(
            req.user.role === 'admin'
                ? {}
                : {
                    owner_id: req.user.id
                }
        );

    /*
    =========================================
    STATS
    =========================================
    */

    const totalResults =
        filteredResults.length;

    const averageScore =
        totalResults
            ? Math.round(
                filteredResults.reduce(
                    (sum, r) =>
                        sum + r.percentage,
                    0
                ) / totalResults
            )
            : 0;

    const approved =
        filteredResults.filter(
            r => r.percentage >= 70
        ).length;

    const approvalRate =
        totalResults
            ? Math.round(
                (approved * 100) /
                totalResults
            )
            : 0;

    const stats = {

        totalResults,

        averageScore,

        approvalRate,

        totalAttempts:
            totalResults
    };

    /*
    =========================================
    PAGE
    =========================================
    */

    const ctx = baseContext(req, {

        pageTitle: 'Resultados',

        active: {
            results: true
        },

        locals: {

            pageDescription:
                'Consulta el rendimiento de los estudiantes',

            filteredResults,

            groups,

            stats,

            filters: {

                search,

                group,

                status
            }
        }
    });

    return res.render(
        'teacher/results',
        ctx
    );
}

function editQuizPage(
  req,
  res,
  baseContext
) {

  /*
  =====================================
  AUTH
  =====================================
  */

  if (!req.user) {

    return res.redirect(
      '/auth/login'
    );
  }

  /*
  =====================================
  QUIZ
  =====================================
  */

  const rawQuiz =
    getTest(req.params.code);

  if (!rawQuiz) {

    return res.redirect(
      '/teacher/quizzes'
    );
  }

  /*
  =====================================
  OWNERSHIP
  =====================================
  */

  if (

    req.user.role !== 'admin' &&

    rawQuiz.owner_id !== req.user.id

  ) {

    return res.redirect(
      '/teacher/quizzes'
    );
  }

  /*
  =====================================
  GROUPS
  =====================================
  */

  const groups =

    req.user.role === 'teacher'

      ? listGroups({

          owner_id:
            req.user.id

        })

      : listGroups();

  /*
  =====================================
  NORMALIZE QUIZ
  =====================================
  */

  const quiz = {

    code:
      rawQuiz.code,

    id:
      rawQuiz.id,

    /*
    ===================================
    BASIC
    ===================================
    */

    name:
      rawQuiz.title || '',

    title:
      rawQuiz.title || '',

    description:
      rawQuiz.description || '',

    instructions:
      rawQuiz.instructions || '',

    category:
      rawQuiz.category || '',

    /*
    ===================================
    SETTINGS
    ===================================
    */

    status:
      rawQuiz.status || 'draft',

    group_code:
      rawQuiz.group_code || '',

    timeLimit:
      rawQuiz.time_limit_minutes || 0,

    minScore:
      rawQuiz.min_score || 0,

    showAnswers:
      Boolean(
        rawQuiz.show_answers
      ),

    allowRetries:
      Boolean(
        rawQuiz.allow_retries
      ),

    shuffleQuestions:
      Boolean(
        rawQuiz.shuffle_questions
      ),

    shuffleAnswers:
      Boolean(
        rawQuiz.shuffle_answers
      ),

    dueAt: rawQuiz.due_at
      ? rawQuiz.due_at.replace(' ', 'T').slice(0, 16)
      : '',

    /*
    ===================================
    QUESTIONS
    ===================================
    */

    questions:
      Array.isArray(
        rawQuiz.questions
      )

      ? rawQuiz.questions.map(q => ({

          question_id:
            q.original_question_id,

          question:
            q.question,

          type:
            q.type,

          metadata:
            q.metadata,

          correct_answer:
            q.correct_answer,

          pts:
            q.pts || 1

      }))

      : []

  };

  /*
  =====================================
  PAGE
  =====================================
  */

  const ctx = baseContext(req, {

    pageTitle:
      'Editar cuestionario',

    pageDescription:
      'Modifica la configuración y preguntas del cuestionario',

    active: {
      quizzes: true
    },

    locals: {

      quiz,

      groups,

      mode: 'test',

      difficulties: [

        'Fácil',

        'Media',

        'Difícil'

      ]
    }

  });

  return res.render(

    'teacher/create_quiz',

    ctx

  );

}

function editTemplatePage(
  req,
  res,
  baseContext
) {

  if (!req.user) {
    return res.redirect('/auth/login');
  }

  const template =
    getTemplate(req.params.id);

  if (!template) {
    return res.redirect('/teacher/templates');
  }

  const ctx = baseContext(req, {

    pageTitle:
      'Editar plantilla',

    active: {
      templates: true
    },

    locals: {
      template
    }
  });

  return res.render(
    'teacher/create_template',
    ctx
  );
}

function viewQuizPage(
  req,
  res,
  baseContext
) {

  const quiz =
    getTest(req.params.code);

  if (!quiz) {
    return res.redirect(
      '/teacher/quizzes'
    );
  }

  const ctx = baseContext(req, {

    pageTitle:
      quiz.title,

    active: {
      quizzes: true
    },

    locals: {
      quiz
    }
  });

  return res.render(
    'teacher/view_quiz',
    ctx
  );
}

function gradeAttemptPage(req, res, baseContext) {
  if (!req.user) return res.redirect('/auth/login');
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.redirect('/');

  const attemptId = Number(req.params.id);
  const attempt = getAttempt(attemptId);
  if (!attempt) return res.redirect('/teacher/results');

  const test = getTest(attempt.test_code);
  if (!test) return res.redirect('/teacher/results');

  if (req.user.role !== 'admin' && test.owner_id !== req.user.id) {
    return res.redirect('/teacher/results');
  }

  const db = getDB();
  const student = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(attempt.user_id);
  const answers = getAttemptAnswers(attemptId);

  const percentage = attempt.max_score > 0
    ? Math.round((attempt.score * 100) / attempt.max_score)
    : 0;

  const statusLabel =
    attempt.status === 'graded' ? 'Calificado'
    : attempt.status === 'submitted' ? 'Entregado'
    : 'En progreso';

  const ctx = baseContext(req, {
    pageTitle: `Detalle de intento — ${test.title}`,
    active: { results: true },
    locals: {
      attempt,
      quizTitle: test.title,
      quizCode: test.code,
      student: student || { name: 'Desconocido', email: '' },
      score: attempt.score || 0,
      maxScore: attempt.max_score || 0,
      percentage,
      statusLabel,
      minScore: test.min_score || 60,
      isGraded: attempt.status === 'graded',
      passed: attempt.status === 'graded' && percentage >= (test.min_score || 60),
      submittedAt: attempt.submitted_at,
      answers
    }
  });

  res.render('teacher/grade', ctx);
}

module.exports = {
  viewQuizPage,
  editQuizPage,
  teacherQuizzesPage,
  questionsPage,
  templatesPage,
  createQuizPage,
  quizzesResultsPage,
  editTemplatePage,
  gradeAttemptPage
};
