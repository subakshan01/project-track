import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, getMyRequests } from '../services/api';
import { FiFolder, FiCheckCircle, FiClock, FiTrendingUp, FiCalendar, FiAward, FiCode } from 'react-icons/fi';

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, ongoing: 0, myRequests: 0, completed: 0 });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [projRes, reqRes] = await Promise.all([
        getProjects(),
        getMyRequests()
      ]);
      const projects = projRes.data.data;
      setRecentProjects(projects.slice(0, 4));
      setStats({
        total: projects.length,
        ongoing: projects.filter(p => p.status === 'Ongoing').length,
        completed: projects.filter(p => p.status === 'Completed').length,
        myRequests: reqRes.data.count
      });
    } catch {}
  };

  const events = [
    { title: 'HackVerse 2026', desc: 'National level 48-hour hackathon with prizes worth ₹5 Lakhs', date: 'April 15-17, 2026', type: 'Hackathon' },
    { title: 'Inter-College Tech Summit', desc: 'Annual tech summit with 20+ colleges participating', date: 'May 5, 2026', type: 'Inter-College' },
    { title: 'AI/ML Workshop Series', desc: 'Department workshop on practical machine learning with TensorFlow', date: 'April 3-5, 2026', type: 'Workshop' },
    { title: 'Code Sprint Challenge', desc: 'Competitive programming contest – DSA and problem solving', date: 'April 20, 2026', type: 'Department' },
    { title: 'IoT Innovation Expo', desc: 'Electronics department exhibition of IoT & embedded projects', date: 'May 12, 2026', type: 'Department' },
    { title: 'Web Dev Bootcamp', desc: 'Full-stack bootcamp covering MERN/MEAN stack in 3 days', date: 'April 25-27, 2026', type: 'Workshop' }
  ];

  const features = [
    { icon: <FiFolder />, title: 'Project Discovery', desc: 'Browse and apply to real-world projects across departments' },
    { icon: <FiCheckCircle />, title: 'Skill Verification', desc: 'Upload certificates and get staff-verified credentials' },
    { icon: <FiClock />, title: 'Role Allocation', desc: 'Request roles and get notified on approval/rejection' },
    { icon: <FiTrendingUp />, title: 'Portfolio Building', desc: 'Showcase archived projects on your LinkedIn-style profile' }
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ marginBottom: '1rem' }}>
          TechTrack is your college's project management and staffing platform. Discover projects,
          collaborate with peers, get your skills verified, and build your portfolio.
        </p>
        <Link to="/projects" className="btn btn-primary">
          <FiFolder /> Browse Projects
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.ongoing}</div>
          <div className="stat-label">Ongoing</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.myRequests}</div>
          <div className="stat-label">My Requests</div>
        </div>
      </div>

      {/* Platform Features */}
      <h2 className="section-title"><FiCode /> Platform Features</h2>
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        {features.map((f, i) => (
          <div key={i} className="card" style={{ cursor: 'default' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <>
          <h2 className="section-title"><FiFolder /> Recent Projects</h2>
          <div className="card-grid" style={{ marginBottom: '2rem' }}>
            {recentProjects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card project-card">
                  <div className="project-card-header">
                    <span className={`badge ${p.status === 'Ongoing' ? 'badge-blue' : p.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>
                      {p.status}
                    </span>
                    <span className={`badge ${p.level === 'High' ? 'badge-red' : p.level === 'Medium' ? 'badge-yellow' : 'badge-teal'}`}>
                      {p.level}
                    </span>
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.description?.substring(0, 100)}...</p>
                  <div className="project-meta">
                    <span className="project-meta-item">👥 {p.memberCount}/{p.maxMembers} members</span>
                    <span className="project-meta-item">📂 {p.department}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Events */}
      <h2 className="section-title"><FiCalendar /> Hackathons & Events</h2>
      <div className="event-list" style={{ marginBottom: '2rem' }}>
        {events.map((e, i) => (
          <div key={i} className="event-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h4>{e.title}</h4>
              <span className={`badge ${e.type === 'Hackathon' ? 'badge-purple' : e.type === 'Inter-College' ? 'badge-blue' : e.type === 'Workshop' ? 'badge-teal' : 'badge-yellow'}`}>
                {e.type}
              </span>
            </div>
            <p>{e.desc}</p>
            <span className="event-date"><FiCalendar size={12} /> {e.date}</span>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="detail-card">
        <h2><FiAward style={{ marginRight: '8px' }} />About TechTrack</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          TechTrack is a comprehensive project management and staffing platform designed for educational
          institutions. It bridges the gap between students looking for project experience and staff
          members managing departmental projects. The platform enables skill verification through
          document uploads, facilitates role-based collaboration through project discussion threads,
          and helps students build a professional portfolio by showcasing their archived project work.
          With features like real-time notifications, staff availability tracking, and intelligent
          role suggestions, TechTrack streamlines the entire project lifecycle from proposal to completion.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
