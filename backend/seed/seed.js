const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('../models/User');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const ChatMessage = require('../models/ChatMessage');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Notification.deleteMany({});
    await ChatMessage.deleteMany({});
    console.log('Cleared existing data');

    // Create Staff Members
    const staffData = [
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@techtrack.edu',
        password: 'staff123',
        role: 'staff',
        department: 'Computer Science',
        cabinNumber: 'CS-201',
        floor: '2nd Floor',
        yearsExperience: 12,
        linkedIn: 'https://linkedin.com/in/priya-sharma',
        contactNumber: '+91-9876543210',
        availability: 'Available',
        photo: '',
        bio: 'Professor of Computer Science specializing in AI and Machine Learning'
      },
      {
        name: 'Prof. Rahul Verma',
        email: 'rahul.verma@techtrack.edu',
        password: 'staff123',
        role: 'staff',
        department: 'Information Technology',
        cabinNumber: 'IT-105',
        floor: '1st Floor',
        yearsExperience: 8,
        linkedIn: 'https://linkedin.com/in/rahul-verma',
        contactNumber: '+91-9876543211',
        availability: 'Busy',
        photo: '',
        bio: 'Associate Professor focused on Web Technologies and Cloud Computing'
      },
      {
        name: 'Dr. Anita Desai',
        email: 'anita.desai@techtrack.edu',
        password: 'staff123',
        role: 'staff',
        department: 'Electronics',
        cabinNumber: 'EC-302',
        floor: '3rd Floor',
        yearsExperience: 15,
        linkedIn: 'https://linkedin.com/in/anita-desai',
        contactNumber: '+91-9876543212',
        availability: 'Available',
        photo: '',
        bio: 'Head of Electronics Department with expertise in IoT and Embedded Systems'
      }
    ];

    const staff = await User.create(staffData);
    console.log(`Created ${staff.length} staff members`);

    // Create Students
    const studentData = [
      {
        name: 'Arjun Patel',
        email: 'arjun.patel@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2024001',
        rollNumber: '21CS101',
        year: 3,
        languages: ['JavaScript', 'Python', 'Java', 'C++'],
        preferredRole: 'Full Stack Developer',
        photo: '',
        bio: 'Passionate about web development and open source'
      },
      {
        name: 'Meera Krishnan',
        email: 'meera.k@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2024002',
        rollNumber: '21CS102',
        year: 3,
        languages: ['Python', 'R', 'SQL', 'TensorFlow'],
        preferredRole: 'Data Scientist',
        photo: '',
        bio: 'AI/ML enthusiast, Kaggle competitor'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.s@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Information Technology',
        studentId: 'IT2024001',
        rollNumber: '21IT201',
        year: 2,
        languages: ['JavaScript', 'TypeScript', 'React', 'Angular'],
        preferredRole: 'Frontend Developer',
        photo: '',
        bio: 'UI/UX design lover and frontend specialist'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.r@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Electronics',
        studentId: 'EC2024001',
        rollNumber: '21EC301',
        year: 4,
        languages: ['C', 'Python', 'MATLAB', 'Verilog'],
        preferredRole: 'IoT Developer',
        photo: '',
        bio: 'Embedded systems and IoT enthusiast'
      },
      {
        name: 'Karan Mehta',
        email: 'karan.m@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2024003',
        rollNumber: '21CS103',
        year: 2,
        languages: ['Java', 'Kotlin', 'Firebase', 'Android'],
        preferredRole: 'Mobile Developer',
        photo: '',
        bio: 'Android development and mobile-first applications'
      }
    ];

    const students = await User.create(studentData);
    console.log(`Created ${students.length} students`);

    // Create Projects
    const projectData = [
      {
        name: 'Smart Campus Navigation System',
        description: 'Build an AI-powered indoor navigation system for the campus using BLE beacons and machine learning algorithms for optimal path finding. The system will provide real-time directions to classrooms, labs, and facilities.',
        department: 'Computer Science',
        maxMembers: 5,
        status: 'Ongoing',
        level: 'High',
        staff: staff[0]._id,
        vacancies: [
          { role: 'Backend Developer', requiredSkills: ['Node.js', 'MongoDB', 'REST APIs'] },
          { role: 'ML Engineer', requiredSkills: ['Python', 'TensorFlow', 'Computer Vision'] },
          { role: 'Mobile Developer', requiredSkills: ['React Native', 'Kotlin', 'BLE'] },
          { role: 'UI/UX Designer', requiredSkills: ['Figma', 'CSS', 'User Research'] }
        ],
        members: [
          { user: students[0]._id, role: 'Team Lead' }
        ]
      },
      {
        name: 'E-Waste Management Portal',
        description: 'A web platform for tracking and managing electronic waste within the campus and local community. Features recycling guides, pickup scheduling, and impact tracking dashboards.',
        department: 'Information Technology',
        maxMembers: 4,
        status: 'Not Started',
        level: 'Medium',
        staff: staff[1]._id,
        vacancies: [
          { role: 'Full Stack Developer', requiredSkills: ['React', 'Node.js', 'PostgreSQL'] },
          { role: 'Frontend Developer', requiredSkills: ['Angular', 'TypeScript', 'Material UI'] },
          { role: 'DevOps Engineer', requiredSkills: ['Docker', 'AWS', 'CI/CD'] },
          { role: 'Data Analyst', requiredSkills: ['Python', 'Pandas', 'Visualization'] }
        ],
        members: []
      },
      {
        name: 'IoT-Based Smart Farming System',
        description: 'Design and implement an IoT system for monitoring soil moisture, temperature, and crop health using sensors. Includes a web dashboard for farmers with predictive analytics.',
        department: 'Electronics',
        maxMembers: 4,
        status: 'Ongoing',
        level: 'High',
        staff: staff[2]._id,
        vacancies: [
          { role: 'IoT Developer', requiredSkills: ['Arduino', 'Raspberry Pi', 'MQTT'] },
          { role: 'Backend Developer', requiredSkills: ['Python', 'Flask', 'InfluxDB'] }
        ],
        members: [
          { user: students[3]._id, role: 'Hardware Lead' },
          { user: students[1]._id, role: 'Data Analyst' }
        ]
      },
      {
        name: 'College Event Management System',
        description: 'A comprehensive platform for managing college events, workshops, and hackathons. Features event registration, QR-based attendance, certificate generation, and analytics.',
        department: 'Computer Science',
        maxMembers: 6,
        status: 'Completed',
        level: 'Low',
        staff: staff[0]._id,
        vacancies: [
          { role: 'Frontend Developer', requiredSkills: ['React', 'CSS', 'Redux'], filled: true, assignedTo: students[2]._id },
          { role: 'Backend Developer', requiredSkills: ['Express', 'MongoDB', 'JWT'], filled: true, assignedTo: students[0]._id }
        ],
        members: [
          { user: students[0]._id, role: 'Backend Developer' },
          { user: students[2]._id, role: 'Frontend Developer' },
          { user: students[4]._id, role: 'Mobile Developer' }
        ],
        archived: true,
        archivedAt: new Date('2025-12-15'),
        outcomes: 'Successfully deployed for college tech fest. 500+ registrations processed. Won Best Student Project award.',
        teamSummary: 'Team of 3 students delivered a full-stack event management solution with mobile app.'
      }
    ];

    const projects = await Project.create(projectData);
    console.log(`Created ${projects.length} projects`);

    // Create sample notifications
    const notificationData = [
      {
        user: students[0]._id,
        type: 'new_project',
        title: 'New Project Posted',
        message: 'E-Waste Management Portal has been posted in Information Technology',
        project: projects[1]._id,
        link: `/projects/${projects[1]._id}`
      },
      {
        user: students[0]._id,
        type: 'role_approved',
        title: 'Role Approved!',
        message: 'Your request for "Team Lead" in Smart Campus Navigation has been approved!',
        project: projects[0]._id,
        read: true
      },
      {
        user: students[2]._id,
        type: 'project_status_updated',
        title: 'Project Completed',
        message: 'College Event Management System has been marked as Completed',
        project: projects[3]._id
      }
    ];

    await Notification.create(notificationData);
    console.log('Created sample notifications');

    // Create sample chat messages
    const chatData = [
      {
        project: projects[0]._id,
        user: staff[0]._id,
        message: 'Welcome to the Smart Campus Navigation project! Let\'s discuss the architecture decisions this week.'
      },
      {
        project: projects[0]._id,
        user: students[0]._id,
        message: 'Thank you, Dr. Sharma! I\'ve prepared a draft architecture document. Should I share it here?'
      },
      {
        project: projects[0]._id,
        user: staff[0]._id,
        message: 'Yes please! Also, let\'s schedule a meeting for Wednesday to discuss the BLE beacon placement strategy.'
      }
    ];

    await ChatMessage.create(chatData);
    console.log('Created sample chat messages');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('─────────────────────────────────────────');
    console.log('Staff Accounts (password: staff123):');
    console.log('  • priya.sharma@techtrack.edu');
    console.log('  • rahul.verma@techtrack.edu');
    console.log('  • anita.desai@techtrack.edu');
    console.log('\nStudent Accounts (password: student123):');
    console.log('  • arjun.patel@student.edu');
    console.log('  • meera.k@student.edu');
    console.log('  • vikram.s@student.edu');
    console.log('  • sneha.r@student.edu');
    console.log('  • karan.m@student.edu');
    console.log('─────────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
