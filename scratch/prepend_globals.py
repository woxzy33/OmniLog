import os

global_css = """
:root {
  --bg-main: #090A0C;
  --primary: #007AFF;
  --primary-light: #00C6FF;
  --primary-alt: #00F0FF;
  --primary-rgb: 0,122,255;
  --beta-bg: rgba(0, 122, 255, 0.2);
  --beta-color: #00F0FF;
  --beta-border: rgba(0, 240, 255, 0.5);
}
[data-theme="orange"] {
  --bg-main: #0C0805;
  --primary: #FF5A00;
  --primary-light: #FF8A00;
  --primary-alt: #FFB300;
  --primary-rgb: 255,90,0;
  --beta-bg: rgba(255, 138, 0, 0.2);
  --beta-color: #FF8A00;
  --beta-border: rgba(255, 138, 0, 0.5);
}

* { box-sizing: border-box; }
body { 
  margin: 0; 
  background: var(--bg-main); 
  color: #e2e2e2;
  -webkit-tap-highlight-color: transparent; 
  font-family: 'Inter', sans-serif;
}
input { transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
input:focus { outline: none; box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.3); }
button { cursor: pointer; font-family: inherit; }

/* Smooth Scrollbar */
::-webkit-scrollbar { width: 0px; background: transparent; }

.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Recharts custom tooltip liquid styling */
.custom-tooltip {
  background: rgba(18, 18, 20, 0.75) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
  padding: 12px 16px !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
}
"""

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(global_css + "\n" + css)

print("Prepended global CSS.")
