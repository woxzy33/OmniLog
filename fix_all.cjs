
const fs = require("fs");
let c = fs.readFileSync("src/components/ProfileTab.jsx", "utf8");

// Re-write the broken ExercisesView block
c = c.replace(/return \(\s*<motion\.div.*?\s*<\/motion\.div>\s*\);\s*\}/s, `return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
      <SubViewHeader title="Exercises & PRs" onBack={onBack} />
      
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#121212", borderRadius: 12, padding: "14px 16px", border: "1px solid #2A2722" }}>
          <Search size={18} color="#8b90a0" style={{ marginRight: 12 }} />
          <input 
            placeholder="Search exercises..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", color: "#e2e2e2", flex: 1, outline: "none", fontSize: 16, fontWeight: 600 }}
          />
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 8, msOverflowStyle: "none", scrollbarWidth: "none" }}>
        <button onClick={() => setSortMode("recent")} style={{ background: sortMode === "recent" ? "#e2e2e2" : "#121212", color: sortMode === "recent" ? "#121212" : "#8b90a0", border: "none", borderRadius: 16, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Recent</button>
        <button onClick={() => setSortMode("1rm")} style={{ background: sortMode === "1rm" ? "#e2e2e2" : "#121212", color: sortMode === "1rm" ? "#121212" : "#8b90a0", border: "none", borderRadius: 16, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Est. 1RM</button>
        <button onClick={() => setSortMode("maxWeight")} style={{ background: sortMode === "maxWeight" ? "#e2e2e2" : "#121212", color: sortMode === "maxWeight" ? "#121212" : "#8b90a0", border: "none", borderRadius: 16, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Max Weight</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredAndSorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#8b90a0", fontSize: 16, fontWeight: 600 }}>No exercises found.</div>
        ) : (
          filteredAndSorted.map(e => (
            <div 
              key={e.id} 
              onClick={() => onViewDetail(e.id)}
              style={{ ...styles.exCard, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 16, background: "#121212", cursor: "pointer" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 800, color: "#e2e2e2", fontSize: 16 }}>{e.name}</span>
                <span style={{ fontSize: 13, color: "#8b90a0", marginTop: 4, fontWeight: 600 }}>{e.category ? t(\`categories.\${e.category.toLowerCase()}\`, e.category) : ""} {e.usageCount > 0 && \`• Done \${e.usageCount}x\`}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#8b90a0", fontWeight: 700, textTransform: "uppercase" }}>
                  {sortMode === "1rm" ? "Est. 1RM" : "Max Wt"}
                </div>
                <div style={{ fontSize: 18, color: e.best1RM > 0 ? "#E8C12C" : "#333535", fontWeight: 800 }}>
                  {e.best1RM > 0 ? (
                    sortMode === "1rm" 
                      ? \`\${formatWeight(e.best1RM, settings?.unit)} \${settings?.unit || "kg"}\`
                      : \`\${formatWeight(e.prWeight, settings?.unit)} \${settings?.unit || "kg"}\`
                  ) : "-"}
                </div>
                {e.best1RM > 0 && (
                  <div style={{ fontSize: 12, color: "#8b90a0", fontWeight: 600, marginTop: 2 }}>
                    {sortMode === "1rm" 
                      ? \`(\${formatWeight(e.best1RMWeight, settings?.unit)}x\${e.best1RMReps})\`
                      : \`(\${e.prWeightReps} reps)\`}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}`);

// Also fix ExerciseDetailView
c = c.replace(/<StatBox label="Max Weight".*?<\/div>/s, `<StatBox label="Max Weight" value={history.length > 0 ? \`\${formatWeight(Math.max(...history.map(h => h.maxWeight)), settings?.unit)} \${settings?.unit || "kg"}\` : "-"} color="#E8C12C" />
        <StatBox label="Est. 1RM" value={history.length > 0 ? \`\${formatWeight(Math.max(...history.map(h => h.max1RM)), settings?.unit)} \${settings?.unit || "kg"}\` : "-"} color="var(--primary)" />
      </div>`);

fs.writeFileSync("src/components/ProfileTab.jsx", c);

