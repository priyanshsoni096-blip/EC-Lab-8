import React, { useState } from 'react';
import axios from 'axios';
import ScientificUI from './components/ScientificUI';

const API_BASE = 'http://localhost:8001';

function App() {
  const [params, setParams] = useState({
    n_ants: 10,
    n_iterations: 50,
    alpha: 1.0,
    beta: 2.0,
    rho: 0.5,
    Q: 1.0,
    initial_pheromone: 1.0,
    algorithm: 'elitist',
    e: 5,
    w: 6
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/solve`, params);
      setResults(response.data);
    } catch (error) {
      console.error("Solver error:", error);
      alert("Failed to connect to backend. Make sure it's running on port 8001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container theme-scientific">
      <ScientificUI params={params} setParams={setParams} onSolve={handleSolve} results={results} loading={loading} />
    </div>
  );
}

export default App;
