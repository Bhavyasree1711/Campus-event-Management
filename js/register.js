/**
 * Registration Module
 * Handles event registration logic for students.
 */

const Register = {
    eventId: null,
    eventDetails: null,

    init() {
        const user = Storage.getCurrentUser();
        if (!user || user.role !== 'student') {
            window.location.href = 'login.html';
            return;
        }

        // Get Event ID from URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.eventId = urlParams.get('eventId');
        
        if (!this.eventId) {
            window.location.href = 'student-dashboard.html';
            return;
        }

        this.eventDetails = Storage.getEventById(this.eventId);
        if (!this.eventDetails) {
            alert('Event not found or has been deleted.');
            window.location.href = 'student-dashboard.html';
            return;
        }

        this.populateEventDetails();
        this.prefillStudentData(user);
        this.bindEvents();
    },

    bindEvents() {
        const regForm = document.getElementById('registrationForm');
        if (regForm) {
            regForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }
    },

    populateEventDetails() {
        document.getElementById('displayEventTitle').textContent = this.eventDetails.title;
        document.getElementById('displayEventDate').textContent = `${this.eventDetails.date} at ${this.eventDetails.time}`;
        document.getElementById('displayEventVenue').textContent = this.eventDetails.venue;
        
        // Coordinator Details
        document.getElementById('displayCoordName').textContent = this.eventDetails.coordName || 'TBD';
        document.getElementById('displayCoordDept').textContent = this.eventDetails.coordDept || 'TBD';
        document.getElementById('displayCoordPhone').textContent = this.eventDetails.coordPhone || 'TBD';
        
        const phoneLink = document.getElementById('displayCoordPhoneLink');
        if (phoneLink && this.eventDetails.coordPhone) {
            phoneLink.href = `tel:${this.eventDetails.coordPhone}`;
        }

        const poster = document.getElementById('displayEventPoster');
        if (poster) {
            poster.src = this.eventDetails.posterUrl;
        }
    },

    prefillStudentData(user) {
        document.getElementById('regRollNumber').value = user.identifier;
        if (user.name && user.name !== 'Student ' + user.identifier) {
            document.getElementById('regName').value = user.name;
        }
    },

    handleRegistration(e) {
        e.preventDefault();

        const rollNumber = document.getElementById('regRollNumber').value.trim();
        const name = document.getElementById('regName').value.trim();
        const department = document.getElementById('regDepartment').value.trim();
        const year = document.getElementById('regYear').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();

        // 1. Validate Form (HTML5 handles most of it, we just double check phone/email format ideally)
        if (!rollNumber || !name || !email || !phone) {
            alert('Please fill all required fields.');
            return;
        }

        // 2. Prevent Duplicate Registration
        if (Storage.hasStudentRegisteredForEvent(rollNumber, this.eventId)) {
            this.showError('You are already registered for this event!');
            return;
        }

        // 3. Check Capacity
        const currentRegistrations = Storage.getRegistrationsByEvent(this.eventId);
        if (currentRegistrations.length >= this.eventDetails.maxParticipants) {
            this.showError('Sorry, this event is full!');
            return;
        }

        // 4. Save Registration
        const registrationData = {
            eventId: this.eventId,
            rollNumber,
            name,
            department,
            year,
            email,
            phone
        };

        Storage.saveRegistration(registrationData);

        // Update User Name if it was a default name
        const user = Storage.getCurrentUser();
        if (user.name === 'Student ' + user.identifier) {
            user.name = name;
            Storage.setCurrentUser(user);
            // Also update in users array
            let users = Storage.getUsers();
            let index = users.findIndex(u => u.identifier === user.identifier);
            if(index !== -1) {
                users[index].name = name;
                Storage._set(Storage.keys.STUDENTS, users);
            }
        }

        // 5. Show Success
        this.showSuccess();
    },

    showError(msg) {
        const errorAlert = document.getElementById('regError');
        if (errorAlert) {
            errorAlert.textContent = msg;
            errorAlert.classList.remove('d-none');
        } else {
            alert(msg);
        }
    },

    showSuccess() {
        const form = document.getElementById('registrationForm');
        const successCard = document.getElementById('successCard');
        
        form.classList.add('d-none');
        successCard.classList.remove('d-none');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Register.init();
});
