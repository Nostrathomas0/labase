import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseInit';
import { setJwtToken } from '../utils/authUtils';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const openModal = queryParams.get('openModal');

    if (openModal === 'auth-modal') {
      setShowModal(true);
      // replace the URl
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
      console.log("Attempting to sign in with:", email);
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful:", userCredential.user.email);
      
      // Get token and store it
      const token = await userCredential.user.getIdToken();
      setJwtToken(token);
      
      // Redirect to the original page or home
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle for the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Modal component
  const AuthModal = () => {
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


  return (
    <div>
      {/* Your main content here */}
      <h1>Welcome to Languapps</h1>
      <button onClick={toggleModal}>Login</button>
      
      {/* Render the modal */}
      <AuthModal />
    </div>
  );
};

export default HomePage;