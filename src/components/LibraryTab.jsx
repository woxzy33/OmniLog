import React, { useState } from 'react';
import { styles } from '../styles';
import { Search } from './Icons';

export default function LibraryTab({ data }) {
  const [search, setSearch] = useState("");

  const filtered = data.exercises.filter(e => 
    (e.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (e.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pad">
      <div className="sectionLabel">EXERCISE LIBRARY ({data.exercises.length})</div>
      
      <div style={{ display: 'flex', alignItems: 'center', background: '#141210', border: '1px solid #2A2722', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
        <Search size={16} color="#8b90a0" style={{ marginRight: 8 }} />
        <input 
          style={{ background: 'transparent', border: 'none', color: '#e2e2e2', flex: 1, outline: 'none', fontSize: 14 }}
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((e) => (
          <div key={e.id} className="libraryRow">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600 }}>{e.name}</span>
              {(e.equipment || e.targetArea) && (
                <span style={{ fontSize: 11, color: "#8b90a0", marginTop: 2 }}>
                  {[e.equipment, e.targetArea].filter(Boolean).join(" · ")}
                </span>
              )}
            </div>
            <span className="tag">{e.category}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="emptyHint">No exercises found matching "{search}".</div>
        )}
      </div>
    </div>
  );
}
