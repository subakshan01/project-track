import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiBookOpen } from 'react-icons/fi';

const helpSections = [
  {
    title: '🔐 How to Login',
    content: `To access the TechTrack Student Portal, follow these steps:

1. Navigate to the login page at the application URL.
2. Enter your registered email address (e.g., your.name@student.edu).
3. Enter your password (minimum 6 characters).
4. Click "Sign In" to authenticate.

If you don't have an account, click "Register" to create one. You'll need to provide:
- Full name
- Email address
- Password
- Student ID (e.g., CS2024001)
- Roll Number (e.g., 21CS101)
- Department

After successful login, you'll receive a JWT token that keeps you authenticated for 7 days. You'll be automatically redirected to the Dashboard.`
  },
  {
    title: '📋 How to Browse & Request Project Roles',
    content: `Finding and applying for project roles is simple:

1. Go to the "Projects" page from the navigation bar.
2. Use the search bar to find projects by name or description.
3. Use filters to narrow down by:
   - Department (Computer Science, IT, Electronics, etc.)
   - Status (Not Started, Ongoing, Completed)
   - Level (Low, Medium, High)
4. Click on any project card to view its details.

In the project detail page:
- View all available vacancies and their required skills.
- Click "Request Role" on any open vacancy.
- Write a description of your relevant experience (minimum 20 characters).
- Submit your request.

Your request will be reviewed by the project's staff lead, who can approve or reject it. You'll receive a notification either way.`
  },
  {
    title: '👨‍🏫 How Staff Allocates Students',
    content: `The staff allocation workflow is as follows:

1. Staff members create projects with specific vacancy roles and required skills.
2. Students browse projects and request roles they're interested in.
3. When a student requests a role, the staff lead receives a notification.
4. The staff member reviews:
   - The student's profile (skills, experience, year)
   - Uploaded documents (resume, certificates, project proofs)
   - The student's experience description from the request
5. The staff can then:
   - Approve the request → Student is added to the project team
   - Reject the request → Student is notified with a reason
6. When a vacancy is filled, other pending requests for that vacancy are automatically rejected.
7. Staff can also update the project status (Not Started → Ongoing → Completed).`
  },
  {
    title: '🔔 Notification System',
    content: `TechTrack uses an in-website notification system (no email required):

You'll receive notifications for:
- ✅ Role request approved
- ❌ Role request rejected
- 📋 New project posted in any department
- 🔄 Project status updated (for projects you're a member of)
- 📄 Document verified or rejected by staff

How to use:
- Click the bell icon (🔔) in the navigation bar to see your notifications.
- Unread notifications are highlighted with a blue left border.
- The badge on the bell shows the count of unread notifications.
- Click "Mark all read" to clear unread status.
- Notifications are polled every 30 seconds for real-time updates.`
  },
  {
    title: '📄 Document Upload & Verification',
    content: `You can upload documents for staff verification:

Supported document types:
- Resume – Your latest CV/resume
- Certificate – Course completions, awards, certifications
- Project Proof – Evidence of past project work

How to upload:
1. Go to "Documents" from the navigation bar.
2. Click "Upload Document".
3. Enter a descriptive title.
4. Select the document type.
5. Choose your file (PDF, JPEG, PNG – max 5MB).
6. Click "Upload".

Verification statuses:
- ⏳ Pending – Awaiting staff review
- ✅ Verified – Staff has confirmed the document
- ❌ Rejected – Staff has rejected with a comment explaining why

Staff members can add comments to justify their verification decision.`
  },
  {
    title: '👤 Student Profile (LinkedIn-Style)',
    content: `Your profile showcases your professional identity:

Profile information includes:
- Student ID and Roll Number
- Department and Current Year
- Languages/Technologies known
- Preferred role
- Best-fit role (system-suggested based on approved role requests)
- Bio/About section

You can edit your profile by clicking the "Edit" button on the profile page.

Your profile also displays:
- Current active projects you're a member of
- Archived projects showcase (completed projects)
- Full history of your role requests with their status

The "Best Fit Role" is automatically calculated based on which roles you've been most frequently approved for across projects.`
  },
  {
    title: '💬 Project Discussion Thread',
    content: `Each project has a built-in discussion board:

Features:
- Post questions, doubts, or updates about the project
- Both students and staff can participate
- Messages are displayed in chronological order
- Each message shows the sender's name, role, and timestamp
- Messages support reply threading

How to use:
1. Navigate to any project's detail page.
2. Scroll to the "Discussion Thread" section.
3. Type your message in the input field.
4. Click the send button or press Enter.

This replaces the need for external chat tools – all project communication stays within TechTrack.`
  },
  {
    title: '📦 Project Archive & History',
    content: `When a project is marked as "Completed" by staff:

- It automatically moves to the Archive section.
- The project page shows outcomes and team summary.
- Students can view it from the "Archive" toggle on the Projects page.

Benefits of archived projects:
- They appear on your student profile as "Archived Projects Showcase"
- Each shows: project name, description, outcomes, and completion date
- This builds your portfolio for future internships and jobs

To view archived projects, go to the Projects page and click the "Archive" toggle button.`
  },
  {
    title: '🟢 Staff Availability',
    content: `Staff members can set their availability status:

- 🟢 Available – Open to new project discussions and role allocation
- 🟡 Busy – Currently occupied, may have delayed response
- 🔴 Not Interested – Not accepting new project responsibilities

This status is visible on:
- Staff directory page (staff cards)
- Staff detail/profile page
- Project detail page (next to the project lead info)

This helps students understand which staff members are currently able to mentor or guide projects.`
  }
];

function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FiBookOpen style={{ marginRight: '8px' }} />Help & SRS Module</h1>
        <p>Learn how to use every feature of the TechTrack platform</p>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>📘 Software Requirements Specification</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          TechTrack is a full-stack Project & Staffing Management System built with the MERN+MEAN stack.
          The backend uses Node.js, Express.js, and MongoDB with JWT authentication and role-based access control.
          The student frontend is built with React (this portal), while the staff/admin frontend uses Angular.
          Both frontends share the same REST API backend.
        </p>
      </div>

      {helpSections.map((section, i) => (
        <div key={i} className="help-section">
          <div className="help-question" onClick={() => toggle(i)}>
            <span>{section.title}</span>
            {openIndex === i ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {openIndex === i && (
            <div className="help-answer">
              {section.content.split('\n').map((line, j) => (
                <p key={j} style={{ marginBottom: line.trim() ? '4px' : '12px' }}>{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default HelpPage;
