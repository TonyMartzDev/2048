const Utils = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePassword(password) {
        return password.length >= 6;
    },

    showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        element.parentElement.appendChild(errorDiv);
        element.classList.add('error');
        
        setTimeout(() => {
            errorDiv.remove();
            element.classList.remove('error');
        }, 3000);
    },

    clearErrors(form) {
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        
        const errorInputs = form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
