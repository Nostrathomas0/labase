import React from 'react';
import { Link } from 'react-router-dom';

const A2 = () => {
  // Define the list of topics for A1 level. You can expand this list based on your topics.
  const topics = [
    { name: 'Past Continuous', path: '/A2/pastCont' },
    { name: 'Will', path: '/A2/future' },
    { name: 'Going To ', path: '/A2/goingTo' },
    { name: 'Comparitives & Superlatives', path: '/A2/compSupe' },
    // Add more topics as needed
  ];

  return (
    <div className="a2-level">
      <h1>A2 Level Topics</h1>
      <ul>
        {topics.map(topic => (
          <li key={topic.name}>
            <Link to={topic.path}>{topic.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default A2
