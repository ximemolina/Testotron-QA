const { QuestionController } = require('../../testotron/api/controllers/question');
 
const {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../../testotron/api/models/questions');
 
const { TemplateController } = require('../../testotron/api/controllers/template');
 
const {
  createTemplate,
  createTemplateSection,
  addTemplateQuestion,
  getTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../../testotron/api/models/template');
 
const { createTest, addTestQuestion } = require('../../testotron/api/models/test');
 
// ==========================
// MOCKS
// ==========================
jest.mock('../../testotron/api/models/questions');
jest.mock('../../testotron/api/models/template');
jest.mock('../../testotron/api/models/test');
 
const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  redirect: jest.fn(),
});
 
// ==========================
 
describe('QuestionController', () => {
  let req;
  let res;
 
  beforeEach(() => {
    jest.clearAllMocks();
    res = createRes();
  });
 
  // =========================================================
  // RF-QUES-01 / RF-QUES-02: Creación de preguntas
  // =========================================================
 
  describe('create', () => {
 
    test('create - crea una pregunta multiple_choice válida', () => {
      req = {
        user: { id: 1, role: 'teacher' },
        body: {
          question: '¿Cuál es la capital de Costa Rica?',
          type: 'multiple_choice',
          metadata: { options: ['San José', 'Heredia', 'Alajuela'] },
          correct_answer: 'San José',
          difficulty: 'easy',
          category: 'geografia',
          is_public: 1,
        },
      };
 
      createQuestion.mockReturnValue(10);
      getQuestion.mockReturnValue({
        id: 10,
        question: '¿Cuál es la capital de Costa Rica?',
        type: 'multiple_choice',
      });
 
      QuestionController.create(req, res);
 
      expect(createQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          owner_id: 1,
          question: '¿Cuál es la capital de Costa Rica?',
          type: 'multiple_choice',
          source_type: 'bank',
        })
      );
 
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, question: expect.any(Object) })
      );
    });
 
    test('create - rechaza pregunta sin campo question (RF-QUES-02)', () => {
      req = {
        user: { id: 1, role: 'teacher' },
        body: { type: 'true_false' },
      };
 
      QuestionController.create(req, res);
 
      expect(createQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
 
    test('create - rechaza pregunta sin campo type (RF-QUES-02)', () => {
      req = {
        user: { id: 1, role: 'teacher' },
        body: { question: 'Pregunta sin tipo' },
      };
 
      QuestionController.create(req, res);
 
      expect(createQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
 
    test('create - asigna source_type "bank" por defecto cuando no se envía', () => {
      req = {
        user: { id: 2, role: 'admin' },
        body: { question: 'Pregunta de banco', type: 'short_answer' },
      };
 
      createQuestion.mockReturnValue(11);
      getQuestion.mockReturnValue({ id: 11, question: 'Pregunta de banco', type: 'short_answer' });
 
      QuestionController.create(req, res);
 
      expect(createQuestion).toHaveBeenCalledWith(
        expect.objectContaining({ source_type: 'bank' })
      );
    });
 
    test('create - rechaza creación si el usuario no es teacher ni admin', () => {
      req = {
        user: { id: 5, role: 'student' },
        body: { question: 'Intento de estudiante', type: 'essay' },
      };
 
      QuestionController.create(req, res);
 
      expect(createQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
 
  });
 
  // =========================================================
  // RF-QUES-01: Consulta de preguntas
  // =========================================================
 
  describe('get / list', () => {
 
    test('get - retorna una pregunta existente', () => {
      req = { params: { id: '10' } };
 
      getQuestion.mockReturnValue({ id: 10, question: 'Pregunta existente', type: 'essay' });
 
      QuestionController.get(req, res);
 
      expect(getQuestion).toHaveBeenCalledWith(10);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ question: expect.any(Object) })
      );
    });
 
    test('get - retorna 404 si la pregunta no existe', () => {
      req = { params: { id: '999' } };
 
      getQuestion.mockReturnValue(null);
 
      QuestionController.get(req, res);
 
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
 
    test('list - lista preguntas filtradas por owner_id', () => {
      req = { query: { owner_id: '1' } };
 
      listQuestions.mockReturnValue([
        { id: 1, question: 'P1', type: 'true_false' },
        { id: 2, question: 'P2', type: 'numeric' },
      ]);
 
      QuestionController.list(req, res);
 
      expect(listQuestions).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ questions: expect.any(Array) })
      );
    });
 
    test('list - lista todas las preguntas del banco cuando no se envía owner_id', () => {
      req = { query: {} };
 
      listQuestions.mockReturnValue([{ id: 1, question: 'P1', type: 'essay' }]);
 
      QuestionController.list(req, res);
 
      expect(listQuestions).toHaveBeenCalledWith(undefined);
    });
 
  });
 
  // =========================================================
  // RF-QUES-02: Actualización de preguntas (DEF-QUES-006)
  // =========================================================
 
  describe('update', () => {
 
    test('update - actualiza una pregunta con datos válidos', () => {
      req = {
        params: { id: '10' },
        body: { question: 'Pregunta editada', difficulty: 'hard' },
      };
 
      updateQuestion.mockReturnValue(1);
      getQuestion.mockReturnValue({ id: 10, question: 'Pregunta editada', difficulty: 'hard' });
 
      QuestionController.update(req, res);
 
      expect(updateQuestion).toHaveBeenCalledWith(10, req.body);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, question: expect.any(Object) })
      );
    });
 
    test('update - acepta cambio de tipo sin validar consistencia de metadata/correct_answer (defecto DEF-QUES-006)', () => {
      req = {
        params: { id: '10' },
        body: { type: 'true_false' }, // se cambia el tipo sin ajustar metadata.options ni correct_answer
      };
 
      updateQuestion.mockReturnValue(1);
      getQuestion.mockReturnValue({
        id: 10,
        type: 'true_false',
        metadata: { options: ['San José', 'Heredia', 'Alajuela'] }, // metadata incompatible con true_false
        correct_answer: 'San José',
      });
 
      QuestionController.update(req, res);
 
      // Se espera que el sistema rechace o exija ajustar metadata/correct_answer,
      // pero el controlador delega el body sin ninguna validación adicional
      expect(updateQuestion).toHaveBeenCalledWith(10, expect.objectContaining({ type: 'true_false' }));
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
      // Este caso evidencia DEF-QUES-006: ausencia de validación en update()
    });
 
    test('update - acepta body vacío sin error (sin validación de campos requeridos)', () => {
      req = { params: { id: '10' }, body: {} };
 
      updateQuestion.mockReturnValue(0);
      getQuestion.mockReturnValue({ id: 10, question: 'Pregunta original' });
 
      QuestionController.update(req, res);
 
      expect(updateQuestion).toHaveBeenCalledWith(10, {});
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
 
  });
 
  // =========================================================
  // RF-QUES-01: Eliminación de preguntas
  // =========================================================
 
  describe('delete', () => {
 
    test('delete - elimina una pregunta existente', () => {
      req = { params: { id: '10' } };
 
      deleteQuestion.mockReturnValue(1);
 
      QuestionController.delete(req, res);
 
      expect(deleteQuestion).toHaveBeenCalledWith(10);
      expect(res.json).toHaveBeenCalledWith({ deleted: 1 });
    });
 
    test('delete - retorna deleted 0 si la pregunta no existe', () => {
      req = { params: { id: '999' } };
 
      deleteQuestion.mockReturnValue(0);
 
      QuestionController.delete(req, res);
 
      expect(res.json).toHaveBeenCalledWith({ deleted: 0 });
    });
 
  });
 
});
 
