// NounsPage.js
import React, { useState, useEffect } from 'react';
import NounsData from '../../data/grammar/A1/1Nouns.json'; // Adjust the import path as necessary
import GrammarTopic from '../GrammarTopic'

const NounsPage = () => {
  const [nounsData, setNounsData] = useState(null);

  useEffect(() => {
    // Directly set NounsData into state, no fetching from a server
    setNounsData(NounsData);
    console.log(NounsData); // Log the data to verify it's being loaded correctly
  }, []);

  if (!nounsData) {
    return <div>Loading...</div>;
  }

  // Render your nouns content using nounsData
  return (
    <div>
      <h1>Nouns</h1>
      <GrammarTopic contentData={nounsData} />
    </div>
  );
};

export default NounsPage;