// AdjectivesPage.js
import React, { useState, useEffect } from 'react';
import GrammarTopic from '../GrammarTopic';
import AdjectivesData from '../../data/grammar/A1/2Adjectives.json'; // Import the JSON data for nouns

const AdjectivesPage = () => {
  const [adjectivesData, setAdjectivesData] = useState(null);

  useEffect(() => {
    setAdjectivesData(AdjectivesData);
    console.log(AdjectivesData);
  }, []);

  if (!adjectivesData) {
    return <div>Loading...</div>;
  }
    
  return (
    <div>
      <h1>Adjectives</h1>
      <GrammarTopic contentData={adjectivesData} />
    </div>
  );
};


export default AdjectivesPage;
