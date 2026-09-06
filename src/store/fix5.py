import sys
with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Fix resetGame missing earnouts and cityBuildings
marker_reset = "realEstate: { marketListings: initialProperties, ownedProperties: [] },"
text = text.replace(marker_reset, "realEstate: { marketListings: initialProperties, ownedProperties: [], cityBuildings: [] },")

marker_reset_biz = "business: { ownedBusinesses: [] },"
text = text.replace(marker_reset_biz, "business: { ownedBusinesses: [], earnouts: [] },")

# Fix business updates missing earnouts
# e.g. set((state) => ({ business: { ownedBusinesses: ... } }))
# We can use regex to inject ...state.business,
text = re.sub(r"business: \{ ownedBusinesses: (.*?) \}", r"business: { ...state.business, ownedBusinesses: \1 }", text)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Fixed resetGame and business updates!")
