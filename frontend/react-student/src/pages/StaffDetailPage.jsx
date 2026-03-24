import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStaffProfile } from '../services/api';
import { FiBriefcase, FiMapPin, FiPhone, FiLinkedin, FiMail, FiFolder } from 'react-icons/fi';

function StaffDetailPage() {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStaffProfile(id);
        setStaff(res.data.data);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!staff) return <div className="page-container"><div className="empty-state"><h3>Staff not found</h3></div></div>;

  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-avatar">{staff.name?.charAt(0)}</div>
        <div className="profile-info">
          <h1>{staff.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{staff.department}</p>
          <div style={{ marginTop: '8px' }}>
            <span className={`availability-badge ${staff.availability === 'Available' ? 'avail' : staff.availability === 'Busy' ? 'busy' : 'not-interested'}`}>
              <span className="availability-dot" />{staff.availability}
            </span>
          </div>
          <div className="profile-meta">
            {staff.yearsExperience && <span><FiBriefcase size={14} />{staff.yearsExperience} years experience</span>}
            {staff.cabinNumber && <span><FiMapPin size={14} />{staff.cabinNumber}, {staff.floor}</span>}
            {staff.contactNumber && <span><FiPhone size={14} />{staff.contactNumber}</span>}
            {staff.email && <span><FiMail size={14} />{staff.email}</span>}
          </div>
        </div>
      </div>

      {staff.bio && (
        <div className="profile-section">
          <h2>About</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{staff.bio}</p>
        </div>
      )}

      {staff.timeSlots && staff.timeSlots.length > 0 && (
        <div className="profile-section">
          <h2>🕐 Available Communication Times</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {staff.timeSlots.map((slot, i) => (
              <span key={i} className="skill-tag" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                {slot}
              </span>
            ))}
          </div>
        </div>
      )}

      {staff.linkedIn && (
        <div className="profile-section">
          <h2><FiLinkedin /> LinkedIn</h2>
          <a href={staff.linkedIn} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            View LinkedIn Profile →
          </a>
        </div>
      )}

      {staff.projects && staff.projects.length > 0 && (
        <div className="profile-section">
          <h2><FiFolder /> Projects Managed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {staff.projects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.department}</div>
                </div>
                <span className={`badge ${p.status === 'Ongoing' ? 'badge-blue' : p.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>
                  {p.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDetailPage;
