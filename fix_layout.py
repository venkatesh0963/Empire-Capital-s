import sys

with open('src/components/Layout.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "const [showBillionaire, setShowBillionaire] = useState(false);",
    "const [showBillionaire, setShowBillionaire] = useState(false);\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"
)

text = text.replace(
    '<div className="flex h-screen bg-brand-bg text-brand-text font-sans overflow-hidden relative">',
    '''<div className="flex h-screen bg-brand-bg text-brand-text font-sans overflow-hidden relative">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-brand-surface border-b border-black/5 z-50 flex items-center justify-between px-4">
         <h1 className="text-lg font-bold text-brand-text tracking-widest">EMPIRE CAPITAL</h1>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-brand-muted hover:text-brand-text">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
         </button>
      </div>'''
)

text = text.replace(
    '<aside className="w-64 bg-brand-surface border-r border-black/5 flex flex-col z-10 shadow-2xl">',
    '<aside className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out w-64 bg-brand-surface border-r border-black/5 flex flex-col z-40 shadow-2xl`}>'
)

text = text.replace(
    'onClick={() => setView(item.id)}',
    'onClick={() => { setView(item.id); setMobileMenuOpen(false); }}'
)

text = text.replace(
    '<main className="flex-1 relative z-0">',
    '<main className="flex-1 relative z-0 pt-16 md:pt-0 overflow-y-auto w-full">'
)

with open('src/components/Layout.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Mobile responsiveness added to Layout.tsx")
