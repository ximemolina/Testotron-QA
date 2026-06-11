const { GroupController } = require('../../testotron/api/controllers/group');
 
const {
  createGroup,
  getGroup,
  listGroups,
  groupDetail,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  addMemberByEmail,
} = require('../../testotron/api/models/group');
 
// ==========================
// MOCKS
// ==========================
jest.mock('../../testotron/api/models/group');
 
const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  redirect: jest.fn(),
});
 
// ==========================
 
describe('GroupController', () => {
  let req;
  let res;
 
  beforeEach(() => {
    jest.clearAllMocks();
    res = createRes();
  });
 
  // =========================================================
  // RF-GRP-01: Creación de grupos
  // =========================================================
 
  describe('create', () => {
 
    test('create - crea un grupo con nombre y descripción válidos', () => {
      req = {
        body: { name: 'Grupo A', description: 'Descripción del grupo' },
        user: { id: 1 },
        headers: { accept: 'application/json' },
      };
 
      createGroup.mockReturnValue({
        code: 'ABC123',
        name: 'Grupo A',
        owner_id: 1,
        description: 'Descripción del grupo',
      });
 
      GroupController.create(req, res);
 
      expect(createGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Grupo A',
          owner_id: 1,
          description: 'Descripción del grupo',
        })
      );
 
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ group: expect.any(Object) })
      );
    });
 
    test('create - crea un grupo sin descripción (campo opcional)', () => {
      req = {
        body: { name: 'Grupo B' },
        user: { id: 1 },
        headers: { accept: 'application/json' },
      };
 
      createGroup.mockReturnValue({
        code: 'XYZ789',
        name: 'Grupo B',
        owner_id: 1,
        description: '',
      });
 
      GroupController.create(req, res);
 
      expect(createGroup).toHaveBeenCalledWith(
        expect.objectContaining({ description: '' })
      );
 
      expect(res.status).toHaveBeenCalledWith(201);
    });
 
    test('create - crea un grupo con nombre vacío (defecto DEF-GRP-002)', () => {
      req = {
        body: { name: '' },
        user: { id: 1 },
        headers: { accept: 'application/json' },
      };
 
      createGroup.mockReturnValue({
        code: 'DEF001',
        name: '',
        owner_id: 1,
        description: '',
      });
 
      GroupController.create(req, res);
 
      // Se espera rechazo, pero el controlador no valida: el grupo se crea igual
      expect(res.status).toHaveBeenCalledWith(201);
      // Este caso evidencia DEF-GRP-002: no hay validación del campo name
    });
 
  });
 
  // =========================================================
  // RF-GRP-04 / RF-GRP-05: Consulta general y por código
  // =========================================================
 
  describe('list', () => {
 
    test('list - docente obtiene solo sus grupos', () => {
      req = {
        user: { id: 2, role: 'teacher' },
        query: {},
      };
 
      listGroups.mockReturnValue([
        { code: 'GRP001', name: 'Grupo A', owner_id: 2 },
      ]);
 
      GroupController.list(req, res);
 
      expect(listGroups).toHaveBeenCalledWith({ owner_id: 2 });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ groups: expect.any(Array) })
      );
    });
 
    test('list - administrador obtiene todos los grupos', () => {
      req = {
        user: { id: 1, role: 'admin' },
        query: {},
      };
 
      listGroups.mockReturnValue([
        { code: 'GRP001', name: 'Grupo A', owner_id: 2 },
        { code: 'GRP002', name: 'Grupo B', owner_id: 3 },
      ]);
 
      GroupController.list(req, res);
 
      expect(listGroups).toHaveBeenCalledWith({ owner_id: undefined });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ groups: expect.any(Array) })
      );
    });
 
  });
 
  describe('get', () => {
 
    test('get - retorna datos básicos de un grupo existente', () => {
      req = { params: { code: 'GRP001' } };
 
      getGroup.mockReturnValue({
        code: 'GRP001',
        name: 'Grupo A',
        owner_id: 1,
      });
 
      GroupController.get(req, res);
 
      expect(getGroup).toHaveBeenCalledWith('GRP001');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ group: expect.any(Object) })
      );
    });
 
    test('get - retorna 404 si el grupo no existe', () => {
      req = { params: { code: 'NOEXISTE' } };
 
      getGroup.mockReturnValue(null);
 
      GroupController.get(req, res);
 
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
 
  });
 
  describe('detail', () => {
 
    test('detail - retorna detalle completo de un grupo existente', () => {
      req = { params: { code: 'GRP001' } };
 
      groupDetail.mockReturnValue({
        code: 'GRP001',
        name: 'Grupo A',
        members: [],
        quizzes: [],
        membersCount: 0,
        quizzesCount: 0,
        averageScore: 0,
      });
 
      GroupController.detail(req, res);
 
      expect(groupDetail).toHaveBeenCalledWith('GRP001');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ group: expect.any(Object) })
      );
    });
 
    test('detail - retorna 404 si el grupo no existe', () => {
      req = { params: { code: 'NOEXISTE' } };
 
      groupDetail.mockReturnValue(null);
 
      GroupController.detail(req, res);
 
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
 
  });
 
  // =========================================================
  // RF-GRP-02: Modificación de grupos
  // =========================================================
 
  describe('update', () => {
 
    test('update - actualiza nombre y descripción de un grupo existente', () => {
      req = {
        params: { code: 'GRP001' },
        body: { name: 'Nuevo nombre', description: 'Nueva descripción' },
        headers: { accept: 'application/json' },
      };
 
      updateGroup.mockReturnValue(1);
 
      GroupController.update(req, res);
 
      expect(updateGroup).toHaveBeenCalledWith(
        'GRP001',
        expect.objectContaining({ name: 'Nuevo nombre', description: 'Nueva descripción' })
      );
 
      expect(res.json).toHaveBeenCalledWith({ updated: true });
    });
 
    test('update - retorna updated false si el grupo no existe', () => {
      req = {
        params: { code: 'NOEXISTE' },
        body: { name: 'X' },
        headers: { accept: 'application/json' },
      };
 
      updateGroup.mockReturnValue(0);
 
      GroupController.update(req, res);
 
      expect(res.json).toHaveBeenCalledWith({ updated: false });
    });
 
  });
 
  // =========================================================
  // RF-GRP-03: Eliminación de grupos
  // =========================================================
 
  describe('delete', () => {
 
    test('delete - elimina un grupo existente correctamente', () => {
      req = { params: { code: 'GRP001' } };
 
      deleteGroup.mockReturnValue(1);
 
      GroupController.delete(req, res);
 
      expect(deleteGroup).toHaveBeenCalledWith('GRP001');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
 
    test('delete - retorna error si el grupo no existe', () => {
      req = { params: { code: 'NOEXISTE' } };
 
      deleteGroup.mockReturnValue(0);
 
      GroupController.delete(req, res);
 
      expect(res.status).toHaveBeenCalledWith(500);
    });
 
    test('delete - elimina grupo con miembros activos sin verificación (defecto DEF-GRP-003)', () => {
      req = { params: { code: 'GRP002' } };
 
      // El modelo retorna 1 (eliminado) sin considerar miembros activos
      deleteGroup.mockReturnValue(1);
 
      GroupController.delete(req, res);
 
      // Se espera bloqueo o advertencia, pero el controlador elimina sin verificar
      expect(res.json).toHaveBeenCalledWith({ success: true });
      // Este caso evidencia DEF-GRP-003: no hay verificación de miembros activos
    });
 
  });
 
  // =========================================================
  // RF-GRP-08: Agregar miembro por correo
  // =========================================================
 
  describe('addMemberByEmail', () => {
 
    test('addMemberByEmail - agrega un usuario existente por correo válido', () => {
      req = {
        params: { code: 'GRP001' },
        body: { email: 'usuario@test.com' },
        headers: {},
      };
 
      getGroup.mockReturnValue({ code: 'GRP001', name: 'Grupo A' });
      addMemberByEmail.mockReturnValue({ id: 5, name: 'Usuario Test' });
 
      GroupController.addMemberByEmail(req, res);
 
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('success')
      );
    });
 
    test('addMemberByEmail - redirige con error si el correo no corresponde a un usuario', () => {
      req = {
        params: { code: 'GRP001' },
        body: { email: 'noexiste@test.com' },
        headers: {},
      };
 
      getGroup.mockReturnValue({ code: 'GRP001' });
      addMemberByEmail.mockImplementation(() => {
        throw new Error('Usuario no encontrado');
      });
 
      GroupController.addMemberByEmail(req, res);
 
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
    });
 
    test('addMemberByEmail - redirige con error si el usuario ya pertenece al grupo', () => {
      req = {
        params: { code: 'GRP001' },
        body: { email: 'usuario@test.com' },
        headers: {},
      };
 
      getGroup.mockReturnValue({ code: 'GRP001' });
      addMemberByEmail.mockImplementation(() => {
        throw new Error('El usuario ya pertenece al grupo');
      });
 
      GroupController.addMemberByEmail(req, res);
 
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
    });
 
    test('addMemberByEmail - redirige con error si el código de grupo es inválido', () => {
      req = {
        params: { code: '' },
        body: { email: 'usuario@test.com' },
        headers: {},
      };
 
      GroupController.addMemberByEmail(req, res);
 
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
    });
 
  });
 
  // =========================================================
  // RF-GRP-09: Unirse a grupo por código
  // =========================================================
 
  describe('joinGroupByCode', () => {
 
    test('joinGroupByCode - estudiante se une a grupo con código válido', () => {
      req = {
        user: { id: 3, role: 'student' },
        body: { code: 'GRP001' },
        params: {},
        headers: { accept: 'application/json' },
      };
 
      getGroup.mockReturnValue({ code: 'GRP001', name: 'Grupo A' });
      addMember.mockReturnValue(1);
 
      GroupController.joinGroupByCode(req, res);
 
      expect(res.json).toHaveBeenCalledWith({ added: true });
    });
 
    test('joinGroupByCode - redirige con error si el código de grupo no existe', () => {
      req = {
        user: { id: 3, role: 'student' },
        body: { code: 'NOEXISTE' },
        params: {},
        headers: {},
      };
 
      getGroup.mockReturnValue(null);
 
      GroupController.joinGroupByCode(req, res);
 
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
    });
 
    test('joinGroupByCode - docente es rechazado al intentar unirse por código (defecto DEF-GRP-004)', () => {
      req = {
        user: { id: 2, role: 'teacher' },
        body: { code: 'GRP001' },
        params: {},
        headers: {},
      };
 
      GroupController.joinGroupByCode(req, res);
 
      // Según RF-GRP-09 cualquier usuario debería poder unirse,
      // pero el controlador restringe a estudiantes únicamente
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error')
      );
      // Este caso evidencia DEF-GRP-004: restricción de rol inconsistente con RF-GRP-09
    });
 
    test('joinGroupByCode - redirige a login si el usuario no está autenticado', () => {
      req = {
        user: null,
        body: { code: 'GRP001' },
        params: {},
        headers: {},
      };
 
      GroupController.joinGroupByCode(req, res);
 
      expect(res.redirect).toHaveBeenCalledWith('/auth/login');
    });
 
  });
 
  // =========================================================
  // RF-GRP-10: Eliminación de miembros
  // =========================================================
 
  describe('removeMember', () => {
 
    test('removeMember - elimina miembro existente del grupo correctamente', () => {
      req = {
        params: { code: 'GRP001' },
        body: { user_id: 5 },
        headers: { accept: 'application/json' },
      };
 
      removeMember.mockReturnValue(1);
 
      GroupController.removeMember(req, res);
 
      expect(removeMember).toHaveBeenCalledWith('GRP001', 5);
      expect(res.json).toHaveBeenCalledWith({ removed: true });
    });
 
    test('removeMember - retorna removed false si el usuario no pertenece al grupo (defecto DEF-GRP-005)', () => {
      req = {
        params: { code: 'GRP001' },
        body: { user_id: 99 },
        headers: { accept: 'application/json' },
      };
 
      removeMember.mockReturnValue(0);
 
      GroupController.removeMember(req, res);
 
      // Se espera advertencia o error explícito, pero retorna removed: false sin notificación
      expect(res.json).toHaveBeenCalledWith({ removed: false });
      // Este caso evidencia DEF-GRP-005: sin validación de membresía previa
    });
 
  });
 
});