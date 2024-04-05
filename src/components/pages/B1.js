import React from 'react';
import { Link } from 'react-router-dom';

const B1 = () => {
  // Define the list of topics for A1 level. You can expand this list based on your topics.
  const topics = [
    { name: 'PresPerfCont', path: '/B1/pres-perf-cont' },
    { name: 'PastPerfCont', path: '/B1/past-perf-cont' },
    { name: '2ndCond', path: '/B1/2ndCond' },
    { name: 'ModalVerbs', path: '/B1/modal-verbs' },
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
