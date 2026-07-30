// Signup Form Handler
class SignupForm {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.termsCheckbox = document.getElementById('terms');
        this.signupButton = document.getElementById('signupButton');
        this.successMessage = document.getElementById('successMessage');

        this.init();
    }

    init() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        this.firstNameInput.addEventListener('blur', () => this.validateFirstName());
        this.lastNameInput.addEventListener('blur', () => this.validateLastName());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.handlePasswordInput());
        this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        this.termsCheckbox.addEventListener('change', () => this.validateTerms());

        // Password toggle buttons
        this.setupPasswordToggle('password', 'togglePassword');
        this.setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');

        // Auto-focus first input
        this.firstNameInput.focus();
    }

    // Validation Methods
    validateFirstName() {
        const value = this.firstNameInput.value.trim();
        const error = document.getElementById('firstNameError');

        if (!value) {
            this.showError(this.firstNameInput, error, 'First name is required');
            return false;
        }
        if (value.length < 2) {
            this.showError(this.firstNameInput, error, 'First name must be at least 2 characters');
            return false;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            this.showError(this.firstNameInput, error, 'First name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }

        this.clearError(this.firstNameInput, error);
        return true;
    }

    validateLastName() {
        const value = this.lastNameInput.value.trim();
        const error = document.getElementById('lastNameError');

        if (!value) {
            this.showError(this.lastNameInput, error, 'Last name is required');
            return false;
        }
        if (value.length < 2) {
            this.showError(this.lastNameInput, error, 'Last name must be at least 2 characters');
            return false;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            this.showError(this.lastNameInput, error, 'Last name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }

        this.clearError(this.lastNameInput, error);
        return true;
    }

    validateEmail() {
        const value = this.emailInput.value.trim();
        const error = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            this.showError(this.emailInput, error, 'Email is required');
            return false;
        }
        if (!emailRegex.test(value)) {
            this.showError(this.emailInput, error, 'Please enter a valid email address');
            return false;
        }

        this.clearError(this.emailInput, error);
        return true;
    }

    validatePassword() {
        const value = this.passwordInput.value;
        const error = document.getElementById('passwordError');

        if (!value) {
            this.showError(this.passwordInput, error, 'Password is required');
            return false;
        }
        if (value.length < 8) {
            this.showError(this.passwordInput, error, 'Password must be at least 8 characters');
            return false;
        }
        if (!/[A-Z]/.test(value)) {
            this.showError(this.passwordInput, error, 'Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(value)) {
            this.showError(this.passwordInput, error, 'Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(value)) {
            this.showError(this.passwordInput, error, 'Password must contain at least one number');
            return false;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            this.showError(this.passwordInput, error, 'Password must contain at least one special character');
            return false;
        }

        this.clearError(this.passwordInput, error);
        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const error = document.getElementById('confirmPasswordError');

        if (!confirmPassword) {
            this.showError(this.confirmPasswordInput, error, 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            this.showError(this.confirmPasswordInput, error, 'Passwords do not match');
            return false;
        }

        this.clearError(this.confirmPasswordInput, error);
        return true;
    }

    validateTerms() {
        const error = document.getElementById('termsError');

        if (!this.termsCheckbox.checked) {
            this.showError(this.termsCheckbox, error, 'You must agree to the Terms & Conditions');
            return false;
        }

        error.classList.remove('show');
        return true;
    }

    // Password strength indicator
    handlePasswordInput() {
        const value = this.passwordInput.value;
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        if (!value) {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = '';
            return;
        }

        const strength = this.calculatePasswordStrength(value);

        strengthBar.className = `strength-bar ${strength.level}`;
        strengthText.className = `strength-text ${strength.level}`;
        strengthText.textContent = strength.text;

        this.validatePassword();
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        };

        Object.values(checks).forEach(check => {
            if (check) score++;
        });

        if (score <= 2) {
            return { level: 'weak', text: 'Weak password' };
        } else if (score <= 4) {
            return { level: 'fair', text: 'Fair password' };
        } else {
            return { level: 'strong', text: 'Strong password' };
        }
    }

    // Password visibility toggle
    setupPasswordToggle(inputId, toggleId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            toggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    // Helper methods
    showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearError(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }

    // Form submission
    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isFirstNameValid = this.validateFirstName();
        const isLastNameValid = this.validateLastName();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmPasswordValid = this.validateConfirmPassword();
        const isTermsValid = this.validateTerms();

        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsValid) {
            return;
        }

        // Disable button and show loader
        this.signupButton.disabled = true;
        const buttonText = this.signupButton.querySelector('.button-text');
        const buttonLoader = document.getElementById('buttonLoader');
        buttonText.classList.add('hide');
        buttonLoader.classList.add('show');

        try {
            // Simulate API call
            const formData = {
                firstName: this.firstNameInput.value.trim(),
                lastName: this.lastNameInput.value.trim(),
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value,
                newsletter: document.getElementById('newsletter').checked,
            };

            console.log('Signup attempt:', {
                ...formData,
                password: '***',
            });

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            this.successMessage.classList.add('show');

            // Reset form after delay
            setTimeout(() => {
                // In a real application, redirect to login or dashboard
                console.log('Signup successful! User data:', formData);
                // window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
        } finally {
            // Re-enable button and hide loader
            this.signupButton.disabled = false;
            buttonText.classList.remove('hide');
            buttonLoader.classList.remove('show');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SignupForm();
});
