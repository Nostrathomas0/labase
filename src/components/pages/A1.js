// A1Page.js
import React from 'react';

import { Link } from 'react-router-dom';

const A1 = () => {
  // Define the list of topics for A1 level. You can expand this list based on your topics.
  const topics = [
    { name: 'Nouns', path: '/A1/nouns' },
    { name: 'Adjectives', path: '/A1/adjectives' },
    { name: 'Verbs', path: '/A1/verbs' },
    { name: 'There is/are', path: '/A1/there' },
    // Add more topics as needed
  ];

  return (
    <div className="a1-level">
      <h1>A1 Level Topics</h1>
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

export default A1;
