# College Event Management System

A beginner-friendly, fully functional College Event Management web application built with HTML, CSS, Bootstrap 5, and Vanilla JavaScript. 

This project uses Browser Local Storage to persist data without requiring a backend server, making it extremely easy to run and deploy. It is designed to be clean, responsive, professional, and deployable on platforms like Vercel.

## Features

- **Role-based Access**: Separate dashboards for Admins and Students.
- **Admin Features**:
  - Create, manage, edit, and delete events.
  - View registrations for each event.
  - Export registrations to Excel (CSV).
  - Dashboard statistics (total events, total registrations).
- **Student Features**:
  - View upcoming events.
  - Search and filter events by category.
  - Register for events (with duplicate registration prevention).
  - Track registered events.
- **UI/UX**:
  - Modern Blue & White theme.
  - Dark mode toggle.
  - Toast notifications and loading states.
  - Fully responsive design for Mobile, Tablet, and Desktop.

## Folder Structure

```text
college-event-management/
│── index.html
│── login.html
│── student-dashboard.html
│── admin-dashboard.html
│── register.html
│── about.html
│── contact.html
│── css/
│      style.css
│── js/
│      auth.js
│      admin.js
│      student.js
│      storage.js
│      register.js
│      export.js
│── assets/
│── .gitignore
│── vercel.json
│── README.md
```

## How to Run Locally

1. Clone or download this repository.
2. Open the `index.html` file in any modern web browser.
3. No build tools or backend servers are required!

**Admin Login Credentials:**
- **Username**: admin
- **Password**: admin123

*Students can sign up and create their own accounts from the login page.*

## Deployment on Vercel

This project is configured for seamless deployment on Vercel.
1. Push the code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Vercel will automatically detect the `vercel.json` file and deploy the static site.

## Code Architecture

The JavaScript logic is modularized to ensure clean code:
- **`storage.js`**: Handles all interactions with Local Storage. This abstracts the data layer, making it easy to swap Local Storage with a real backend API (like Node.js or Firebase) in the future!
- **UI Logic**: Handled separately in respective files (`admin.js`, `student.js`, etc.).
