const bcrypt = require('bcrypt');
const { getUserById, getUserByEmail, updateUser } = require('../../api/models/user');

function profilePage(req, res, baseContext) {
  if (!req.user) return res.redirect('/auth/login');

  const dbUser = getUserById(req.user.id);
  if (!dbUser) return res.redirect('/profile?error=' + encodeURIComponent('Usuario no encontrado'));

  const profileData = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    bio: dbUser.bio || '',
    memberSince: dbUser.created_at,
    initials: (dbUser.name || '').split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase()
  };

  const successMessage = req.query.updated ? 'Perfil actualizado correctamente.' : null;
  const errorMessage = req.query.error ? req.query.error : null;

  const ctx = baseContext(req, {
    pageTitle: 'Mi perfil',
    active: { profile: true },
    locals: { profileData, user: profileData, successMessage, errorMessage }
  });

  res.render('shared/profile', ctx);
}

async function profileUpdate(req, res) {
  if (!req.user) return res.redirect('/auth/login');

  const { fullName, email, bio, currentPassword, newPassword, confirmPassword } = req.body;

  const dbUser = getUserById(req.user.id);
  if (!dbUser) return res.redirect('/profile?error=' + encodeURIComponent('Usuario no encontrado'));

  const updates = {
    name: fullName && fullName.trim() ? fullName.trim() : null,
    email: email && email.trim() ? email.trim() : null,
    bio: bio !== undefined ? bio.trim() : null,
    password: null,
    role: null
  };

  // Password change — only if currentPassword is provided
  if (currentPassword) {
    const valid = await bcrypt.compare(currentPassword, dbUser.password);
    if (!valid) {
      return res.redirect('/profile?error=' + encodeURIComponent('Contraseña actual incorrecta'));
    }
    if (!newPassword || newPassword.length < 6) {
      return res.redirect('/profile?error=' + encodeURIComponent('La nueva contraseña debe tener al menos 6 caracteres'));
    }
    if (newPassword !== confirmPassword) {
      return res.redirect('/profile?error=' + encodeURIComponent('Las contraseñas no coinciden'));
    }
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  updateUser(req.user.id, updates);
  res.redirect('/profile?updated=1');
}

module.exports = { profilePage, profileUpdate };
