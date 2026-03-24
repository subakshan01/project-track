import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProject, requestRole, getMessages, postMessage } from '../services/api';
import toast from 'react-hot-toast';
import { FiSend, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { loadProject(); }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const res = await getProject(id);
      setProject(res.data.data);
      loadMessages();
    } catch { toast.error('Failed to load project'); }
    finally { setLoading(false); }
  };

  const loadMessages = async () => {
    try {
      const res = await getMessages(id);
      setMessages(res.data.data);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {}
  };

  const handleRequestRole = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestRole(id, { vacancyId: selectedVacancy._id, experienceDescription: experience });
      toast.success('Role request submitted!');
      setShowRequestModal(false);
      setExperience('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally { setSubmitting(false); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await postMessage(id, { message: newMessage });
      setNewMessage('');
      loadMessages();
    } catch { toast.error('Failed to send message'); }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!project) return <div className="page-container"><div className="empty-state"><h3>Project not found</h3></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <span className={`badge ${project.status === 'Ongoing' ? 'badge-blue' : project.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>{project.status}</span>
          <span className={`badge ${project.level === 'High' ? 'badge-red' : project.level === 'Medium' ? 'badge-yellow' : 'badge-teal'}`}>{project.level} Priority</span>
          {project.archived && <span className="badge badge-purple">Archived</span>}
        </div>
        <h1 style={{ WebkitTextFillColor: 'var(--text-primary)', background: 'none' }}>{project.name}</h1>
        <p>{project.department}</p>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          {/* Description */}
          <div className="detail-card">
            <h2>Description</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{project.description}</p>
          </div>

          {/* Vacancies */}
          <div className="detail-card">
            <h2>Vacancy Roles ({project.vacancies?.filter(v => !v.filled).length} open)</h2>
            <div className="vacancy-list">
              {project.vacancies?.map(v => (
                <div key={v._id} className="vacancy-item">
                  <div className="vacancy-info">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {v.role}
                      {v.filled ? <span className="badge badge-green" style={{ fontSize: '0.7rem' }}><FiCheckCircle size={10} /> Filled</span>
                        : <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Open</span>}
                    </h4>
                    <div className="vacancy-skills">
                      {v.requiredSkills?.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                  {!v.filled && !project.archived && (
                    <button className="btn btn-primary btn-sm"
                      onClick={() => { setSelectedVacancy(v); setShowRequestModal(true); }}>
                      Request Role
                    </button>
                  )}
                </div>
              ))}
              {(!project.vacancies || project.vacancies.length === 0) && (
                <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No vacancies listed</p>
              )}
            </div>
          </div>

          {/* Discussion Thread */}
          <div className="detail-card">
            <h2>Discussion Thread</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m._id} className={`chat-message ${m.user?._id === user?.id ? 'own' : ''}`}>
                      <div className="chat-avatar-sm">{m.user?.name?.charAt(0) || '?'}</div>
                      <div className="chat-bubble">
                        <div className="chat-user">{m.user?.name} · {m.user?.role}</div>
                        <div className="chat-text">{m.message}</div>
                        <div className="chat-time">{new Date(m.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..." />
                <button type="submit" className="btn btn-primary btn-sm"><FiSend /></button>
              </form>
            </div>
          </div>

          {/* Archived Outcomes */}
          {project.archived && project.outcomes && (
            <div className="detail-card">
              <h2>Project Outcomes</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{project.outcomes}</p>
              {project.teamSummary && (
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>{project.teamSummary}</p>
              )}
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          {/* Staff Lead */}
          {project.staff && (
            <div className="detail-card">
              <h2 style={{ fontSize: '1.1rem' }}>Project Lead</h2>
              <Link to={`/staff/${project.staff._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="staff-avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                    {project.staff.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{project.staff.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.staff.department}</div>
                    <span className={`availability-badge ${project.staff.availability === 'Available' ? 'avail' : project.staff.availability === 'Busy' ? 'busy' : 'not-interested'}`}>
                      <span className="availability-dot" />{project.staff.availability}
                    </span>
                    {project.staff.timeSlots && project.staff.timeSlots.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🕐 Available times:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {project.staff.timeSlots.map((slot, i) => (
                            <span key={i} className="skill-tag" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{slot}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Team Members */}
          <div className="detail-card">
            <h2 style={{ fontSize: '1.1rem' }}>Team ({project.members?.length}/{project.maxMembers})</h2>
            {project.members?.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--bg-elevated)' }}>
                <div className="chat-avatar-sm" style={{ background: 'var(--gradient-success)' }}>
                  {m.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{m.user?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.role}</div>
                </div>
              </div>
            ))}
            {(!project.members || project.members.length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No members yet</p>
            )}
          </div>

          {/* Project Info */}
          <div className="detail-card">
            <h2 style={{ fontSize: '1.1rem' }}>Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department</span>
                <span>{project.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Max Members</span>
                <span>{project.maxMembers}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Role Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Request Role: {selectedVacancy?.role}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Describe your experience and why you're a good fit for this role.
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Required Skills:</h4>
              <div className="vacancy-skills">
                {selectedVacancy?.requiredSkills?.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
              </div>
            </div>
            <form onSubmit={handleRequestRole}>
              <div className="form-group">
                <label>Experience Description</label>
                <textarea className="form-textarea" value={experience} onChange={e => setExperience(e.target.value)}
                  placeholder="Describe your relevant experience, projects, and skills..."
                  required minLength={20} rows={5} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
