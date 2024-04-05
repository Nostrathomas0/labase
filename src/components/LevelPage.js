// LevelPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTopicsByLevel } from './pages/topicsData'; // Adjust the import path as necessary


const LevelPage = () => {
  const { level } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const topicsForLevel = getTopicsByLevel(level);
    setTopics(topicsForLevel);
  }, [level]);

  return (
    <div>
      <h1>{`Topics for Level ${level}`}</h1>
      <ul>
        {topics.map(({ name, path }) => (
          <li key={name}>
            <Link to={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default LevelPage;
