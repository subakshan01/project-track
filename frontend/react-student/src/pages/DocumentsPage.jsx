import { useState, useEffect } from 'react';
import { uploadDocument, getMyDocuments } from '../services/api';
import toast from 'react-hot-toast';
import { FiUpload, FiFile, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', type: 'resume', file: null });

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = async () => {
    try {
      const res = await getMyDocuments();
      setDocuments(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) { toast.error('Please select a file'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('type', uploadForm.type);
      await uploadDocument(formData);
      toast.success('Document uploaded successfully!');
      setShowUpload(false);
      setUploadForm({ title: '', type: 'resume', file: null });
      loadDocs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'verified': return <FiCheckCircle color="var(--accent-green)" />;
      case 'rejected': return <FiXCircle color="var(--accent-red)" />;
      default: return <FiClock color="var(--accent-yellow)" />;
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Documents</h1>
          <p>Upload and manage your resume, certificates, and project proofs</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}><FiUpload /> Upload Document</button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Upload Document</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Document Title</label>
                <input className="form-input" value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g., AWS Certification 2024" required />
              </div>
              <div className="form-group">
                <label>Document Type</label>
                <select className="form-select" value={uploadForm.type}
                  onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}>
                  <option value="resume">Resume</option>
                  <option value="certificate">Certificate</option>
                  <option value="project_proof">Project Proof</option>
                </select>
              </div>
              <div className="form-group">
                <label>File (PDF, JPEG, PNG – max 5MB)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  style={{ color: 'var(--text-secondary)', padding: '8px' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document List */}
      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <FiFile size={48} />
          <h3>No documents uploaded</h3>
          <p>Upload your resume, certificates, or project proofs for verification</p>
        </div>
      ) : (
        <div className="detail-card">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Size</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(d => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 500 }}><FiFile style={{ marginRight: '6px' }} />{d.title}</td>
                  <td><span className="badge badge-blue">{d.type.replace('_', ' ')}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatSize(d.fileSize)}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {statusIcon(d.verificationStatus)}
                      <span className={`badge ${d.verificationStatus === 'verified' ? 'badge-green' : d.verificationStatus === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                        {d.verificationStatus}
                      </span>
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '200px' }}>
                    {d.staffComment || '-'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;
