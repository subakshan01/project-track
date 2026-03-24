import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile, updateProfile, getMyRequests } from '../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiBook, FiCode, FiAward, FiFolder, FiUser, FiSave } from 'react-icons/fi';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, reqRes] = await Promise.all([
        getStudentProfile(user.id),
        getMyRequests()
      ]);
      setProfile(profileRes.data.data);
      setRequests(reqRes.data.data);
      setFormData({
        name: profileRes.data.data.name || '',
        department: profileRes.data.data.department || '',
        year: profileRes.data.data.year || '',
        studentId: profileRes.data.data.studentId || '',
        rollNumber: profileRes.data.data.rollNumber || '',
        languages: profileRes.data.data.languages?.join(', ') || '',
        preferredRole: profileRes.data.data.preferredRole || '',
        bio: profileRes.data.data.bio || ''
      });
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        year: parseInt(formData.year) || undefined
      };
      const res = await updateProfile(data);
      setProfile({ ...profile, ...res.data.data });
      updateUser({ ...user, name: data.name, department: data.department });
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{profile?.name?.charAt(0) || user?.name?.charAt(0)}</div>
        <div className="profile-info">
          <h1>{profile?.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>{profile?.department} · Year {profile?.year}</p>
          <div className="profile-meta">
            <span><FiUser size={14} />ID: {profile?.studentId}</span>
            <span><FiBook size={14} />Roll: {profile?.rollNumber}</span>
            <span><FiCode size={14} />Preferred: {profile?.preferredRole || 'Not set'}</span>
            <span><FiAward size={14} />Best Fit: {profile?.bestFitRole || 'Not determined'}</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => setEditing(!editing)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <FiEdit2 /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="profile-section">
          <h2><FiEdit2 /> Edit Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select className="form-select" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input className="form-input" value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input className="form-input" value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input className="form-input" type="number" min="1" max="5" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Preferred Role</label>
              <input className="form-input" value={formData.preferredRole} onChange={e => setFormData({ ...formData, preferredRole: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Languages Known (comma separated)</label>
              <input className="form-input" value={formData.languages} onChange={e => setFormData({ ...formData, languages: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Bio</label>
              <textarea className="form-textarea" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSave}><FiSave /> Save Changes</button>
        </div>
      )}

      {/* Bio */}
      {profile?.bio && !editing && (
        <div className="profile-section">
          <h2>About</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{profile.bio}</p>
        </div>
      )}

      {/* Languages */}
      {profile?.languages?.length > 0 && (
        <div className="profile-section">
          <h2><FiCode /> Languages & Skills</h2>
          <div className="language-tags">
            {profile.languages.map((l, i) => <span key={i} className="language-tag">{l}</span>)}
          </div>
        </div>
      )}

      {/* Active Projects */}
      {profile?.projects?.length > 0 && (
        <div className="profile-section">
          <h2><FiFolder /> Current Projects</h2>
          {profile.projects.filter(p => !p.archived).map(p => (
            <div key={p._id} style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {p.members?.find(m => m.user === user.id || m.user?._id === user.id)?.role || 'Member'} · {p.department}
                  </div>
                </div>
                <span className={`badge ${p.status === 'Ongoing' ? 'badge-blue' : 'badge-yellow'}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archived Projects */}
      {profile?.archivedProjects?.length > 0 && (
        <div className="profile-section">
          <h2><FiAward /> Archived Projects Showcase</h2>
          {profile.archivedProjects.map(p => (
            <div key={p._id} style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', marginBottom: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '6px' }}>{p.name}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{p.description?.substring(0, 150)}...</p>
              {p.outcomes && <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>📋 {p.outcomes}</p>}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed: {new Date(p.archivedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Role Requests History */}
      {requests.length > 0 && (
        <div className="profile-section">
          <h2>My Role Requests</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {requests.map(r => (
              <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{r.role} – {r.project?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`badge ${r.status === 'approved' ? 'badge-green' : r.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
