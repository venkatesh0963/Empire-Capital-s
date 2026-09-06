import sys
with open('Layout.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
text = text.replace(
    "import { useGameStore } from '@/store/gameStore';",
    "import { useGameStore } from '@/store/gameStore';\nimport { Smartphone } from './Smartphone';\nimport { Smartphone as PhoneIcon } from 'lucide-react';"
)

# 2. State
text = text.replace(
    "  const { time, player, togglePause, setSpeed } = useGameStore();",
    "  const { time, player, togglePause, setSpeed, togglePhone, inbox, isPhoneOpen } = useGameStore();\n  const unreadCount = inbox?.filter(e => !e.isRead).length || 0;"
)

# 3. Add FAB at the end before </div>
# Finding the final closing tags is easiest by replacing "    </div>\n  );\n}\n"
fab_injection = """
      {/* Floating Smartphone Button */}
      <button 
         onClick={togglePhone}
         className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-brand-blue text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 ${isPhoneOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
         <PhoneIcon size={28} />
         {unreadCount > 0 && (
            <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-brand-bg animate-pulse">
               {unreadCount}
            </div>
         )}
      </button>

      <Smartphone />
    </div>
  );
}
"""
text = text.replace("    </div>\n  );\n}", fab_injection)

with open('Layout.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Layout.tsx!")
