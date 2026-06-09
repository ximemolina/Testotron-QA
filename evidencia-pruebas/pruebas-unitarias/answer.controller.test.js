const { AnswerController } = require('../../testotron/api/controllers/answer');

const {
  upsertAttemptAnswer,
  getAttemptAnswers,
  listAttemptAnswers,
  listTeacherResults,
} = require('../../testotron/api/models/attempt-answer');

// ==========================
// MOCKS
// ==========================
jest.mock('../../testotron/api/models/attempt-answer');

const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  setHeader: jest.fn(),
  send: jest.fn(),
});

// ==========================

describe('AnswerController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = createRes();
  });

  // =========================================================
  // RF-INT-03: crear / actualizar respuestas
  // =========================================================

  test('submit - guarda múltiples respuestas de intento activo', () => {
    req = {
      body: {
        attempt_id: 1,
        answers: [
          { test_question_id: 10, response: 'A', pts_obtained: 1 },
          { test_question_id: 11, response: 'B', pts_obtained: 2 },
        ],
      },
      user: { id: 99 },
    };

    AnswerController.submit(req, res);

    expect(upsertAttemptAnswer).toHaveBeenCalledTimes(2);

    expect(upsertAttemptAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        attempt_id: 1,
        test_question_id: 10,
        response: 'A',
        pts_obtained: 1,
        graded_by: 99,
      })
    );

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('submit - retorna error si faltan datos', () => {
    req = {
      body: {},
      user: { id: 1 },
    };

    AnswerController.submit(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  // =========================================================
  // RF-RESU-01: obtener respuestas de intento
  // =========================================================

  test('get - retorna respuestas de intento', () => {
    req = { params: { id: 1 } };

    getAttemptAnswers.mockReturnValue([
      { id: 1, response: 'A' },
    ]);

    AnswerController.get(req, res);

    expect(getAttemptAnswers).toHaveBeenCalledWith(1);

    expect(res.json).toHaveBeenCalledWith({
      answers: expect.any(Array),
    });
  });

  test('get - retorna 404 si no existe', () => {
    req = { params: { id: 99 } };

    getAttemptAnswers.mockReturnValue(null);

    AnswerController.get(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // =========================================================
  // RF-RESU-03: resultados del docente
  // =========================================================

  test('results - retorna listado de resultados filtrados', () => {
    req = {
      query: {
        test_code: 'EXAM-1',
      },
    };

    listTeacherResults.mockReturnValue([
      { score: 10, max_score: 10 },
    ]);

    AnswerController.results(req, res);

    expect(listTeacherResults).toHaveBeenCalledWith({
      test_code: 'EXAM-1',
    });

    expect(res.json).toHaveBeenCalledWith({
      results: expect.any(Array),
    });
  });

  // =========================================================
  // RF-RESU-03: export CSV
  // =========================================================

  test('exportCsv - genera archivo CSV correctamente', () => {
    req = {
      user: { id: 1, role: 'teacher' },
      query: {},
    };

    listTeacherResults.mockReturnValue([
      {
        student_name: 'Juan',
        student_email: 'juan@test.com',
        quiz_title: 'Examen 1',
        group_name: 'Grupo A',
        score: 8,
        max_score: 10,
        percentage: 80,
        status: 'approved',
        submitted_at: '2026-01-01',
      },
    ]);

    AnswerController.exportCsv(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="resultados.csv"'
    );

    expect(res.send).toHaveBeenCalled();
  });
});