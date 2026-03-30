class StateManager {
    constructor(initialState = {}) {
        this.observers = new Map();
        this.state = this.createReactiveState(initialState);
    }

    createReactiveState(target) {
        const self = this;
        
        return new Proxy(target, {
            set(obj, prop, value) {
                const oldValue = obj[prop];
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    obj[prop] = self.createReactiveState(value);
                } else {
                    obj[prop] = value;
                }
                
                if (oldValue !== value) {
                    self.notify(prop, value, oldValue);
                }
                
                return true;
            },
            
            deleteProperty(obj, prop) {
                const oldValue = obj[prop];
                delete obj[prop];
                self.notify(prop, undefined, oldValue);
                return true;
            }
        });
    }

    subscribe(key, callback) {
        if (!this.observers.has(key)) {
            this.observers.set(key, []);
        }
        this.observers.get(key).push(callback);
        
        return () => {
            const callbacks = this.observers.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    notify(key, newValue, oldValue) {
        if (this.observers.has(key)) {
            this.observers.get(key).forEach(callback => {
                callback(newValue, oldValue);
            });
        }
        
        if (this.observers.has('*')) {
            this.observers.get('*').forEach(callback => {
                callback(key, newValue, oldValue);
            });
        }
    }

    getState(key) {
        return key ? this.state[key] : this.state;
    }

    setState(key, value) {
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                this.state[k] = key[k];
            });
        } else {
            this.state[key] = value;
        }
    }

    clearState() {
        Object.keys(this.state).forEach(key => {
            delete this.state[key];
        });
    }
}

const appState = new StateManager({
    user: null,
    isAuthenticated: false,
    currentRoute: window.location.pathname,
    projects: [],
    currentProject: null,
    theme: 'light'
});

appState.subscribe('user', (newUser, oldUser) => {
    if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
    } else {
        localStorage.removeItem('user');
    }
});

appState.subscribe('isAuthenticated', (isAuth) => {
    if (!isAuth) {
        appState.setState('user', null);
        appState.setState('currentProject', null);
    }
});

window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            appState.setState('user', user);
            appState.setState('isAuthenticated', true);
        } catch (e) {
            localStorage.removeItem('user');
        }
    }
});
