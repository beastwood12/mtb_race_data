import React, { useState } from 'react';
import SingleRaceDashboard from './components/SingleRaceDashboard';
import metadata from './data/metadata.json';
import raceData from './data/races/2025-cedar-city.json';

function App() {
  const [currentRace] = useState(metadata.seasons[0].races[0]);

  return (
    <div className="App">
      <SingleRaceDashboard 
        raceData={raceData}
        raceInfo={currentRace}
      />
    </div>
  );
}

export default App;
