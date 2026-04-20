import React, { useState } from 'react';
import axios from 'axios';
import ScientificUI from './components/ScientificUI';
import CyberpunkUI from './components/CyberpunkUI';
import GlassmorphismUI from './components/GlassmorphismUI';
import { Palette } from 'lucide-react';

const API_BASE = 'http://localhost:8001';

function App() {
  const [theme, setTheme] = useState('scientific');
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
      alert("Failed to connect to backend. Make sure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const renderUI = () => {
    switch (theme) {
      case 'cyberpunk':
        return <CyberpunkUI params={params} setParams={setParams} onSolve={handleSolve} results={results} loading={loading} />;
      case 'glass':
        return <GlassmorphismUI params={params} setParams={setParams} onSolve={handleSolve} results={results} loading={loading} />;
      default:
        return <ScientificUI params={params} setParams={setParams} onSolve={handleSolve} results={results} loading={loading} />;
    }
  };

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Theme Switcher Overlay */}
      <div style={{ 
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, 
        background: 'rgba(0,0,0,0.8)', padding: '0.5rem', borderRadius: '30px',
        display: 'flex', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={() => setTheme('scientific')}
          style={{ ...btnStyle, background: theme === 'scientific' ? '#0d6efd' : 'transparent' }}
        >
          <Palette size={16} /> Sci
        </button>
        <button 
          onClick={() => setTheme('cyberpunk')}
          style={{ ...btnStyle, background: theme === 'cyberpunk' ? '#39ff14' : 'transparent', color: theme === 'cyberpunk' ? '#000' : '#39ff14' }}
        >
          <Palette size={16} /> Cyber
        </button>
        <button 
          onClick={() => setTheme('glass')}
          style={{ ...btnStyle, background: theme === 'glass' ? '#fff' : 'transparent', color: theme === 'glass' ? '#000' : '#fff' }}
        >
          <Palette size={16} /> Glass
        </button>
      </div>

      {renderUI()}
    </div>
  );
}

const btnStyle = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  transition: 'all 0.2s'
};

export default App;