// =========================================================
// TemplateController
// =========================================================
 
describe('TemplateController', () => {
  let req;
  let res;
 
  beforeEach(() => {
    jest.clearAllMocks();
    res = createRes();
  });
 
  // =========================================================
  // RF-TPL-01: Creación de plantillas
  // =========================================================
 
  describe('create', () => {
 
    test('create - crea una plantilla con sección general y preguntas asociadas', () => {
      req = {
        user: { id: 1 },
        body: {
          title: 'Plantilla de Matemáticas',
          description: 'Examen parcial',
          time_limit_minutes: 60,
          questions: [
            { question_id: 1, pts: 2 },
            { question_id: 2, pts: 3 },
          ],
        },
      };
 
      createTemplate.mockReturnValue(100);
      createTemplateSection.mockReturnValue(200);
 
      TemplateController.create(req, res);
 
      expect(createTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ owner_id: 1, title: 'Plantilla de Matemáticas' })
      );
      expect(createTemplateSection).toHaveBeenCalledWith(
        expect.objectContaining({ template_id: 100, title: 'General' })
      );
      expect(addTemplateQuestion).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, template_id: 100 })
      );
    });
 
    test('create - omite preguntas sin question_id', () => {
      req = {
        user: { id: 1 },
        body: {
          title: 'Plantilla incompleta',
          questions: [{ pts: 1 }, { question_id: 5, pts: 1 }],
        },
      };
 
      createTemplate.mockReturnValue(101);
      createTemplateSection.mockReturnValue(201);
 
      TemplateController.create(req, res);
 
      expect(addTemplateQuestion).toHaveBeenCalledTimes(1);
      expect(addTemplateQuestion).toHaveBeenCalledWith(
        expect.objectContaining({ question_id: 5 })
      );
    });
 
    test('create - crea plantilla sin preguntas (arreglo vacío)', () => {
      req = {
        user: { id: 1 },
        body: { title: 'Plantilla vacía', questions: [] },
      };
 
      createTemplate.mockReturnValue(102);
      createTemplateSection.mockReturnValue(202);
 
      TemplateController.create(req, res);
 
      expect(addTemplateQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
 
  });
 
  // =========================================================
  // RF-TPL-01: Consulta de plantillas
  // =========================================================
 
  describe('get', () => {
 
    test('get - retorna una plantilla existente con sus preguntas', () => {
      req = { params: { id: '100' } };
 
      getTemplate.mockReturnValue({
        id: 100,
        title: 'Plantilla de Matemáticas',
        questions: [{ question_id: 1, question: 'P1', type: 'numeric' }],
      });
 
      TemplateController.get(req, res);
 
      expect(getTemplate).toHaveBeenCalledWith('100');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ template: expect.any(Object) })
      );
    });
 
    test('get - retorna 404 si la plantilla no existe', () => {
      req = { params: { id: '999' } };
 
      getTemplate.mockReturnValue(null);
 
      TemplateController.get(req, res);
 
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
 
  });
 
  // =========================================================
  // RF-TPL-01: Actualización de plantillas (DEF-QUES-002)
  // =========================================================
 
  describe('update', () => {
 
    test('update - actualiza una plantilla existente', () => {
      req = {
        params: { id: '100' },
        body: { title: 'Nuevo título' },
      };
 
      updateTemplate.mockReturnValue(1);
 
      TemplateController.update(req, res);
 
      expect(updateTemplate).toHaveBeenCalledWith('100', req.body);
      expect(res.json).toHaveBeenCalledWith({ updated: true });
    });
 
    test('update - actualización parcial no preserva campos no enviados (defecto DEF-QUES-002)', () => {
      req = {
        params: { id: '100' },
        body: { title: 'Solo título actualizado' }, // no se envían description, instructions ni time_limit_minutes
      };
 
      // El modelo updateTemplate sin COALESCE sobrescribe los campos no enviados con NULL
      updateTemplate.mockImplementation(() => 1);
 
      TemplateController.update(req, res);
 
      expect(updateTemplate).toHaveBeenCalledWith('100', { title: 'Solo título actualizado' });
      expect(res.json).toHaveBeenCalledWith({ updated: true });
      // Este caso evidencia DEF-QUES-002: la actualización parcial puede dejar
      // description, instructions y time_limit_minutes en NULL al no usar COALESCE
    });
 
    test('update - retorna updated false si la plantilla no existe', () => {
      req = { params: { id: '999' }, body: { title: 'X' } };
 
      updateTemplate.mockReturnValue(0);
 
      TemplateController.update(req, res);
 
      expect(res.json).toHaveBeenCalledWith({ updated: false });
    });
 
  });
 
  // =========================================================
  // RF-TPL-01: Eliminación de plantillas
  // =========================================================
 
  describe('delete', () => {
 
    test('delete - elimina una plantilla existente', () => {
      req = { params: { id: '100' } };
 
      deleteTemplate.mockReturnValue(1);
 
      TemplateController.delete(req, res);
 
      expect(deleteTemplate).toHaveBeenCalledWith('100');
      expect(res.json).toHaveBeenCalledWith({ deleted: true });
    });
 
    test('delete - retorna deleted false si la plantilla no existe', () => {
      req = { params: { id: '999' } };
 
      deleteTemplate.mockReturnValue(0);
 
      TemplateController.delete(req, res);
 
      expect(res.json).toHaveBeenCalledWith({ deleted: false });
    });
 
  });
 
  // =========================================================
  // RF-TPL-02: Generación de examen desde plantilla (DEF-QUES-005)
  // =========================================================
 
  describe('use', () => {
 
    test('use - retorna 404 si la plantilla no existe', () => {
      req = { params: { id: '999' }, user: { id: 1 } };
 
      getTemplate.mockReturnValue(null);
 
      TemplateController.use(req, res);
 
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
 
    test('use - genera un examen copiando TODAS las preguntas de la plantilla sin aplicar reglas de selección (defecto DEF-QUES-005)', () => {
      req = { params: { id: '100' }, user: { id: 1 } };
 
      getTemplate.mockReturnValue({
        id: 100,
        title: 'Plantilla con 5 preguntas',
        description: '',
        instructions: '',
        time_limit_minutes: 60,
        shuffle_questions: 0,
        shuffle_answers: 0,
        questions: [
          { question_id: 1, question: 'P1', type: 'multiple_choice', pts: 1 },
          { question_id: 2, question: 'P2', type: 'true_false', pts: 1 },
          { question_id: 3, question: 'P3', type: 'numeric', pts: 1 },
          { question_id: 4, question: 'P4', type: 'short_answer', pts: 1 },
          { question_id: 5, question: 'P5', type: 'essay', pts: 1 },
        ],
      });
 
      TemplateController.use(req, res);
 
      expect(createTest).toHaveBeenCalledWith(
        expect.objectContaining({ template_id: 100, status: 'draft' })
      );
 
      // RF-TPL-02 esperaría que se aplique selección/cantidad/etiquetas configuradas en la plantilla,
      // pero el controlador copia las 5 preguntas sin filtrar ni aleatorizar
      expect(addTestQuestion).toHaveBeenCalledTimes(5);
      expect(res.redirect).toHaveBeenCalled();
      // Este caso evidencia DEF-QUES-005: generación de examen sin aplicar reglas de selección
    });
 
  });
 
});
 