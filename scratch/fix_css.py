import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace("Outfit',", "'Outfit',")
css = css.replace("JetBrains Mono',", "'JetBrains Mono',")
css = css.replace("Inter',", "'Inter',")

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Fixed CSS quotes.")
