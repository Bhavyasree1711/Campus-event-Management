/**
 * Student Module
 * Handles displaying events, filtering, and showing student registrations.
 */

const Student = {
    init() {
        const user = Storage.getCurrentUser();
        if (!user || user.role !== 'student') {
            window.location.href = 'login.html';
            return;
        }

        this.renderEvents();
        this.renderMyRegistrations();
        this.bindEvents();
    },

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEvents());
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterEvents());
        }
    },

    renderEvents(filterText = '', filterCategory = 'All') {
        let events = Storage.getEvents();
        const container = document.getElementById('studentEventsList');
        if (!container) return;

        // Apply filters
        events = events.filter(e => {
            const matchesSearch = e.title.toLowerCase().includes(filterText.toLowerCase()) || 
                                  e.description.toLowerCase().includes(filterText.toLowerCase());
            const matchesCat = filterCategory === 'All' || e.category === filterCategory;
            return matchesSearch && matchesCat;
        });

        if (events.length === 0) {
            container.innerHTML = `
                <div class="col-12 empty-state">
                    <i class="bi bi-calendar-x fs-1 mb-3 d-block"></i>
                    <h4>No upcoming events</h4>
                    <p>Check back later or try adjusting your filters.</p>
                </div>
            `;
            return;
        }

        const user = Storage.getCurrentUser();

        container.innerHTML = events.map(event => {
            const registrations = Storage.getRegistrationsByEvent(event.id);
            const isFull = registrations.length >= event.maxParticipants;
            const isRegistered = Storage.hasStudentRegisteredForEvent(user.identifier, event.id);

            let actionButton = '';
            if (isRegistered) {
                actionButton = `<button class="btn btn-success w-100" disabled><i class="bi bi-check-circle me-1"></i> Registered</button>`;
            } else if (isFull) {
                actionButton = `<button class="btn btn-secondary w-100" disabled>Event Full</button>`;
            } else {
                actionButton = `<a href="register.html?eventId=${event.id}" class="btn btn-primary w-100 btn-animated fw-bold">Register Now</a>`;
            }

            return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${event.posterUrl}" class="card-img-top event-poster" alt="Poster" onerror="this.src='https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80'">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold mb-0">${event.title}</h5>
                            <span class="badge bg-primary rounded-pill">${event.category}</span>
                        </div>
                        <p class="card-text text-muted small mb-3 flex-grow-1">${event.description}</p>
                        
                        <ul class="list-unstyled small mb-4">
                            <li class="mb-2"><i class="bi bi-calendar-event me-2 text-primary"></i>${event.date} at ${event.time}</li>
                            <li class="mb-2"><i class="bi bi-geo-alt me-2 text-primary"></i>${event.venue}</li>
                            <li class="mb-2"><i class="bi bi-person-badge me-2 text-primary"></i>Coord: ${event.coordName || 'TBD'}</li>
                            <li><i class="bi bi-people me-2 text-primary"></i>${event.maxParticipants - registrations.length} Seats Available</li>
                        </ul>
                        
                        <div class="mt-auto">
                            ${actionButton}
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    },

    filterEvents() {
        const searchInput = document.getElementById('searchInput').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        this.renderEvents(searchInput, categoryFilter);
    },

    renderMyRegistrations() {
        const user = Storage.getCurrentUser();
        const container = document.getElementById('myRegistrationsList');
        if (!container) return;

        const myRegs = Storage.getRegistrationsByStudent(user.identifier);
        
        if (myRegs.length === 0) {
            container.innerHTML = `
                <div class="empty-state py-4">
                    <p class="mb-0">You haven't registered for any events yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = myRegs.map(reg => {
            const event = Storage.getEventById(reg.eventId);
            if (!event) return ''; // Skip deleted events

            return `
            <div class="card mb-3 shadow-sm border-0 border-start border-4 border-success">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="fw-bold mb-1">${event.title}</h6>
                            <p class="mb-0 small text-muted"><i class="bi bi-calendar-check me-1"></i> ${event.date} - ${event.venue}</p>
                        </div>
                        <span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill border border-success border-opacity-25">Confirmed</span>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Student.init();
});
