import re

with open('src/store/gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(
    r'resetGame:\s*\(\)\s*=>\s*set\(\{',
    '''resetGame: () => {
        localStorage.removeItem('hasStartedSession');
        window.location.reload();
        set({''',
    text
)

text = re.sub(
    r"headline:\s*'Welcome to Empire Builder! You have been granted \$100,000 to start your journey.',\s*type:\s*'positive'\s*\}\]\s*\}\),",
    "headline: 'Welcome to Empire Builder! You have been granted $100,000 to start your journey.', type: 'positive' }]\\n      });\\n      },",
    text
)

with open('src/store/gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Regex fixed')
