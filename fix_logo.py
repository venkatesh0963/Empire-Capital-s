import sys

with open('src/components/LandingPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('EMPIRE<br/>CAPITAL', "EMPIRE<br/>CAPITAL'S")

with open('src/components/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/Layout.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('EMPIRE<br/>CAPITAL', "EMPIRE<br/>CAPITAL'S")
text = text.replace('EMPIRE CAPITAL', "EMPIRE CAPITAL'S")

with open('src/components/Layout.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated logos')
