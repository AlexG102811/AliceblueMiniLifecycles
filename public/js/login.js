(function () {
  var form = document.getElementById('login-form');
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var usernameError = document.getElementById('username-error');
  var passwordError = document.getElementById('password-error');
  var formAlert = document.getElementById('form-alert');
  var submitBtn = document.getElementById('login-btn');

  function showFieldError(errorEl, inputEl, message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    inputEl.classList.add('invalid');
  }

  function clearFieldError(errorEl, inputEl) {
    errorEl.hidden = true;
    inputEl.classList.remove('invalid');
  }

  function validate() {
    var valid = true;
    clearFieldError(usernameError, usernameInput);
    clearFieldError(passwordError, passwordInput);

    if (!usernameInput.value.trim()) {
      showFieldError(usernameError, usernameInput, 'Username is required.');
      valid = false;
    }
    if (!passwordInput.value) {
      showFieldError(passwordError, passwordInput, 'Password is required.');
      valid = false;
    }
    return valid;
  }

  usernameInput.addEventListener('blur', validate);
  passwordInput.addEventListener('blur', validate);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formAlert.hidden = true;

    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value
      })
    })
      .then(function (res) {
        if (res.ok) {
          window.location.href = '/dashboard.html';
          return null;
        }
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (data === null) return;
        formAlert.textContent = (data && data.error) || 'Invalid username or password.';
        formAlert.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
      })
      .catch(function () {
        formAlert.textContent = 'Could not reach the server. Please try again.';
        formAlert.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
      });
  });
})();
