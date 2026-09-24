import re

styles_js_path = 'src/styles.js'
index_css_path = 'src/index.css'

with open(styles_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the CSS template literal
css_part = re.search(r'export const injectGlobalStyles = \(\) => \{\s*const style = document\.createElement\(\'style\'\);\s*style\.innerHTML = `(.*?)`;', content, re.DOTALL)

css_content = css_part.group(1) if css_part else ""

# Extract the styles dictionary
styles_part = re.search(r'export const styles = \{(.*?)\};', content, re.DOTALL)
if styles_part:
    styles_dict_str = styles_part.group(1)
    
    # Very basic parsing, we can convert properties camelCase to kebab-case
    # This is a bit complex due to nested quotes, but we can just use a simple replacer
    
    def camel_to_kebab(name):
        return re.sub(r'(?<!^)(?=[A-Z])', '-', name).lower()
        
    lines = styles_dict_str.split('\n')
    for line in lines:
        line = line.strip()
        if not line or line.startswith('//'): continue
        
        match = re.match(r'([a-zA-Z0-9_]+):\s*\{(.*?)\},?', line)
        if match:
            class_name = match.group(1)
            props_str = match.group(2)
            
            # split props
            props = []
            current_prop = ""
            in_quotes = False
            for char in props_str:
                if char in ('"', "'"):
                    in_quotes = not in_quotes
                if char == ',' and not in_quotes:
                    props.append(current_prop.strip())
                    current_prop = ""
                else:
                    current_prop += char
            if current_prop:
                props.append(current_prop.strip())
                
            css_rules = []
            for prop in props:
                if not prop: continue
                parts = prop.split(':', 1)
                if len(parts) == 2:
                    k = parts[0].strip()
                    v = parts[1].strip().strip('"').strip("'")
                    css_rules.append(f"  {camel_to_kebab(k)}: {v};")
                    
            css_content += f"\n\n.{class_name} {{\n" + "\n".join(css_rules) + "\n}"

with open(index_css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Created index.css")
