/**
 * Login Form Handler
 * Handles form validation, password visibility toggle, and submission
 */

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

/**
 * Password visibility toggle handler
 */
passwordToggle.addEventListener('click', (e) => {
    e.preventDefault();
    
    const isPassword = passwordInput.type === 'password';
    const eyeIcon = passwordToggle.querySelector('.eye-icon');
    const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');
    
    // Toggle input type
    passwordInput.type = isPassword ? 'text' : 'password';
    
    // Toggle icon visibility
    if (isPassword) {
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
    } else {
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
    }
    
    // Update aria-label for accessibility
    passwordToggle.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password'
    );
});

/**
 * Email validation
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Password validation (minimum 6 characters)
 */
function validatePassword(password) {
    return password.length >= 6;
}

/**
 * Update error message and field styling
 */
function setError(input, errorElement, message) {
    if (message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    } else {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

/**
 * Real-time email validation
 */
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        setError(emailInput, emailError, 'Email is required');
    } else if (!validateEmail(email)) {
        setError(emailInput, emailError, 'Please enter a valid email address');
    } else {
        setError(emailInput, emailError, '');
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
            setError(emailInput, emailError, '');
        }
    }
});

/**
 * Real-time password validation
 */
passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    
    if (!password) {
        setError(passwordInput, passwordError, 'Password is required');
    } else if (!validatePassword(password)) {
        setError(passwordInput, passwordError, 'Password must be at least 6 characters');
    } else {
        setError(passwordInput, passwordError, '');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('error')) {
        const password = passwordInput.value;
        if (password && validatePassword(password)) {
            setError(passwordInput, passwordError, '');
        }
    }
});

/**
 * Form submission handler
 */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = document.querySelector('.checkbox-input').checked;
    
    // Validate all fields
    let isValid = true;
    
    if (!email) {
        setError(emailInput, emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        setError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
    } else {
        setError(emailInput, emailError, '');
    }
    
    if (!password) {
        setError(passwordInput, passwordError, 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        setError(passwordInput, passwordError, 'Password must be at least 6 characters');
        isValid = false;
    } else {
        setError(passwordInput, passwordError, '');
    }
    
    if (!isValid) {
        return;
    }
    
    // Disable button during submission
    const button = loginForm.querySelector('.login-button');
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Signing in...';
    
    try {
        // TODO: Replace with your actual backend endpoint
        // Example: const response = await fetch('/api/auth/login', { ... })
        
        console.log('Login attempt:', {
            email: email,
            rememberMe: remember
        });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Success case - you would typically redirect or update UI here
        alert('Login successful!\nEmail: ' + email + '\nRemember me: ' + remember);
        
        // Example: window.location.href = '/dashboard';
        
    } catch (error) {
        // Handle error
        console.error('Login failed:', error);
        setError(emailInput, emailError, 'Login failed. Please try again.');
    } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = originalText;
    }
});
