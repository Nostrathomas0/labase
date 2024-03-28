// TherePage.js
import React, { useState, useEffect } from 'react';
import GrammarTopic from '../GrammarTopic';
import ThereData from '../../data/grammar/A1/4There.json'; // Import the JSON data for nouns

const TherePage = () => {
  const [thereData, setThereData] = useState(null);

  useEffect(() => {
    setThereData(ThereData);
    console.log(ThereData);
  }, []);

  if (!thereData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Here and There</h1>
      <GrammarTopic contentData={thereData} />
    </div>
  );
};

export default TherePage;
