document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = auth.getCurrentUser();
    
    if (user) {
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');
        
        if (userNameEl) userNameEl.textContent = user.name;
        if (userRoleEl) userRoleEl.textContent = user.role || 'Developer';
        if (userAvatarEl) {
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            userAvatarEl.textContent = initials;
        }
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                auth.logout();
                window.location.href = 'index.html';
            }
        });
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const page = item.dataset.page;
            updatePageContent(page);
        });
    });
    
    const newProjectBtn = document.getElementById('newProjectBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            showComingSoon('New Project feature is coming soon!');
        });
    }
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showComingSoon('Project creation wizard is coming soon!');
        });
    }
    
    function updatePageContent(page) {
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        
        const pages = {
            overview: {
                title: 'Overview',
                subtitle: "Welcome back! Here's what's happening with your projects."
            },
            projects: {
                title: 'Projects',
                subtitle: 'Manage all your agile projects in one place.'
            },
            wheel: {
                title: 'Agile Wheel',
                subtitle: 'Navigate through your agile development lifecycle.'
            },
            team: {
                title: 'Team',
                subtitle: 'Collaborate with your team members.'
            },
            settings: {
                title: 'Settings',
                subtitle: 'Manage your account and preferences.'
            }
        };
        
        if (pages[page]) {
            pageTitle.textContent = pages[page].title;
            pageSubtitle.textContent = pages[page].subtitle;
        }
    }
    
    function showComingSoon(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
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
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
