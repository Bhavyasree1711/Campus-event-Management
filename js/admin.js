/**
 * Admin Module
 * Handles event creation, management, and dashboard statistics.
 */

const Admin = {
    init() {
        const user = Storage.getCurrentUser();
        if (!user || user.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }

        this.updateStats();
        this.renderEvents();
        this.bindEvents();
    },

    bindEvents() {
        const eventForm = document.getElementById('eventForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => this.handleCreateEvent(e));
        }
    },

    updateStats() {
        const events = Storage.getEvents();
        const registrations = Storage.getRegistrations();

        const totalEventsEl = document.getElementById('totalEvents');
        const totalRegEl = document.getElementById('totalRegistrations');
        
        if (totalEventsEl) totalEventsEl.textContent = events.length;
        if (totalRegEl) totalRegEl.textContent = registrations.length;
    },

    getDefaultImage(category) {
        // Images featuring actual students/people to make it feel like a real college event
        const images = {
            'Technical': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80', // Students collaborating at laptops
            'Cultural': 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=400&q=80', // Students at a cultural event
            'Sports': 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=400&q=80', // Students doing sports
            'Workshop': 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=400&q=80', // Students in a classroom
            'Seminar': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80'  // Students in a lecture hall
        };
        return images[category] || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80'; // Students walking on campus
    },

    getRandomCoordinator() {
        const names = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Mr. Brown', 'Ms. Davis', 'Dr. Miller', 'Prof. Wilson'];
        const depts = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomDept = depts[Math.floor(Math.random() * depts.length)];
        const randomPhone = '9' + Math.floor(Math.random() * 900000000 + 100000000); // random 10 digit Indian-style number starting with 9
        return { name: randomName, dept: randomDept, phone: randomPhone };
    },

    handleCreateEvent(e) {
        e.preventDefault();
        
        const eventId = document.getElementById('eventId').value;
        const category = document.getElementById('eventCategory').value;
        const userPoster = document.getElementById('eventPoster').value;
        
        const event = {
            id: eventId || null,
            title: document.getElementById('eventTitle').value,
            category: category,
            description: document.getElementById('eventDescription').value,
            venue: document.getElementById('eventVenue').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            maxParticipants: parseInt(document.getElementById('eventMax').value),
            posterUrl: userPoster ? userPoster : this.getDefaultImage(category),
            coordName: document.getElementById('eventCoordName').value,
            coordPhone: document.getElementById('eventCoordPhone').value,
            coordDept: document.getElementById('eventCoordDept').value
        };

        Storage.saveEvent(event);
        
        // Reset form and modal
        e.target.reset();
        document.getElementById('eventId').value = '';
        
        // Hide Modal (using Bootstrap API)
        const modalEl = document.getElementById('createEventModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        // Show Toast
        this.showToast('Success!', `Event "${event.title}" saved successfully.`);
        
        this.updateStats();
        this.renderEvents();
    },

    renderEvents() {
        const events = Storage.getEvents();
        const container = document.getElementById('adminEventsList');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `
                <div class="col-12 empty-state">
                    <i class="bi bi-calendar-x fs-1 mb-3 d-block"></i>
                    <h4>No events found</h4>
                    <p>Click "Create Event" to add your first event.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${event.posterUrl}" class="card-img-top event-poster" alt="Event Poster" onerror="this.src='https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80'">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold mb-0">${event.title}</h5>
                            <span class="badge bg-primary rounded-pill">${event.category}</span>
                        </div>
                        <p class="card-text text-muted small mb-3">
                            <i class="bi bi-calendar-event me-1"></i> ${event.date} at ${event.time}<br>
                            <i class="bi bi-geo-alt me-1"></i> ${event.venue}
                        </p>
                        
                        <div class="mt-auto d-flex justify-content-between border-top pt-3">
                            <span class="text-success fw-bold small">
                                <i class="bi bi-people-fill me-1"></i> 
                                ${Storage.getRegistrationsByEvent(event.id).length} / ${event.maxParticipants}
                            </span>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary" onclick="Admin.editEvent('${event.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-outline-danger" onclick="Admin.deleteEvent('${event.id}')" title="Delete"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    resetForm() {
        document.getElementById('eventForm').reset();
        document.getElementById('eventId').value = '';
        
        // Auto-fill random coordinator details for convenience
        const randCoord = this.getRandomCoordinator();
        document.getElementById('eventCoordName').value = randCoord.name;
        document.getElementById('eventCoordPhone').value = randCoord.phone;
        document.getElementById('eventCoordDept').value = randCoord.dept;
    },

    editEvent(id) {
        const event = Storage.getEventById(id);
        if (!event) return;

        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventVenue').value = event.venue;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventMax').value = event.maxParticipants;
        
        const isDefaultImage = event.posterUrl && (event.posterUrl.includes('images.unsplash.com') || event.posterUrl.includes('via.placeholder.com'));
        document.getElementById('eventPoster').value = isDefaultImage ? '' : event.posterUrl;

        // Load coordinator details or generate random ones if they don't exist yet (for older events)
        document.getElementById('eventCoordName').value = event.coordName || this.getRandomCoordinator().name;
        document.getElementById('eventCoordPhone').value = event.coordPhone || this.getRandomCoordinator().phone;
        document.getElementById('eventCoordDept').value = event.coordDept || this.getRandomCoordinator().dept;

        const modal = new bootstrap.Modal(document.getElementById('createEventModal'));
        modal.show();
    },

    deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event? All associated registrations will also be deleted.')) {
            Storage.deleteEvent(id);
            this.showToast('Deleted', 'Event deleted successfully.', 'danger');
            this.updateStats();
            this.renderEvents();
        }
    },

    showToast(title, message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastId = 'toast' + Date.now();
        const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger';
        
        const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <i class="bi ${icon} me-2"></i>
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
        
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});
