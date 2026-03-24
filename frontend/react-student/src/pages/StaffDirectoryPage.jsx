import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStaffList } from '../services/api';
import { FiSearch, FiMapPin, FiBriefcase, FiLinkedin, FiPhone } from 'react-icons/fi';

function StaffDirectoryPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => { loadStaff(); }, [department]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const params = {};
      if (department) params.department = department;
      const res = await getStaffList(params);
      setStaff(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const filtered = staff.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Staff Directory</h1>
        <p>Connect with faculty members and project mentors</p>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <FiSearch size={16} />
          <input className="search-input" placeholder="Search staff..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={department} onChange={e => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <div className="card-grid">
          {filtered.map(s => (
            <Link key={s._id} to={`/staff/${s._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card staff-card">
                <div className="staff-avatar">{s.name?.charAt(0)}</div>
                <div className="staff-info">
                  <h3>{s.name}</h3>
                  <div className="staff-dept">{s.department}</div>
                  <span className={`availability-badge ${s.availability === 'Available' ? 'avail' : s.availability === 'Busy' ? 'busy' : 'not-interested'}`}>
                    <span className="availability-dot" />{s.availability || 'Available'}
                  </span>
                  <div className="staff-details" style={{ marginTop: '8px' }}>
                    {s.yearsExperience && <span><FiBriefcase size={13} /> {s.yearsExperience} years experience</span>}
                    {s.cabinNumber && <span><FiMapPin size={13} /> {s.cabinNumber}, {s.floor}</span>}
                    {s.contactNumber && <span><FiPhone size={13} /> {s.contactNumber}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StaffDirectoryPage;
