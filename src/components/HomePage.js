import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const HomePage = () => {
  const { currentUser, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading...</h2>
        <p>Checking your authentication status...</p>
      </div>
    );
  }

  // If not authenticated, show login prompt with redirect
  if (!currentUser) {
    return (
      <div className="auth-prompt-container">
        <h1>Welcome to Languapps</h1>
        <p>Please sign in.</p>
        
        <div className="auth-actions">
          <a 
            href="https://languapps.com/?openModal=auth-modal" 
            className="auth-button primary"
          >
            Sign In
          </a>
          
          <a 
            href="https://languapps.com/?openModal=auth-modal" 
            className="auth-button secondary"
          >
            Create Account
          </a>
        </div>
        
        <p className="auth-note">
          You'll be redirected to our secure login page and then brought back here.
        </p>
      </div>
    );
  }

  // User is authenticated - show the main app
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome back to Languapps!</h1>
        <p>Hello, {currentUser.email} </p>
      </header>
      
      <main className="app-main">
        <div className="user-dashboard">
          <h2>Your Learning Dashboard</h2>
          
          {/* Your app content goes here */}
          <div className="learning-modules">
            <p>Grammar lessons and progress will appear here...</p>
            {/* Add your actual app components here */}
          </div>
          
          <div className="user-info">
            <p><strong>User ID:</strong> {currentUser.uid}</p>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <button 
          onClick={async () => {
            await signOut();
            navigate('/login', { replace: true });
          }}
          className="sign-out-button"
        >
          Sign Out
        </button>
      </footer>
    </div>
  );
};

export default HomePage;