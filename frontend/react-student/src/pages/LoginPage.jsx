import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';
import toast from 'react-hot-toast';

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student',
    studentId: '', rollNumber: '', department: ''
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await register(formData);
        toast.success('Account created successfully!');
      } else {
        res = await login({ email: formData.email, password: formData.password });
        toast.success('Welcome back!');
      }
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TechTrack</h1>
        <p className="subtitle">{isRegister ? 'Create your student account' : 'Student Portal Login'}</p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="Enter your full name" required />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="your.email@student.edu" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter your password" required minLength="6" />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>Student ID</label>
                <input className="form-input" type="text" name="studentId" value={formData.studentId}
                  onChange={handleChange} placeholder="e.g., CS2024001" />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input className="form-input" type="text" name="rollNumber" value={formData.rollNumber}
                  onChange={handleChange} placeholder="e.g., 21CS101" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-select" name="department" value={formData.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontFamily: 'inherit' }}>
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
