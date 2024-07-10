import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { auth } from './firebaseInit'; 
import ProtectedRoute from './ProtectedRoute';
import CoverModal from './components/CoverModal'; // Adjust the import path as necessary
import {
  A1, A2, B1, B2,
  NounsPage, AdjectivesPage, VerbsPage, TherePage,
  PastContPage, FuturePage, GoingToPage, CompSupePage,
  PresPerfCont, PastPerfContPage, SecCondPage, ModalVerbsPage,
  MixedCondPage, CausitivesPage, ModalsProbPage, FuturePerfPage
} from './components/pages';

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

            <Route path="/B1/presPerfCont" element={<PresPerfCont />} />
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
