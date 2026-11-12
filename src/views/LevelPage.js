// src/views/LevelPage.js
// Lists the lessons for one level. Route: /:level  (replaces A1.js, A2.js, B1.js, B2.js)

import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { getLevel, getLessonsByLevel, lessonPath } from '../catalogue/catalogue';

const LevelPage = () => {
  const { level } = useParams();
  const levelInfo = getLevel(level);

  if (!levelInfo) return <Navigate to="/" replace />;
  if (level !== levelInfo.id) return <Navigate to={`/${levelInfo.id}`} replace />;

  const lessons = getLessonsByLevel(levelInfo.id);

  return (
    <MainLayout layoutType="navigation">
      <div className={`${levelInfo.id.toLowerCase()}-level`}>
        <h1>{levelInfo.id} Level Topics</h1>
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link to={lessonPath(lesson)}>
                {lesson.title}{lesson.premium ? ' ⭐' : ''}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default LevelPage;
