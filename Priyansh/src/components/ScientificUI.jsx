import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, Play, Database, Activity } from 'lucide-react';

export default function ScientificUI({ params, setParams, onSolve, results, loading }) {
  return (
    <div className="scientific-layout" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <aside style={{ width: '300px', background: '#fff', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          <Settings size={20} /> Parameters
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {['n_ants', 'n_iterations', 'alpha', 'beta', 'rho', 'initial_pheromone'].map(p => (
            <div key={p}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {p.replace('_', ' ').toUpperCase()}
              </label>
              <input 
                type="number" 
                value={params[p]} 
                onChange={e => setParams({...params, [p]: parseFloat(e.target.value)})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          ))}
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>ALGORITHM</label>
            <select 
              value={params.algorithm} 
              onChange={e => setParams({...params, algorithm: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="elitist">Elitist AS</option>
              <option value="rank">Rank-Based AS</option>
            </select>
          </div>

          {params.algorithm === 'elitist' ? (
             <div>
               <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>ELITIST WEIGHT (e)</label>
               <input type="number" value={params.e} onChange={e => setParams({...params, e: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
             </div>
          ) : (
            <div>
               <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>RANK COUNT (w)</label>
               <input type="number" value={params.w} onChange={e => setParams({...params, w: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
             </div>
          )}

          <button 
            onClick={onSolve} 
            disabled={loading}
            style={{ 
              marginTop: '1rem', padding: '1rem', background: '#0d6efd', color: '#fff', 
              border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            {loading ? 'Solving...' : <><Play size={16}/> RUN SIMULATION</>}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'grid', gap: '2rem' }}>
        <section style={{ padding: '1.5rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Activity size={20} /> Convergence Analysis
          </h3>
          {results ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="iteration" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="best_length" stroke="#0d6efd" strokeWidth={2} name="Best Length" />
                  <Line type="monotone" dataKey="avg_length" stroke="#6c757d" name="Avg Length" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#666' }}>
              Run a simulation to see results
            </div>
          )}
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <section style={{ padding: '1.5rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Database size={20} /> Solution Output
            </h3>
            {results && (
              <div style={{ fontSize: '0.875rem' }}>
                <p><strong>Route:</strong> {results.best_tour.join(' → ')}</p>
                <p><strong>Total Distance:</strong> {results.best_length}</p>
                <p><strong>Runtime:</strong> {results.time.toFixed(4)}s</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
