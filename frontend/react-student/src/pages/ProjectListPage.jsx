import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/api';
import { FiSearch, FiUsers, FiFolder, FiFilter } from 'react-icons/fi';

function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', department: '', status: '', level: '', archived: false });

  useEffect(() => { loadProjects(); }, [filters.department, filters.status, filters.level, filters.archived]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.status) params.status = filters.status;
      if (filters.level) params.level = filters.level;
      if (filters.archived) params.archived = 'true';
      const res = await getProjects(params);
      setProjects(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const filtered = projects.filter(p =>
    !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    p.description.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{filters.archived ? 'Archived Projects' : 'Projects'}</h1>
        <p>Discover projects across departments and request roles that match your skills</p>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <FiSearch size={16} />
          <input className="search-input" placeholder="Search projects..."
            value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <select className="filter-select" value={filters.department}
          onChange={e => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
        </select>
        <select className="filter-select" value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        <select className="filter-select" value={filters.level}
          onChange={e => setFilters({ ...filters, level: e.target.value })}>
          <option value="">All Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className={`btn btn-sm ${filters.archived ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilters({ ...filters, archived: !filters.archived })}>
          {filters.archived ? '📁 Active' : '📦 Archive'}
        </button>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FiFolder size={48} />
          <h3>No projects found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map(p => (
            <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card project-card">
                <div className="project-card-header">
                  <span className={`badge ${p.status === 'Ongoing' ? 'badge-blue' : p.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>
                    {p.status}
                  </span>
                  <span className={`badge ${p.level === 'High' ? 'badge-red' : p.level === 'Medium' ? 'badge-yellow' : 'badge-teal'}`}>
                    {p.level} Priority
                  </span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.description?.substring(0, 120)}...</p>
                <div className="project-meta">
                  <span className="project-meta-item"><FiUsers size={14} /> {p.memberCount}/{p.maxMembers} members</span>
                  <span className="project-meta-item"><FiFolder size={14} /> {p.department}</span>
                  {p.vacancyCount > 0 && (
                    <span className="project-meta-item" style={{ color: 'var(--accent-green)' }}>
                      ✅ {p.vacancyCount} openings
                    </span>
                  )}
                </div>
                {p.staff && (
                  <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Lead: {p.staff.name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectListPage;
