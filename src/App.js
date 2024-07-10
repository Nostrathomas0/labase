import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { auth } from './firebaseInit'; 
import ProtectedRoute from './components/ProtectedRoute';
import CoverModal from './components/CoverModal'; // Adjust the import path as necessary
import A1 from './components/pages/A1';
import A2 from './components/pages/A2';
import B1 from './components/pages/B1';
import B2 from './components/pages/B2';

// Import A1 components
import NounsPage from './components/pages/A1/NounsPage';
import AdjectivesPage from './components/pages/A1/AdjectivesPage';
import VerbsPage from './components/pages/A1/VerbsPage';
import TherePage from './components/pages/A1/TherePage';

// Import A2 components
import PastContPage from './components/pages/A2/PastContPage';
import FuturePage from './components/pages/A2/FuturePage';
import GoingToPage from './components/pages/A2/GoingToPage';
import CompSupePage from './components/pages/A2/CompSupePage';

// Import B1 components
import PresPerfContPage from './components/pages/B1/PresPerfContPage';
import PastPerfContPage from './components/pages/B1/PastPerfContPage';
import SecCondPage from './components/pages/B1/SecCondPage';
import ModalVerbsPage from './components/pages/B1/ModalVerbsPage';

// Import B2 components
import MixedCondPage from './components/pages/B2/MixedCondPage';
import CausitivesPage from './components/pages/B2/CausitivesPage';
import ModalsProbPage from './components/pages/B2/ModalsProbPage';
import FuturePerfPage from './components/pages/B2/FuturePerfPage';

function App() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shouldOpenModal = queryParams.get('openModal') === 'true';
    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

    if (authToken) {
      auth.signInWithCustomToken(authToken)
        .then(() => {
          console.log("User is authenticated, allow access");
          setIsModalOpen(shouldOpenModal);
        })
        .catch(error => {
          console.error("Authentication failed:", error);
          setAuthError('Authentication failed. Please try again.');
        });
    } else {
      setAuthError('No authentication token found. Please sign in.');
    }
  }, [location]);

  const closeModal = () => setIsModalOpen(false);

  return (
    <AuthProvider>
      <div>
        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
        <nav>
          <ul>
            <li><Link to="/A1">Beginner (A1)</Link></li>
            <li><Link to="/A2">Elementary (A2)</Link></li>
            <li><Link to="/B1">Pre-Intermediate (B1)</Link></li>
            <li><Link to="/B2">Intermediate (B2)</Link></li>
          </ul>
        </nav>

        <Routes>
          {/* Level Routes */}
          <Route path="/A1" element={<A1 />} />
          <Route path="/A2" element={<A2 />} />
          <Route path="/B1" element={<B1 />} />
          <Route path="/B2" element={<B2 />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/A1/nouns" element={<NounsPage />} />
            <Route path="/A1/adjectives" element={<AdjectivesPage />} />
            <Route path="/A1/verbs" element={<VerbsPage />} />
            <Route path="/A1/there" element={<TherePage />} />

            <Route path="/A2/pastCont" element={<PastContPage />} />
            <Route path="/A2/future" element={<FuturePage />} />
            <Route path="/A2/goingTo" element={<GoingToPage />} />
            <Route path="/A2/compSupe" element={<CompSupePage />} />

            <Route path="/B1/presPerfCont" element={<PresPerfContPage />} />
            <Route path="/B1/pastPerfCont" element={<PastPerfContPage />} />
            <Route path="/B1/2ndCond" element={<SecCondPage />} />
            <Route path="/B1/modalVerbs" element={<ModalVerbsPage />} />

            <Route path="/B2/mixedCond" element={<MixedCondPage />} />
            <Route path="/B2/causitives" element={<CausitivesPage />} />
            <Route path="/B2/modalsProb" element={<ModalsProbPage />} />
            <Route path="/B2/futurePerf" element={<FuturePerfPage />} />
          </Route>
        </Routes>

        <CoverModal isOpen={isModalOpen} onRequestClose={closeModal} />
      </div>
    </AuthProvider>
  );
}

export default App;
