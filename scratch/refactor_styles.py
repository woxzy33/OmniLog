import os
import re
import glob

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        encoding_used = 'utf-8'
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
        encoding_used = 'utf-16'

    # Replace style={styles.xyz} -> className="xyz"
    content = re.sub(r'style=\{styles\.([a-zA-Z0-9_]+)\}', r'className="\1"', content)

    # Replace style={{ ...styles.xyz, foo: "bar" }} -> className="xyz" style={{ foo: "bar" }}
    content = re.sub(r'style=\{\{\s*\.\.\.styles\.([a-zA-Z0-9_]+),\s*(.*?)\}\}', r'className="\1" style={{ \2 }}', content)
    
    with open(filepath, 'w', encoding=encoding_used) as f:
        f.write(content)

for filepath in glob.glob('src/**/*.jsx', recursive=True):
    process_file(filepath)

print("Refactored styles in JSX files.")
