/**
 * Export Module
 * Handles exporting registration data to CSV for Excel.
 */

const Export = {
    toExcel() {
        const registrations = Storage.getRegistrations();
        if (registrations.length === 0) {
            alert('No registrations available to export.');
            return;
        }

        // CSV Header
        const headers = ['Student Name', 'Roll Number', 'Department', 'Year', 'Email', 'Phone', 'Event Name', 'Registration Date'];
        
        // CSV Rows
        const rows = registrations.map(reg => {
            const event = Storage.getEventById(reg.eventId);
            const eventName = event ? event.title : 'Deleted Event';
            
            return [
                `"${reg.name}"`,
                `"${reg.rollNumber}"`,
                `"${reg.department}"`,
                `"${reg.year}"`,
                `"${reg.email}"`,
                `"${reg.phone}"`,
                `"${eventName}"`,
                `"${new Date(reg.registrationDate).toLocaleDateString()}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Event_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
