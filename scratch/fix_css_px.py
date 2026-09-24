import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Properties that shouldn't get px
unitless_props = {'font-weight', 'z-index', 'opacity', 'flex', 'line-height'}

def replacer(match):
    prop = match.group(1).strip()
    val = match.group(2).strip()
    
    # Simple fix for just single numbers (since JS allowed { width: 480 })
    # We will regex replace any standalone number that isn't 0 and isn't inside a calc() or env() or rgba()
    # Actually, the safest way is to split by spaces and check
    
    if prop not in unitless_props:
        # replace standalone digits (e.g. 480, 24) with digits + px
        # only if they are not surrounded by letters/functions and not '0'
        # lookbehind for space, colon, or start
        # lookahead for space, semicolon, or end
        def digit_replacer(m):
            v = m.group(1)
            if v == "0": return v
            return v + "px"
            
        # We need to be careful with things like rgba(0,0,0,0.5)
        # We can temporarily hide rgba/calc/env/linear-gradient
        hidden = []
        def hide(m):
            hidden.append(m.group(0))
            return f"__HIDDEN_{len(hidden)-1}__"
            
        val = re.sub(r'(rgba?|calc|env|linear-gradient|var)\([^)]*\)', hide, val)
        val = re.sub(r'(?<![a-zA-Z\d\.\-])(\d+(?:\.\d+)?)(?![a-zA-Z\d\.%])', digit_replacer, val)
        
        # unhide
        for i, h in enumerate(hidden):
            val = val.replace(f"__HIDDEN_{i}__", h)

    return f"{prop}: {val};"

new_css = re.sub(r'([a-zA-Z\-]+)\s*:\s*([^;]+);', replacer, css)

# Fix webkit prefixes that were lowercased
new_css = new_css.replace('webkit-', '-webkit-')

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

print("Fixed CSS px and webkit prefixes.")
