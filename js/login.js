document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.querySelector('[data-tab="login"]');
    const signupTab = document.querySelector('[data-tab="signup"]');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === 'true') {
        switchTab('signup');
    }
    
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));
    
    function switchTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }
    
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            } else {
                input.type = 'password';
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            }
        });
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Utils.clearErrors(loginForm);
        
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (!Utils.validateEmail(email)) {
            Utils.showError(document.getElementById('loginEmail'), 'Please enter a valid email address');
            return;
        }
        
        const result = auth.login(email, password);
        
        if (result.success) {
            appState.setState('user', result.user);
            appState.setState('isAuthenticated', true);
            
            showSuccessMessage('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            Utils.showError(document.getElementById('loginPassword'), result.message);
        }
    });
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Utils.clearErrors(signupForm);
        
        const formData = new FormData(signupForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');
        const termsAccepted = formData.get('terms');
        
        if (!name || name.trim().length < 2) {
            Utils.showError(document.getElementById('signupName'), 'Please enter your full name');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showError(document.getElementById('signupEmail'), 'Please enter a valid email address');
            return;
        }
        
        if (!Utils.validatePassword(password)) {
            Utils.showError(document.getElementById('signupPassword'), 'Password must be at least 6 characters');
            return;
        }
        
        if (!termsAccepted) {
            alert('Please accept the Terms of Service and Privacy Policy');
            return;
        }
        
        const result = auth.register(email, password, name);
        
        if (result.success) {
            result.user.role = role;
            appState.setState('user', result.user);
            appState.setState('isAuthenticated', true);
            
            showSuccessMessage('Account created successfully! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            Utils.showError(document.getElementById('signupEmail'), result.message);
        }
    });
    
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            animation: slideIn 0.3s ease;
            z-index: 9999;
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', () => {
            alert('Social login coming soon! For now, please use email/password authentication.');
        });
    });
});
