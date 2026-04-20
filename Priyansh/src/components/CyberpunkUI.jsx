import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';

export default function CyberpunkUI({ params, setParams, onSolve, results, loading }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (results) {
      const newLogs = results.history.map(h => [`[SYSTEM]: Iteration ${h.iteration} complete. Global Min: ${h.best_length}`, `[DATA]: Local Average: ${h.avg_length.toFixed(2)}`]).flat();
      setLogs(prev => [...newLogs.slice(-20)]);
    }
  }, [results]);

  return (
    <div className="cyber-layout" style={{ position: 'relative', padding: '2rem', height: '100vh', overflow: 'hidden', background: '#050505', color: '#39ff14' }}>
      <div className="scanlines" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', zIndex: 10, pointerEvents: 'none' }}></div>
      
      <header style={{ borderBottom: '2px solid #39ff14', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textShadow: '0 0 10px #39ff14' }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '4px' }}>{"< ACO_CORE_V8 />"}</h1>
        <div style={{ display: 'flex', gap: '2rem' }}>
           <div>CPU: 98%</div>
           <div>STATUS: OPTIMIZING</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr 300px', gap: '2rem', height: 'calc(100% - 150px)' }}>
        {/* PARAMS PANEL */}
        <section style={{ border: '1px solid #39ff14', padding: '1.5rem', boxShadow: 'inset 0 0 15px rgba(57, 255, 20, 0.2)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}> <Cpu size={18}/> CONFIG_INIT </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
             {['alpha', 'beta', 'rho', 'n_ants'].map(p => (
               <div key={p}>
                 <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>{`> SET_${p.toUpperCase()}`}</div>
                 <input 
                  type="number" value={params[p]} 
                  onChange={e => setParams({...params, [p]: parseFloat(e.target.value)})} 
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #39ff14', color: '#39ff14', width: '100%', outline: 'none' }} 
                 />
               </div>
             ))}
             <button 
              onClick={onSolve}
              style={{ background: '#39ff14', color: '#000', border: 'none', padding: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '2rem', boxShadow: '0 0 15px #39ff14' }}
             >
               {loading ? "INITIALIZING..." : "[ EXECUTE_SEARCH ]"}
             </button>
          </div>
        </section>

        {/* MAIN VISUALIZER */}
        <section style={{ border: '1px solid #39ff14', position: 'relative', display: 'flex', flexDirection: 'column' }}>
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
             {results ? (
               <>
                 <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>{results.best_length}</div>
                 <div style={{ letterSpacing: '5px' }}>OPTIMAL_DISTANCE_FOUND</div>
                 <div style={{ marginTop: '2rem', color: '#ff00ff', fontSize: '1.2rem' }}>
                    ROUTE: {results.best_tour.join(' -> ')}
                 </div>
               </>
             ) : (
               <Zap size={64} className="pulse" />
             )}
           </div>
           
           <div className="terminal-log" style={{ height: '200px', borderTop: '1px solid #39ff14', background: 'rgba(57, 255, 20, 0.05)', padding: '1rem', overflow: 'hidden', fontSize: '0.8rem' }}>
             {logs.map((log, i) => (
               <div key={i} style={{ marginBottom: '0.25rem' }}>{log}</div>
             ))}
             <div className="cursor" style={{ display: 'inline-block', width: '8px', height: '15px', background: '#39ff14', marginLeft: '5px' }}></div>
           </div>
        </section>

        {/* STATS PANEL */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ border: '1px solid #ff00ff', padding: '1rem', color: '#ff00ff', boxShadow: 'inset 0 0 10px rgba(255, 0, 255, 0.1)' }}>
              <h3>SYS_INFO</h3>
              <p style={{ marginTop: '0.5rem' }}>ALGO: {params.algorithm.toUpperCase()}</p>
              <p>TIME: {results?.time.toFixed(4) || "0.0000"}s</p>
           </div>
           <div style={{ border: '1px solid #39ff14', padding: '1rem', flex: 1 }}>
              <Activity size={18} />
              <div style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                 LIVE_MATRIX_LOADED: YES <br/>
                 PHEROMONE_LEVEL: STABLE
              </div>
           </div>
        </section>
      </div>
      
      <style>{`
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(1); } }
      `}</style>
    </div>
  );
}
