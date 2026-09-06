const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const impl = `      expandBusiness: (id: string, cost: number) => {
         const state = get();
         const biz = state.business.ownedBusinesses.find(b => b.id === id);
         if (biz && state.player.cash >= cost) {
            set({
               player: { ...state.player, cash: state.player.cash - cost },
               business: {
                  ...state.business,
                  ownedBusinesses: state.business.ownedBusinesses.map(b => 
                     b.id === id ? { ...b, level: (b.level || 1) + 1 } : b
                  )
               }
            });
            return true;
         }
         return false;
      },
`;

text = text.replace('fireEmployee: (id) => set((state)', impl + '      fireEmployee: (id) => set((state)');
fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Injected expandBusiness impl');
