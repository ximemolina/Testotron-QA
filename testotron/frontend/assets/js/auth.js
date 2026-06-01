document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('loginForm');

  if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {

      if (!window.apiClient) return;

      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value.trim();

      if (!email) {
        alert('El correo electrónico es obligatorio.');
        loginForm.querySelector('input[name="email"]').focus();
        return;
      }
      if (!password) {
        alert('La contraseña es obligatoria.');
        loginForm.querySelector('input[name="password"]').focus();
        return;
      }

      try {
        const response = await window.apiClient.login(email, password);
	const me = await window.apiClient.fetchCurrentUser();
        let role = response?.user?.role;

        if (!role) {
          const user = window.apiClient.getUser();
          role = user?.role;
        }

        if (!role) {
          role = 'student';
        }
	
        console.log('Logged in as:', role);
        window.location.href = `/dashboard`;  

      } catch (err) {

        console.error(err);

        const msg =
          (err && (err.error || err.message))
            ? (err.error || err.message)
            : 'Error al iniciar sesión';

        alert(msg);
      }

    });

  }

  // Register form
  const registerForm =
    document.querySelector('form[action="/auth/register"]') ||
    document.querySelector('form[action="auth/register"]');
  if (registerForm && window.apiClient) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = registerForm;
      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const password = form.querySelector('input[name="password"]').value.trim();
      const roleField = form.querySelector('select[name="role"]');
      const role = roleField ? roleField.value : 'student';

      if (!name) {
        alert('El nombre es obligatorio.');
        form.querySelector('input[name="name"]').focus();
        return;
      }
      if (!email) {
        alert('El correo electrónico es obligatorio.');
        form.querySelector('input[name="email"]').focus();
        return;
      }
      if (!password) {
        alert('La contraseña es obligatoria.');
        form.querySelector('input[name="password"]').focus();
        return;
      }
      if (roleField && !role) {
        alert('Debes seleccionar un rol.');
        roleField.focus();
        return;
      }

      try {
        await window.apiClient.register(name, email, password, role);
        window.location.href = '/auth/login';
      } catch (err) {
        console.error(err);
        const msg =
          (err && (err.error || err.message))
            ? (err.error || err.message)
            : 'Error en el registro';

        alert(msg);
      }

    });

  }

});
