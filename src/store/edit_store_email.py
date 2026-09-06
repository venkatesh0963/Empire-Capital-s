import sys
with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Interface Additions
interface_injection = """export interface Email {
  id: string;
  date: string;
  sender: string;
  subject: string;
  body: string;
  isRead: boolean;
}

"""
text = text.replace("export interface GameState {", interface_injection + "export interface GameState {")

text = text.replace(
    "  founder: { playerStartups: PlayerStartup[] };",
    "  founder: { playerStartups: PlayerStartup[] };\n  inbox: Email[];\n  isPhoneOpen: boolean;"
)

text = text.replace(
    "  resetGame: () => void;",
    "  resetGame: () => void;\n  togglePhone: () => void;\n  markEmailRead: (id: string) => void;"
)

# 2. State Initialization
text = text.replace(
    "founder: { playerStartups: [] },",
    "founder: { playerStartups: [] }, inbox: [{ id: 'welcome_email', date: 'Y1 M1 D1', sender: 'Victor King', subject: 'Welcome to the big leagues', body: 'I heard you just got $100,000 in seed capital. Don\\'t lose it all in one place. If you ever want to sell a company, give me a call.', isRead: false }], isPhoneOpen: false,"
)

# 3. Actions
actions_injection = """
      togglePhone: () => set((state) => ({ isPhoneOpen: !state.isPhoneOpen })),
      markEmailRead: (id) => set((state) => ({ inbox: state.inbox.map(e => e.id === id ? { ...e, isRead: true } : e) })),

      foundStartup:"""
text = text.replace("      foundStartup:", actions_injection)

# 4. advanceDay email logic
email_logic = """
        // --- INBOX EVENTS ---
        let updatedInbox = [...(state.inbox || [])];
        if (Math.random() < 0.05) { // 5% chance daily for an email
           const emailTemplates = [
              { sender: 'Apex Bank', subject: 'Credit Limit Increase', body: 'Congratulations. Based on your recent account history, we have pre-approved you for a higher commercial credit limit.' },
              { sender: 'Sophia Morgan', subject: 'Real Estate Tip', body: 'I just passed on a commercial property downtown. It needs work, but you might want to look into it before it goes public.' },
              { sender: 'VP of Sales', subject: 'Quarterly Projections', body: 'We are tracking slightly ahead of our quarterly projections. If the economy holds up, we should see a record month.' },
              { sender: 'Daniel Stone', subject: 'Market Rumors', body: 'I heard you were looking to expand. Be careful, the logistics sector is getting crowded.' }
           ];
           const tmpl = emailTemplates[Math.floor(Math.random() * emailTemplates.length)];
           updatedInbox.unshift({
              id: `email_${Date.now()}`,
              date: `Y${year} M${month} D${day}`,
              sender: tmpl.sender,
              subject: tmpl.subject,
              body: tmpl.body,
              isRead: false
           });
           
           if (updatedInbox.length > 50) updatedInbox.pop();
        }
"""
text = text.replace("        // --- MONTHLY ECONOMY SHIFTS ---", email_logic + "\n        // --- MONTHLY ECONOMY SHIFTS ---")

# 5. return hook
text = text.replace(
    "founder: { playerStartups: updatedPlayerStartups },",
    "founder: { playerStartups: updatedPlayerStartups },\n            inbox: updatedInbox,"
)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated gameStore with email logic!")
