// src/views/SessionPage.js
// Route: /session/:sessionId — the app exercises for one class session.
// Lessons currently come from content/sessions/ (bundled at build time by
// scripts/build-sessions.js). When they move to Firestore, only the lookup changes.

import React, { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { LessonLoader } from './LessonPage';
import { SESSIONS } from '../data/sessions';

const SessionPage = ({ progressManager }) => {
  const { sessionId } = useParams();
  const session = SESSIONS[sessionId];

  // Shape the session like a catalogue lesson so the standard lesson view can show it
  const lesson = useMemo(() => session && {
    id: `session-${session.id}`,
    title: session.title,
    layout: 'standard',
    premium: false,
    progress: { level: 'session', topic: session.id },
    load: session.load,
  }, [session]);

  if (!lesson) return <Navigate to="/" replace />;
  return <LessonLoader key={lesson.id} lesson={lesson} progressManager={progressManager} nextUrl={null} />;
};

export default SessionPage;
