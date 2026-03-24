import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead, markAllRead } from '../services/api';
import { FiHome, FiFolder, FiUsers, FiUser, FiFileText, FiHelpCircle, FiLogOut, FiBell, FiClipboard } from 'react-icons/fi';

function Navbar() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifs(res.data.data);
      setUnread(res.data.unreadCount);
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      fetchNotifications();
    } catch {}
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          TechTrack
        </Link>

        <ul className="navbar-links">
          <li><Link to="/" className={isActive('/')}><FiHome /><span> Dashboard</span></Link></li>
          <li><Link to="/projects" className={isActive('/projects')}><FiFolder /><span> Projects</span></Link></li>
          <li><Link to="/my-requests" className={isActive('/my-requests')}><FiClipboard /><span> My Requests</span></Link></li>
          <li><Link to="/staff" className={isActive('/staff')}><FiUsers /><span> Staff</span></Link></li>
          <li><Link to="/profile" className={isActive('/profile')}><FiUser /><span> Profile</span></Link></li>
          <li><Link to="/documents" className={isActive('/documents')}><FiFileText /><span> Documents</span></Link></li>
          <li><Link to="/help" className={isActive('/help')}><FiHelpCircle /><span> Help</span></Link></li>
          <li style={{ position: 'relative' }} ref={dropdownRef}>
            <button className={`notification-btn ${isActive('')}`} onClick={() => setShowNotifs(!showNotifs)}>
              <FiBell />
              {unread > 0 && <span className="notification-badge">{unread > 9 ? '9+' : unread}</span>}
            </button>
            {showNotifs && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <h3>Notifications</h3>
                  {unread > 0 && <button onClick={handleMarkAllRead}>Mark all read</button>}
                </div>
                {notifs.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifs.slice(0, 20).map(n => (
                    <div
                      key={n._id}
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => !n.read && handleMarkRead(n._id)}
                    >
                      <h4>{n.title}</h4>
                      <p>{n.message}</p>
                      <span className="notif-time">{timeAgo(n.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
          <li>
            <button onClick={logoutUser} style={{ color: 'var(--accent-red)' }}>
              <FiLogOut /><span> Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
