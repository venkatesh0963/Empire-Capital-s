import os
import re

def replace_in_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # We can just use regex to replace Intl.NumberFormat('en-US', { ... }).format(value)
                # Regex to match the options object loosely
                pattern = r"new Intl\.NumberFormat\('en-US',\s*\{[^}]*\}\)\.format\(value\)"
                replacement = "new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value)"
                
                new_content = re.sub(pattern, replacement, content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Updated {path}')

replace_in_dir('src')
