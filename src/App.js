// App.js
import './firebaseInit';
import './App.css';
import { useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ProgressManager } from './utils/ProgressManager';

// Layout
import MainHeader from './components/layout/MainHeader';
import HamburgerNavigation from './components/layout/HamburgerNavigation';

// Views — every lesson, level and exam is driven by src/catalogue/catalogue.js
import HomePage from './components/HomePage';
import LevelPage from './views/LevelPage';
import LessonPage from './views/LessonPage';
import ExamsHomePage from './views/ExamsHomePage';
import ExamTypePage from './views/ExamTypePage';
import SessionPage from './views/SessionPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progressManager] = useState(() => new ProgressManager());

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <MainHeader onToggleSidebar={toggleSidebar} progressManager={progressManager} />

          <HamburgerNavigation
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            progressManager={progressManager}
          />

          {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

          <main className="main-content">
            <Routes>
              <Route path="/login" element={<HomePage />} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

              {/* Exams — static paths outrank the :level routes below */}
              <Route path="/exams" element={<ProtectedRoute><ExamsHomePage /></ProtectedRoute>} />
              <Route path="/exams/:examId" element={<ProtectedRoute><ExamTypePage /></ProtectedRoute>} />

              {/* Class sessions — /session/<id> from content/sessions */}
              <Route
                path="/session/:sessionId"
                element={<ProtectedRoute><SessionPage progressManager={progressManager} /></ProtectedRoute>}
              />

              {/* Grammar — /A1, /A1/nouns, etc. Unknown levels/lessons redirect home */}
              <Route path="/:level" element={<ProtectedRoute><LevelPage /></ProtectedRoute>} />
              <Route
                path="/:level/:slug"
                element={<ProtectedRoute><LessonPage progressManager={progressManager} /></ProtectedRoute>}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
