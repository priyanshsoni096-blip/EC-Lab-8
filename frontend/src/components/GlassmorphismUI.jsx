import React from 'react';
import { motion } from 'framer-motion';
import { Share2, BarChart3, Settings2, Info } from 'lucide-react';

export default function GlassmorphismUI({ params, setParams, onSolve, results, loading }) {
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '2rem',
    color: '#fff'
  };

  return (
    <div className="glass-layout" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '3rem', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '3rem', color: '#fff', fontWeight: '800' }}>
            ACO Intelligent Dashboard
          </motion.h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginTop: '1rem' }}>Premium Solution Exploration Engine</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Controls Card */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                <Settings2 size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem' }}>Simulation Controls</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {['n_ants', 'n_iterations', 'alpha', 'beta', 'rho', 'initial_pheromone'].map(p => (
                <div key={p}>
                   <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.replace('_', ' ')}</div>
                   <input 
                    type="number" value={params[p]} 
                    onChange={e => setParams({...params, [p]: parseFloat(e.target.value)})}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.1)', border: 'none', padding: '1rem', borderRadius: '12px', color: '#fff' }}
                   />
                </div>
              ))}
            </div>

            <button 
              onClick={onSolve}
              style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.9)', color: '#764ba2', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              {loading ? "Processing..." : "Launch Analytics"}
            </button>
          </motion.div>

          {/* Results Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={cardStyle}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                <BarChart3 size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem' }}>Discovery Insights</h2>
            </div>

            {results ? (
              <div style={{ display: 'grid', gap: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800' }}>{results.best_length}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)' }}>Best Total Distance</div>
                </div>

                <div>
                   <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}> <Share2 size={18}/> Optimized Route </h4>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {results.best_tour.map((city, i) => (
                        <div key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                           City {city}
                        </div>
                      ))}
                   </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                  <span>Iterations: {params.n_iterations}</span>
                  <span>Time: {results.time.toFixed(3)}s</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '4rem 0' }}>
                <Info size={48} style={{ marginBottom: '1rem' }} />
                <p>Waiting for simulation launch...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
