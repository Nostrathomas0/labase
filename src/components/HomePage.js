
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseInit';
import { setJwtToken } from '../utils/authUtils';

// Modal component OUTSIDE of HomePage
const AuthModal = ({
  showModal,
  toggleModal,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  error,
  loading,
}) => {
  return (
    <div className={`modal ${showModal ? 'visible' : 'hidden'}`} id="auth-modal">
      <div className="modal-content">
        <span className="close" onClick={toggleModal}>&times;</span>
        <div className="login-container">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="signup-link">
            Don’t have an account?{' '}
            <span onClick={toggleModal} className="link">
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const openModal = queryParams.get('openModal');

    if (openModal === 'auth-modal') {
      setShowModal(true);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('openModal');
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setJwtToken(token);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <h1>Welcome to Languapps</h1>
      <button onClick={toggleModal}>Login</button>

      <AuthModal
        showModal={showModal}
        toggleModal={toggleModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default HomePage;