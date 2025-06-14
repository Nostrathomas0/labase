// App.js - New Flexible Architecture
import './firebaseInit';
import React, { useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import MainHeader from './components/layout/MainHeader';
import HamburgerNavigation from './components/layout/HamburgerNavigation';
import MainLayout from './components/layout/MainLayout';

// Page Components
import HomePage from './components/HomePage';

// Level components
import A1 from './components/pages/A1';
import A2 from './components/pages/A2';
import B1 from './components/pages/B1';
import B2 from './components/pages/B2';

// Grammar topic components
import NounsPage from './components/pages/A1/NounsPage';
import AdjectivesPage from './components/pages/A1/AdjectivesPage';
import VerbsPage from './components/pages/A1/VerbsPage';
import TherePage from './components/pages/A1/TherePage';

import PastContPage from './components/pages/A2/PastContPage';
import FuturePage from './components/pages/A2/FuturePage';
import GoingToPage from './components/pages/A2/GoingToPage';
import CompSupePage from './components/pages/A2/CompSupePage';

import PresPerfContPage from './components/pages/B1/PresPerfContPage';
import PastPerfContPage from './components/pages/B1/PastPerfContPage';
import SecCondPage from './components/pages/B1/SecCondPage';
import ModalVerbsPage from './components/pages/B1/ModalVerbsPage';

import MixedCondPage from './components/pages/B2/MixedCondPage';
import CausitivesPage from './components/pages/B2/CausitivesPage';
import ModalsProbPage from './components/pages/B2/ModalsProbPage';
import FuturePerfPage from './components/pages/B2/FuturePerfPage';

// Exam components
import ExamsHomePage from './components/pages/exams/ExamsHomePage';
import FEDEExamPage from './components/pages/exams/FEDEExamPage';
import TOEICExamPage from './components/pages/exams/TOEICExamPage';

// Add this at the very top of App.js - NUCLEAR ERROR CATCHER
const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
  if (props && props.className && typeof props.className === 'string') {
    // Check for problematic characters
    if (/[\x00-\x1F\x7F-\x9F]/.test(props.className)) {
      console.error('🚨 INVALID CLASSNAME:', JSON.stringify(props.className));
      console.error('🚨 Component type:', type);
      console.error('🚨 Full props:', props);
      console.trace('🚨 Stack trace:');
      // Fix it on the fly
      props = { ...props, className: 'safe-fallback' };
    }
  }
  return originalCreateElement.call(this, type, props, ...children);
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <AuthProvider>
        <div className="app">
          {/* Main Header with hamburger button */}
          <MainHeader onToggleSidebar={toggleSidebar} />
          
          {/* Hamburger Navigation Sidebar */}
          <HamburgerNavigation 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
          />
          
          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div 
              className="sidebar-overlay" 
              onClick={closeSidebar}
            />
          )}
          
          {/* Main Content Area */}
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              
              {/* Protected Grammar Level routes */}
              <Route path="/A1" element={
                <ProtectedRoute>
                  <MainLayout layoutType="navigation">
                    <A1 />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A2" element={
                <ProtectedRoute>
                  <MainLayout layoutType="navigation">
                    <A2 />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B1" element={
                <ProtectedRoute>
                  <MainLayout layoutType="navigation">
                    <B1 />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B2" element={
                <ProtectedRoute>
                  <MainLayout layoutType="navigation">
                    <B2 />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Protected Grammar Topic routes - Split Layout */}
              <Route path="/A1/nouns" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <NounsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A1/adjectives" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <AdjectivesPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A1/verbs" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <VerbsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A1/there" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <TherePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* A2 Grammar Topic routes */}
              <Route path="/A2/pastCont" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <PastContPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A2/future" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <FuturePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A2/goingTo" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <GoingToPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/A2/compSupe" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <CompSupePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* B1 Grammar Topic routes */}
              <Route path="/B1/presPerfCont" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <PresPerfContPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B1/pastPerfCont" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <PastPerfContPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B1/2ndCond" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <SecCondPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B1/modalVerbs" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <ModalVerbsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* B2 Grammar Topic routes */}
              <Route path="/B2/mixedCond" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <MixedCondPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B2/causitives" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <CausitivesPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B2/modalsProb" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <ModalsProbPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/B2/futurePerf" element={
                <ProtectedRoute>
                  <MainLayout layoutType="grammar">
                    <FuturePerfPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Exam routes */}
              <Route path="/exams" element={
                <ProtectedRoute>
                  <MainLayout layoutType="navigation">
                    <ExamsHomePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/exams/fede" element={
                <ProtectedRoute>
                  <MainLayout layoutType="exam">
                    <FEDEExamPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/exams/toeic" element={
                <ProtectedRoute>
                  <MainLayout layoutType="navigation">
                    <TOEICExamPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirect for any other path */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;