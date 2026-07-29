<!-- 1 -->document.getElementById('loginForm').addEventListener('submit', function(e) {
<!-- 2 -->    e.preventDefault();
<!-- 3 -->    
<!-- 4 -->    const email = document.getElementById('email').value;
<!-- 5 -->    const password = document.getElementById('password').value;
<!-- 6 -->    const remember = document.querySelector('.checkbox-input').checked;
<!-- 7 -->    
<!-- 8 -->    console.log('Login attempt:', {
<!-- 9 -->        email: email,
<!-- 10 -->        password: '***',
<!-- 11 -->        rememberMe: remember
<!-- 12 -->    });
<!-- 13 -->    
<!-- 14 -->    // Here you would typically send the credentials to your backend
<!-- 15 -->    alert('Login form submitted!\nEmail: ' + email + '\nRemember me: ' + remember);
<!-- 16 -->});
