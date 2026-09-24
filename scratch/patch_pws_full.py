import re
import sys

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add activeView state to PostWorkoutSummary
    if 'const [activeView, setActiveView] = useState(' not in content:
        content = content.replace(
            'export default function PostWorkoutSummary({ session, data, onClose, isHistory }) {',
            "export default function PostWorkoutSummary({ session, data, onClose, isHistory }) {\n  const [activeView, setActiveView] = useState('heatmap');"
        )
    
    # 2. Replace the Fatigue Heatmap section with the Toggle section
    # Find the Fatigue Heatmap div block
    old_block_regex = r'<div style=\{\{ marginBottom: 32, display: \'flex\', flexDirection: \'column\'(.*?)Fatigue Heatmap</div>\s*<div style=\{\{ transform:(.*?)</MuscleHeatmap>\s*</div>\s*</div>'
    
    toggle_ui = """<div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)', padding: '16px 0', borderRadius: 24, width: '100%' }}>
          
          {/* Header with Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 300, marginBottom: 16 }}>
            <button onClick={() => setActiveView(activeView === 'heatmap' ? 'radar' : 'heatmap')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}>
              {activeView === 'heatmap' ? 'FATIGUE HEATMAP' : 'MUSCLE VOLUME'}
            </div>
            <button onClick={() => setActiveView(activeView === 'heatmap' ? 'radar' : 'heatmap')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              {activeView === 'heatmap' ? (
                <motion.div key="heatmap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                  <div style={{ transform: 'scale(0.95)', transformOrigin: 'center top', filter: 'drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.15))' }}>
                    <MuscleHeatmap sessions={[session]} dataExercises={data.exercises} ignoreDate={true} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="radar" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radarData}>
                      <PolarGrid stroke="#2A2A2E" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b90a0', fontSize: 11, fontWeight: 700, fontFamily: '"Inter", sans-serif' }} />
                      <Radar name="Sets" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>"""
    
    # Replacing the old block
    content = re.sub(old_block_regex, toggle_ui, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('src/components/PostWorkoutSummary.jsx')
