// ── Password strength ──────────────────────────────────────────────────────
function getStrength(password) {
    let score = 0;
    if (password.length >= 8)  score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0–4
}

const strengthInfo = ['', 'weak', 'fair', 'good', 'strong'];
const strengthText = ['', 'Weak', 'Fair', 'Good', 'Strong'];

const passwordInput    = document.getElementById('password');
const strengthBar      = document.getElementById('passwordStrength');
const strengthLabel    = document.getElementById('strengthLabel');

passwordInput.addEventListener('input', function () {
    const val = this.value;
    if (val.length === 0) {
        strengthBar.className = 'password-strength';
        strengthLabel.textContent = '';
        return;
    }
    const score = getStrength(val);
    strengthBar.className = `password-strength visible strength-${strengthInfo[score]}`;
    strengthLabel.textContent = strengthText[score];
});

// ── Toggle password visibility ─────────────────────────────────────────────
document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const target = document.getElementById(this.dataset.target);
        target.type = target.type === 'password' ? 'text' : 'password';
    });
});

// ── Validation helpers ─────────────────────────────────────────────────────
function showError(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.add('visible');
    const input = document.getElementById(id.replace('Error', ''));
    if (input) input.classList.add('error');
}

function clearError(id) {
    const el = document.getElementById(id);
    el.textContent = '';
    el.classList.remove('visible');
    const input = document.getElementById(id.replace('Error', ''));
    if (input) input.classList.remove('error');
}

function validateForm() {
    let valid = true;

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value;
    const confirm   = document.getElementById('confirmPassword').value;
    const terms     = document.getElementById('terms').checked;

    // First name
    if (!firstName) {
        showError('firstNameError', 'First name is required.');
        valid = false;
    } else {
        clearError('firstNameError');
    }

    // Last name
    if (!lastName) {
        showError('lastNameError', 'Last name is required.');
        valid = false;
    } else {
        clearError('lastNameError');
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('emailError', 'Email address is required.');
        valid = false;
    } else if (!emailPattern.test(email)) {
        showError('emailError', 'Please enter a valid email address.');
        valid = false;
    } else {
        clearError('emailError');
    }

    // Password
    if (!password) {
        showError('passwordError', 'Password is required.');
        valid = false;
    } else if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters.');
        valid = false;
    } else {
        clearError('passwordError');
    }

    // Confirm password
    if (!confirm) {
        showError('confirmPasswordError', 'Please confirm your password.');
        valid = false;
    } else if (confirm !== password) {
        showError('confirmPasswordError', 'Passwords do not match.');
        valid = false;
    } else {
        clearError('confirmPasswordError');
    }

    // Terms
    if (!terms) {
        showError('termsError', 'You must accept the Terms of Service to continue.');
        valid = false;
    } else {
        clearError('termsError');
    }

    return valid;
}

// ── Form submission ────────────────────────────────────────────────────────
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const firstName = document.getElementById('firstName').value.trim();
    const email     = document.getElementById('email').value.trim();

    // Here you would typically POST the data to your backend
    alert(`Account created successfully!\nWelcome, ${firstName}!\nEmail: ${email}`);
});
