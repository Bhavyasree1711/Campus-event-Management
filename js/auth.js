/**
 * Auth Module
 * Handles login, registration, and session management.
 */

const Auth = {
    init() {
        this.checkAuthStatus();
        this.bindEvents();
    },

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    },

    handleLogin(e) {
        e.preventDefault();
        const role = document.getElementById('roleSelect').value;
        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;

        // Show loading spinner on button
        const btn = document.getElementById('loginBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
        btn.disabled = true;

        setTimeout(() => {
            if (role === 'admin') {
                if (identifier === 'admin' && password === 'admin123') {
                    const adminUser = { role: 'admin', name: 'Administrator' };
                    Storage.setCurrentUser(adminUser);
                    window.location.href = 'admin-dashboard.html';
                } else {
                    this.showError('Invalid Admin Credentials.');
                    this.resetBtn(btn, originalText);
                }
            } else if (role === 'student') {
                // Dummy login - registers if not exists for simplicity in this demo
                const users = Storage.getUsers();
                let student = users.find(u => u.identifier === identifier);
                
                if (!student) {
                    student = { 
                        role: 'student', 
                        identifier: identifier,
                        password: password,
                        name: 'Student ' + identifier 
                    };
                    Storage.saveUser(student);
                }

                if (student.password === password) {
                    Storage.setCurrentUser(student);
                    window.location.href = 'student-dashboard.html';
                } else {
                    this.showError('Incorrect password for this student.');
                    this.resetBtn(btn, originalText);
                }
            }
        }, 800); // Simulate network delay
    },

    resetBtn(btn, text) {
        btn.innerHTML = text;
        btn.disabled = false;
    },

    showError(msg) {
        const errorAlert = document.getElementById('loginError');
        if (errorAlert) {
            errorAlert.textContent = msg;
            errorAlert.classList.remove('d-none');
        } else {
            alert(msg);
        }
    },

    logout() {
        Storage.logout();
        window.location.href = 'login.html';
    },

    checkAuthStatus() {
        const user = Storage.getCurrentUser();
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('login.html');
        const isIndex = currentPath.endsWith('/') || currentPath.endsWith('index.html');

        if (!user && !isAuthPage && !isIndex && !currentPath.includes('about.html') && !currentPath.includes('contact.html')) {
            window.location.href = 'login.html';
        }

        if (user && isAuthPage) {
            window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
        }

        this.updateNavbar(user);
    },

    updateNavbar(user) {
        const authLinks = document.getElementById('authLinks');
        const guestLinks = document.getElementById('guestLinks');
        const userNameDisplay = document.getElementById('userNameDisplay');

        if (user) {
            if (guestLinks) guestLinks.classList.add('d-none');
            if (authLinks) authLinks.classList.remove('d-none');
            if (userNameDisplay) userNameDisplay.textContent = `Hello, ${user.name}`;
            
            // Adjust dashboard link based on role
            const dashboardLink = document.getElementById('dashboardLink');
            if (dashboardLink) {
                dashboardLink.href = user.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
            }
        } else {
            if (guestLinks) guestLinks.classList.remove('d-none');
            if (authLinks) authLinks.classList.add('d-none');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    
    // Setup Theme Toggle globally
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = Storage.getTheme();
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
        
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            Storage.setTheme(isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
        });
    }
});
