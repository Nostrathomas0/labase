// App.js
import './firebaseInit';
import { AuthProvider } from './components/AuthContext';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import CoverModal from './components/CoverModal';


// Level components
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <AuthProvider>
        <CoverModal isOpen={isModalOpen} onClose={closeModal} />
        
        <div className="levels-topics-wrapper">
          <div className="levels-and-topics-container">
            <div className="levels-container">
              <h2>Levels</h2>
              <nav>
                <ul className="menu-list">
                  <li><Link to="/A1">Beginner (A1)</Link></li>
                  <li><Link to="/A2">Elementary (A2)</Link></li>
                  <li><Link to="/B1">Pre-Intermediate (B1)</Link></li>
                  <li><Link to="/B2">Intermediate (B2)</Link></li>
                </ul>
              </nav>
            </div>

            <div className="topics-container">
              <h2>Topics</h2>
              <div className="topics-list">
                <Routes>
                  {/* Public route - always accessible */}
                  <Route path="/login" element={<HomePage />} />
                  
                  {/* Landing page - accessible to everyone */}
                  <Route path="/" element={<HomePage onOpenModal={openModal} />} />
                  
                  {/* Protected level routes */}
                  <Route path="/A1" element={
                    <ProtectedRoute>
                      <A1 />
                    </ProtectedRoute>
                  } />
                  <Route path="/A2" element={
                    <ProtectedRoute>
                      <A2 />
                    </ProtectedRoute>
                  } />
                  <Route path="/B1" element={
                    <ProtectedRoute>
                      <B1 />
                    </ProtectedRoute>
                  } />
                  <Route path="/B2" element={
                    <ProtectedRoute>
                      <B2 />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected A1 topic routes */}
                  <Route path="/A1/nouns" element={
                    <ProtectedRoute>
                      <NounsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/A1/adjectives" element={
                    <ProtectedRoute>
                      <AdjectivesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/A1/verbs" element={
                    <ProtectedRoute>
                      <VerbsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/A1/there" element={
                    <ProtectedRoute>
                      <TherePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected A2 topic routes */}
                  <Route path="/A2/pastCont" element={
                    <ProtectedRoute>
                      <PastContPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/A2/future" element={
                    <ProtectedRoute>
                      <FuturePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/A2/goingTo" element={
                    <ProtectedRoute>
                      <GoingToPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/A2/compSupe" element={
                    <ProtectedRoute>
                      <CompSupePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected B1 topic routes */}
                  <Route path="/B1/presPerfCont" element={
                    <ProtectedRoute>
                      <PresPerfContPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/B1/pastPerfCont" element={
                    <ProtectedRoute>
                      <PastPerfContPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/B1/2ndCond" element={
                    <ProtectedRoute>
                      <SecCondPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/B1/modalVerbs" element={
                    <ProtectedRoute>
                      <ModalVerbsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected B2 topic routes */}
                  <Route path="/B2/mixedCond" element={
                    <ProtectedRoute>
                      <MixedCondPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/B2/causitives" element={
                    <ProtectedRoute>
                      <CausitivesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/B2/modalsProb" element={
                    <ProtectedRoute>
                      <ModalsProbPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/B2/futurePerf" element={
                    <ProtectedRoute>
                      <FuturePerfPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect for any other path */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;