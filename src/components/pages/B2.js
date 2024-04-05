import React from 'react';
import { Link } from 'react-router-dom';

const B2 = () => {
  // Define the list of topics for A1 level. You can expand this list based on your topics.
  const topics = [
    { name: 'MixedCond', path: '/B2/mixed-cond' },
    { name: 'Causitive', path: '/B2/causitive' },
    { name: 'ModalsProb', path: '/B2/modals-prob' },
    { name: 'FuturePerf', path: '/B2/future-perf' },
    // Add more topics as needed
  ];

  return (
    <div className="b2-level">
      <h1>B2 Level Topics</h1>
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

export default B2
