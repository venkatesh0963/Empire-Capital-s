import sys

with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Restore deleted lines from fuzzy match fail
# We know the file starts with imports, then interfaces, then states, then store.
# Wait, let's just get the git history if we can.
import subprocess
try:
    subprocess.check_call(["git", "checkout", "gameStore.ts"])
    print("Checked out from git successfully!")
except Exception as e:
    print("Git checkout failed", e)
