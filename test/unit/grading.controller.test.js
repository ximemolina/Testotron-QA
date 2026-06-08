const { GradingController } = require('../../testotron/api/controllers/grading');

const { getDB } = require('../../testotron/api/db');
const { updateAttemptScore } = require('../../testotron/api/models/attempt');

// ==========================
// MOCKS
// ==========================
jest.mock('../../testotron/api/db');
jest.mock('../../testotron/api/models/attempt');

// ==========================

describe('GradingController', () => {
  let req;
  let res;

  let dbMock;
  let getMock;
  let runMock;

  beforeEach(() => {
    jest.clearAllMocks();

    getMock = jest.fn();
    runMock = jest.fn();

    dbMock = {
      prepare: jest.fn(() => ({
        get: getMock,
        run: runMock,
      })),
    };

    getDB.mockReturnValue(dbMock);

res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
  });

// =========================================================
// RF-CAL-02 / RF-CAL-03
// recalcular puntuación automática + estado calificado
// =========================================================

  test('grade - calcula score y max_score correctamente', () => {
    req = { params: { id: '1' } };

    getMock.mockReturnValue({
      obtained: 8,
      max_pts: 10,
    });

    GradingController.grade(req, res);

    expect(updateAttemptScore).toHaveBeenCalledWith(1, 8, 10);

    expect(res.json).toHaveBeenCalledWith({
      graded: true,
      score: 8,
      max_score: 10,
    });
  });

  test('grade - maneja valores null en BD', () => {
    req = { params: { id: '2' } };

    getMock.mockReturnValue(null);

    GradingController.grade(req, res);

    expect(updateAttemptScore).toHaveBeenCalledWith(2, 0, 0);

    expect(res.json).toHaveBeenCalledWith({
      graded: true,
      score: 0,
      max_score: 0,
    });
  });

// =========================================================
// RF-CAL-01 / RF-CAL-03
// calificación manual docente + persistencia
// =========================================================

  test('manualGrade - actualiza múltiples respuestas y recalcula score', () => {
    req = {
      params: { id: '1' },
      user: { id: 99 },
      body: {
        answers: [
          { test_question_id: 1, pts_obtained: 5, feedback: 'ok' },
          { test_question_id: 2, pts_obtained: 3 },
        ],
      },
    };

    getMock.mockReturnValue({
      obtained: 8,
      max_pts: 10,
    });

    GradingController.manualGrade(req, res);

    expect(dbMock.prepare).toHaveBeenCalled();

    expect(updateAttemptScore).toHaveBeenCalledWith(1, 8, 10);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      score: 8,
      max_score: 10,
    });
  });

  test('manualGrade - aplica Math.max para evitar negativos', () => {
    const run = jest.fn();

    dbMock.prepare = jest.fn(() => ({
      run,
    }));

    req = {
      params: { id: '1' },
      user: { id: 1 },
      body: {
        answers: [
          { test_question_id: 1, pts_obtained: -5 },
        ],
      },
    };

    getMock.mockReturnValue({
      obtained: 0,
      max_pts: 10,
    });

    GradingController.manualGrade(req, res);

    expect(run).toHaveBeenCalledWith(
      0, // Math.max(0, -5)
      null,
      1,
      1,
      1
    );
  });

  test('manualGrade - maneja answers vacío', () => {
    req = {
      params: { id: '1' },
      user: { id: 1 },
      body: {},
    };

    getMock.mockReturnValue({
      obtained: 0,
      max_pts: 0,
    });

    GradingController.manualGrade(req, res);

    expect(updateAttemptScore).toHaveBeenCalledWith(1, 0, 0);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      score: 0,
      max_score: 0,
    });
  });

  test('manualGrade - sin feedback debe ser null', () => {
    const run = jest.fn();

    dbMock.prepare = jest.fn(() => ({
      run,
    }));

    req = {
      params: { id: '1' },
      user: { id: 7 },
      body: {
        answers: [
          { test_question_id: 1, pts_obtained: 5 },
        ],
      },
    };

    getMock.mockReturnValue({
      obtained: 5,
      max_pts: 10,
    });

    GradingController.manualGrade(req, res);

    expect(run).toHaveBeenCalledWith(
      5,
      null,
      7,
      1,
      1
    );
  });
});