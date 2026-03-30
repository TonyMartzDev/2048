class AuthManager {
    constructor() {
        this.users = this.loadUsers();
    }

    loadUsers() {
        const users = localStorage.getItem('agile_wheel_users');
        return users ? JSON.parse(users) : [];
    }

    saveUsers() {
        localStorage.setItem('agile_wheel_users', JSON.stringify(this.users));
    }

    register(email, password, name) {
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        const user = {
            id: this.generateId(),
            email,
            password: this.hashPassword(password),
            name,
            createdAt: new Date().toISOString(),
            role: 'developer'
        };

        this.users.push(user);
        this.saveUsers();

        return { success: true, user: this.sanitizeUser(user) };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid email or password' };
        }

        return { success: true, user: this.sanitizeUser(user) };
    }

    logout() {
        appState.setState('user', null);
        appState.setState('isAuthenticated', false);
        localStorage.removeItem('user');
    }

    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getCurrentUser() {
        return appState.getState('user');
    }

    isAuthenticated() {
        return appState.getState('isAuthenticated');
    }
}

const auth = new AuthManager();
