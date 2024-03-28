import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import NounsPage from './components/pages/NounsPage'; // Import your new component
import AdjectivesPage from './components/pages/AdjectivesPage';
import VerbsPage from './components/pages/VerbsPage';
import TherePage from './components/pages/TherePage'

function App() {
  return (
    <Router>
      <div>
        <nav>
        <ul>
          <li><Link to="/grammar/nouns">Nouns</Link></li>
          <li><Link to="/grammar/adjectives">Adjectives</Link></li>
          <li><Link to="/grammar/verbs">Verbs</Link></li>
          <li><Link to="/grammar/there-is-are">There is/are</Link></li>
        </ul>
        </nav>

        <Routes>
          <Route path="/grammar/nouns" element={<NounsPage />} />
          <Route path="/grammar/adjectives" element={<AdjectivesPage />} />
          <Route path="/grammar/verbs" element={<VerbsPage />} />
          <Route path="/grammar/there-is-are" element={<TherePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
