import React from 'react';
import { Link } from 'react-router-dom';

const B1 = () => {
  // Define the list of topics for A1 level. You can expand this list based on your topics.
  const topics = [
    { name: 'PresPerfCont', path: '/B1/presPerfCont' },
    { name: 'PastPerfCont', path: '/B1/pastPerfCont' },
    { name: '2ndCond', path: '/B1/2ndCond' },
    { name: 'ModalVerbs', path: '/B1/modalVerbs' },
    // Add more topics as needed
  ];

  return (
    <div className="b1-level">
      <h1>B1 Level Topics</h1>
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

export default B1
