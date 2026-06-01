const express = require('express');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const router = express.Router();

const {
  createUser,
  getUserByEmail,
  getUserById
} = require('../models/user');

const {
  generateToken
} = require('../middleware/auth');

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'teacher', 'admin']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

/*
=====================================
POST /auth/register
=====================================
*/

router.post('/register', async (req, res) => {

  try {

    const data =
      registerSchema.parse(req.body);

    const existing =
      getUserByEmail(data.email);

    if (existing) {

      return res.status(409).json({
        error: 'El correo electrónico ya existe'
      });
    }

    const hashed =
      await bcrypt.hash(data.password, 10);

    const user = createUser({

      name: data.name,

      email: data.email,

      password: hashed,

      role: data.role || 'student'
    });

    return res.status(201).json({
      success: true,
      user
    });

  } catch (err) {

    if (err instanceof z.ZodError) {

      return res.status(400).json({
        error: 'Error de validación',
        issues: err.issues
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Error interno del servidor'

    });
  }
});

/*
=====================================
POST /auth/login
=====================================
*/

router.post('/login', async (req, res) => {

  try {

    const body =
      loginSchema.parse(req.body);

    const user =
      getUserByEmail(body.email);

    if (!user) {

      return res.status(401).json({
        error: 'Credenciales no válidas'
      });
    }

    const ok =
      await bcrypt.compare(
        body.password,
        user.password
      );

    if (!ok) {

      return res.status(401).json({
        error: 'Credenciales no válidas'
      });
    }

    const token = generateToken({

      id: user.id,

      email: user.email,

      name: user.name,

      role: user.role
    });

    res.cookie('token', token, {

      httpOnly: true,

      sameSite: 'lax',

      secure:
        process.env.NODE_ENV === 'production',

      maxAge:
        1000 * 60 * 60 * 24 * 7
    });

    return res.json({

      success: true,

      token,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role
      }
    });

  } catch (err) {

    if (err instanceof z.ZodError) {

      return res.status(400).json({
        error: 'Error de validación',
        issues: err.issues
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Error interno del servidor'

    });
  }
});

/*
=====================================
GET /auth/me
=====================================
*/

router.get('/me', (req, res) => {

  try {

    if (!req.user) {

      return res.status(401).json({
        error: 'No autenticado'
      });
    }

    const user =
      getUserById(req.user.id);

    if (!user) {

      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    delete user.password;

    return res.json({
      user
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      error: 'Error interno del servidor'

    });
  }
});

module.exports = router;
