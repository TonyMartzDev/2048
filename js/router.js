class Router {
    constructor() {
        this.routes = new Map();
        this.beforeEach = null;
        
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });
    }

    addRoute(path, handler, requiresAuth = false) {
        this.routes.set(path, { handler, requiresAuth });
    }

    navigate(path, pushState = true) {
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        this.handleRoute(path);
    }

    handleRoute(path) {
        if (this.beforeEach) {
            const result = this.beforeEach(path);
            if (result === false) return;
            if (typeof result === 'string') {
                path = result;
            }
        }

        const route = this.routes.get(path);
        
        if (route) {
            if (route.requiresAuth && !appState.getState('isAuthenticated')) {
                this.navigate('/login.html', true);
                return;
            }
            route.handler();
        } else {
            this.navigate('/', true);
        }
        
        appState.setState('currentRoute', path);
    }

    setBeforeEach(callback) {
        this.beforeEach = callback;
    }
}

const router = new Router();
