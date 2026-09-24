import re

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Import MuscleHeatmap and AnimatePresence if not present
    if "MuscleHeatmap" not in content:
        content = content.replace("import { formatWeight, parseLocalDate, formatLocalDate } from '../utils';", "import { formatWeight, parseLocalDate, formatLocalDate } from '../utils';\nimport MuscleHeatmap from './MuscleHeatmap';\nimport { AnimatePresence } from 'framer-motion';")
        
    if "const [activeGraph, setActiveGraph] = useState('chart');" not in content:
        content = content.replace(
            "export default function ProfileTab({ data, persist, settings }) {",
            "export default function ProfileTab({ data, persist, settings }) {\n  const [activeGraph, setActiveGraph] = useState('chart');"
        )
    
    # We replace the entire activity chart card with our new togglable card
    # Find start: <div style={{ ...styles.card, padding: '24px 20px', marginBottom: 24 }}>
    # Find end: {/* Dashboard Grid */}
    
    pattern = r'<div style=\{\{ \.\.\.styles\.card, padding: \'24px 20px\', marginBottom: 24 \}\}>.*?(?=\{/\* Dashboard Grid \*/\})'
    
    new_card = """<div style={{ ...styles.card, padding: '24px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => setActiveGraph(activeGraph === 'chart' ? 'heatmap' : 'chart')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {activeGraph === 'chart' ? 'Activity Volume' : '3-Day Fatigue'}
            </div>
            <div style={{ fontSize: 10, color: '#8b90a0', fontWeight: 600, marginTop: 4 }}>
              {activeGraph === 'chart' ? 'Past 6 Months' : 'Current System Load'}
            </div>
          </div>
          <button onClick={() => setActiveGraph(activeGraph === 'chart' ? 'heatmap' : 'chart')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {activeGraph === 'chart' ? (
              <motion.div key="chart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                <div style={{ height: 180, marginBottom: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2722" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: "#8b90a0", fontSize: 10 }} tickLine={false} axisLine={false} dy={10} minTickGap={15} />
                      <YAxis tick={{ fill: "#8b90a0", fontSize: 10 }} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip cursor={{ fill: '#1C1C1E' }} content={<CustomTooltip unit={settings?.unit} metricMode={chartMetric} />} />
                      <Bar dataKey={chartMetric} fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="#003366" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {["duration", "volume", "reps"].map(m => (
                    <button
                      key={m}
                      onClick={() => setChartMetric(m)}
                      style={{
                        flex: 1,
                        background: chartMetric === m ? '#e2e2e2' : '#1C1C1E',
                        color: chartMetric === m ? '#121212' : '#8b90a0',
                        border: 'none', borderRadius: 20, padding: '8px 0', fontSize: 13, fontWeight: 800, textTransform: 'capitalize', transition: 'all 0.2s', cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="heatmap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ width: '100%', minHeight: 400, paddingTop: 16 }}>
                <MuscleHeatmap sessions={data.sessions} dataExercises={data.exercises} days={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>\n\n      """
    
    content = re.sub(pattern, new_card, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('src/components/ProfileTab.jsx')
