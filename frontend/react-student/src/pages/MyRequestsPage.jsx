import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRequests } from '../services/api';
import { FiClock, FiCheckCircle, FiXCircle, FiFolder } from 'react-icons/fi';

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const filtered = filter ? requests.filter(r => r.status === filter) : requests;

  const statusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheckCircle style={{ color: 'var(--accent-green)' }} />;
      case 'rejected': return <FiXCircle style={{ color: 'var(--accent-red)' }} />;
      default: return <FiClock style={{ color: 'var(--accent-yellow)' }} />;
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'approved': return 'badge-green';
      case 'rejected': return 'badge-red';
      default: return 'badge-yellow';
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Role Requests</h1>
        <p>Track the status of your project role applications</p>
      </div>

      <div className="filter-bar">
        <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('')}>All ({requests.length})</button>
        <button className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('pending')}>
          <FiClock size={14} /> Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button className={`btn btn-sm ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('approved')}>
          <FiCheckCircle size={14} /> Approved ({requests.filter(r => r.status === 'approved').length})
        </button>
        <button className={`btn btn-sm ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('rejected')}>
          <FiXCircle size={14} /> Rejected ({requests.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <FiFolder size={48} />
          <h3>No requests {filter ? `with status "${filter}"` : 'yet'}</h3>
          <p>{filter ? 'Try a different filter' : 'Browse projects and apply for a role to get started'}</p>
          {!filter && <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Projects</Link>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(req => (
            <div key={req._id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {statusIcon(req.status)}
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{req.role}</h3>
                  </div>
                  {req.project && (
                    <Link to={`/projects/${req.project._id}`}
                      style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', textDecoration: 'none' }}>
                      <FiFolder size={12} style={{ marginRight: '4px' }} />{req.project.name}
                    </Link>
                  )}
                </div>
                <span className={`badge ${statusBadge(req.status)}`} style={{ textTransform: 'capitalize' }}>
                  {req.status}
                </span>
              </div>

              {req.experienceDescription && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.6 }}>
                  {req.experienceDescription}
                </p>
              )}

              {req.reviewComment && (
                <div style={{
                  padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${req.status === 'approved' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                  fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px'
                }}>
                  <strong>Review:</strong> {req.reviewComment}
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
                {req.project && <span>📂 {req.project.department}</span>}
                {req.project && <span className={`badge ${req.project.status === 'Ongoing' ? 'badge-blue' : req.project.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}
                  style={{ fontSize: '0.7rem' }}>{req.project.status}</span>}
                <span>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequestsPage;
