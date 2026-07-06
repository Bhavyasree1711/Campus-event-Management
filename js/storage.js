/**
 * Storage Module
 * Handles all interactions with Browser Local Storage.
 * Designed this way so it can be easily replaced with API calls later.
 */

const Storage = {
    keys: {
        STUDENTS: 'students',
        EVENTS: 'events',
        REGISTRATIONS: 'registrations',
        CURRENT_USER: 'currentUser',
        THEME: 'theme'
    },

    // --- GENERIC HELPERS ---
    
    _get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    _set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // --- AUTHENTICATION & USERS ---
    
    getUsers() {
        return this._get(this.keys.STUDENTS) || [];
    },

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        this._set(this.keys.STUDENTS, users);
    },

    getCurrentUser() {
        return this._get(this.keys.CURRENT_USER);
    },

    setCurrentUser(user) {
        this._set(this.keys.CURRENT_USER, user);
    },

    logout() {
        localStorage.removeItem(this.keys.CURRENT_USER);
    },

    // --- EVENTS ---
    
    getEvents() {
        return this._get(this.keys.EVENTS) || [];
    },

    getEventById(id) {
        const events = this.getEvents();
        return events.find(e => e.id === id);
    },

    saveEvent(event) {
        const events = this.getEvents();
        
        if (!event.id) {
            // Create new event
            event.id = Date.now().toString();
            event.createdAt = new Date().toISOString();
            events.push(event);
        } else {
            // Update existing event
            const index = events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                events[index] = { ...events[index], ...event };
            }
        }
        
        this._set(this.keys.EVENTS, events);
        return event;
    },

    deleteEvent(id) {
        let events = this.getEvents();
        events = events.filter(e => e.id !== id);
        this._set(this.keys.EVENTS, events);
        
        // Also delete associated registrations
        let registrations = this.getRegistrations();
        registrations = registrations.filter(r => r.eventId !== id);
        this._set(this.keys.REGISTRATIONS, registrations);
    },

    // --- REGISTRATIONS ---
    
    getRegistrations() {
        return this._get(this.keys.REGISTRATIONS) || [];
    },

    getRegistrationsByEvent(eventId) {
        return this.getRegistrations().filter(r => r.eventId === eventId);
    },

    getRegistrationsByStudent(rollNumber) {
        return this.getRegistrations().filter(r => r.rollNumber === rollNumber);
    },

    hasStudentRegisteredForEvent(rollNumber, eventId) {
        const registrations = this.getRegistrations();
        return registrations.some(r => r.rollNumber === rollNumber && r.eventId === eventId);
    },

    saveRegistration(registration) {
        const registrations = this.getRegistrations();
        registration.id = Date.now().toString();
        registration.registrationDate = new Date().toISOString();
        registrations.push(registration);
        this._set(this.keys.REGISTRATIONS, registrations);
        return registration;
    },

    // --- THEME ---
    
    getTheme() {
        return localStorage.getItem(this.keys.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(this.keys.THEME, theme);
    }
};
