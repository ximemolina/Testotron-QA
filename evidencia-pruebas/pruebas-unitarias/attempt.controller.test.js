const { AttemptController } = require('../../testotron/api/controllers/attempt');

const {
  createAttempt,
  getAttempt,
  submitAttempt,
  updateAttemptScore,
} = require('../../testotron/api/models/attempt');

const { getDB } = require('../../testotron/api/db');

// ==========================
// MOCKS
// ==========================
jest.mock('../../testotron/api/models/attempt');
jest.mock('../../testotron/api/db');

// ==========================

describe('AttemptController', () => {
  let req;
  let res;

  let dbMock;
  let getMock;
  let runMock;
  let allMock;

  beforeEach(() => {
    jest.clearAllMocks();

    getMock = jest.fn();
    runMock = jest.fn();
    allMock = jest.fn();

    dbMock = {
      prepare: jest.fn(() => ({
        get: getMock,
        run: runMock,
        all: allMock,
      })),
    };

    getDB.mockReturnValue(dbMock);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // =========================================================
  // START (RF-INT-01, RF-INT-02)
  // =========================================================

  test('start - crea intento si no existe uno activo', () => {
    req = {
      params: { code: 'TEST123' },
      user: { id: 1 },
    };

    // test publicado
    getMock.mockReturnValueOnce({ status: 'published' });

    // no intento activo
    getMock.mockReturnValueOnce(null);

    createAttempt.mockReturnValue({ id: 10 });

    AttemptController.start(req, res);

    expect(createAttempt).toHaveBeenCalledWith(1, 'TEST123');
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('start - reutiliza intento en progreso', () => {
    req = {
      params: { code: 'TEST123' },
      user: { id: 1 },
    };

    getMock.mockReturnValueOnce({ status: 'published' });
    getMock.mockReturnValueOnce({ id: 99 });

    AttemptController.start(req, res);

    expect(createAttempt).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      attempt: {
        id: 99,
        user_id: 1,
        test_code: 'TEST123',
        resumed: true,
      },
    });
  });

  test('start - bloquea si examen no está publicado', () => {
    req = {
      params: { code: 'TEST123' },
      user: { id: 1 },
    };

    getMock.mockReturnValueOnce({ status: 'draft' });

    AttemptController.start(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(createAttempt).not.toHaveBeenCalled();
  });

  // =========================================================
  // GET (RF-RESU-01)
  // =========================================================

  test('get - retorna intento si existe', () => {
    req = { params: { id: '1' } };

    getAttempt.mockReturnValue({ id: 1 });

    AttemptController.get(req, res);

    expect(res.json).toHaveBeenCalledWith({
      attempt: { id: 1 },
    });
  });

  test('get - retorna 404 si no existe', () => {
    req = { params: { id: '999' } };

    getAttempt.mockReturnValue(null);

    AttemptController.get(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // =========================================================
  // SUBMIT (RF-INT-04, RF-INT-05, RF-CAL-02, RF-CAL-03)
  // =========================================================

  test('submit - calcula score correcto (multiple choice)', () => {
    req = { params: { id: '1' } };

    getAttempt.mockReturnValue({
      id: 1,
      test_code: 'TEST123',
    });

    // test abierto
    getMock
      .mockReturnValueOnce({ status: 'open', due_at: null })
      .mockReturnValueOnce(null);

    allMock.mockReturnValue([
      {
        test_question_id: 1,
        response: '1',
        correct_answer: '1',
        type: 'multiple_choice',
        pts: 10,
      },
    ]);

    AttemptController.submit(req, res);

    expect(submitAttempt).toHaveBeenCalledWith(1);
    expect(updateAttemptScore).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        submitted: true,
        score: 10,
        max_score: 10,
      })
    );
  });

  test('submit - essay otorga puntaje completo', () => {
    req = { params: { id: '1' } };

    getAttempt.mockReturnValue({
      id: 1,
      test_code: 'TEST123',
    });

    getMock
      .mockReturnValueOnce({ status: 'open', due_at: null })
      .mockReturnValueOnce(null);

    allMock.mockReturnValue([
      {
        test_question_id: 1,
        response: 'respuesta libre',
        correct_answer: null,
        type: 'essay',
        pts: 10,
      },
    ]);

    AttemptController.submit(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 10,
        max_score: 10,
      })
    );
  });

  test('submit - bloquea si examen está cerrado', () => {
    req = { params: { id: '1' } };

    getAttempt.mockReturnValue({
      id: 1,
      test_code: 'TEST123',
    });

    getMock.mockReturnValueOnce({ status: 'closed', due_at: null });

    AttemptController.submit(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(submitAttempt).not.toHaveBeenCalled();
  });
});