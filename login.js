document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('.checkbox-input').checked;
    
    console.log('Login attempt:', {
        email: email,
        password: '***',
        rememberMe: remember
    });
    
    // Here you would typically send the credentials to your backend
    alert('Login form submitted!\nEmail: ' + email + '\nRemember me: ' + remember);
});
