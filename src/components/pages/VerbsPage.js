// VerbsPage.js
import React, { useState, useEffect } from 'react';
import GrammarTopic from '../GrammarTopic';
import VerbsData from '../../data/grammar/A1/3Verbs.json'; // Import the JSON data for nouns

const VerbsPage = () => {
  const [verbsData, setVerbsData] = useState(null);

  useEffect(() => {
    setVerbsData(VerbsData);
    console.log(VerbsData);
  }, []);

  if (!verbsData) {
    return <div>Loading...</div>;
  }
    
  return (
    <div>
      <h1>Verbs</h1>
      <GrammarTopic contentData={verbsData} />
    </div>
  );
}


export default VerbsPage;
