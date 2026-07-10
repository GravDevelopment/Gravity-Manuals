import { useState } from 'react';
import './App.css';
import ResultsScreen from './screens/ResultsScreen';
import SearchScreen from './screens/SearchScreen';

function App() {
  const [trainings, setTrainings] = useState(null);

  return (
    <div className="app">
      {trainings ? (
        <ResultsScreen trainings={trainings} onBack={() => setTrainings(null)} />
      ) : (
        <SearchScreen onResults={setTrainings} />
      )}
    </div>
  );
}

export default App;
