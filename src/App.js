import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import CoverModal from './components/CoverModal'; // Adjust the import path as necessary
import A1 from './components/pages/A1';
import A2 from './components/pages/A2';
import B1 from './components/pages/B1';
import B2 from './components/pages/B2';
// Import A1 components here
import NounsPage from './components/pages/A1/NounsPage';
import AdjectivesPage from './components/pages/A1/AdjectivesPage';
import VerbsPage from './components/pages/A1/VerbsPage';
import TherePage from './components/pages/A1/TherePage';
// Imports for A2 level topic pages
import PastContPage from './components/pages/A2/PastContPage';
import FuturePage from './components/pages/A2/FuturePage';
import GoingToPage from './components/pages/A2/GoingToPage';
import CompSupePage from './components/pages/A2/CompSupePage';

// Imports for B1 level topic pages
import PresPerfCont from './components/pages/B1/PresPerfContPage';
import PastPerfContPage from './components/pages/B1/PastPerfContPage';
import SecCondPage from './components/pages/B1/SecCondPage';
import ModalVerbsPage from './components/pages/B1/ModalVerbsPage';

// Imports for B2 level topic pages
import MixedCondPage from './components/pages/B2/MixedCondPage';
import CausitivesPage from './components/pages/B2/CausitivesPage';
import ModalsProbPage from './components/pages/B2/ModalsProbPage';
import FuturePerfPage from './components/pages/B2/FuturePerfPage';




function App() {
  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    const authToken = cookie ? cookie.split('=')[1] : null;

    if (authToken) {
      auth.signInWithCustomToken(authToken)
        .then(() => {
          console.log("User is authenticated, allow access");
        })
        .catch(error => {
          console.error("Authentication failed, redirecting to login:", error);
          window.location.href = "https://languapps.com/login";
        });
    } else {
      window.location.href = "https://languapps.com/login";
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/A1">Beginner (A1)</Link></li>
            <li><Link to="/A2">Elementary (A2)</Link></li>
            <li><Link to="/B1">Pre-Intermediate (B1)</Link></li>
            <li><Link to="/B2">Intermediate (B2)</Link></li>
            {/* Add more levels as necessary */}
          </ul>
        </nav>

        <Routes>
          {/* Level Routes */}
          <Route path="/A1" element={<A1 />} />
          <Route path="/A2" element={<A2 />} />
          <Route path="/B1" element={<B1 />} />
          <Route path="/B2" element={<B2 />} />
          {/* Add more level routes as necessary */}

          {/* Topic Routes within each Level */}
          <Route path="/A1/nouns" element={<NounsPage />} />
          <Route path="/A1/adjectives" element={<AdjectivesPage />} />
          <Route path="/A1/verbs" element={<VerbsPage />} />
          <Route path="/A1/there" element={<TherePage />} />
          {/* Add more topic routes for each level in a similar manner */}
          <Route path="/A2/pastCont" element={<PastContPage />} />
          <Route path="/A2/future" element={<FuturePage />} />
          <Route path="/A2/goingTo" element={<GoingToPage />} />
          <Route path="/A2/compSupe" element={<CompSupePage />} />
          {/* Add more topic routes for each level in a similar manner */}
          <Route path="/B1/presPerfCont" element={<PresPerfCont />} />
          <Route path="/B1/pastPerfCont" element={<PastPerfContPage />} />
          <Route path="/B1/2ndCond" element={<SecCondPage />} />
          <Route path="/B1/modalVerbs" element={<ModalVerbsPage />} />
          {/* Add more topic routes for each level in a similar manner */}
          <Route path="/B2/mixedCond" element={<MixedCondPage />} />
          <Route path="/B2/causitives" element={<CausitivesPage />} />
          <Route path="/B2/modalsProb" element={<ModalsProbPage />} />
          <Route path="/B2/futurePerf" element={<FuturePerfPage />} />
          {/* Add more topic routes for each level in a similar manner */}
          {/* Repeat for A2, B1, B2, etc. */}
        </Routes>

        <CoverModal isOpen={isModalOpen} onRequestClose={closeModal} />
      </div>
    </Router>
  );
}

export default App;