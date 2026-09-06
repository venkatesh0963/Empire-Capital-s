const fs = require('fs');
const file = 'gameStore.ts';
let content = fs.readFileSync(file, 'utf8');

const marker = `            competitors: updatedCompetitors
          };
        }

        return { time: { ...state.time, year, month, day }, market: marketState, cryptoMarket: cryptoState, commoditiesMarket: comState };`;

const injection = `            competitors: updatedCompetitors,
            activeOpportunities: updatedOpportunities
          };
        }

        return { time: { ...state.time, year, month, day }, market: marketState, cryptoMarket: cryptoState, commoditiesMarket: comState, activeOpportunities: updatedOpportunities };`;

content = content.replace(marker, injection);
fs.writeFileSync(file, content);
console.log('Fixed3!');
