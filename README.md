# 🕵️ PolicyPal

*"ME PRESS BUTTON. FIND PRIVACY LIES."*  
— Ancient Internet Wisdom, circa 2025

PolicyPal is your digital spear 🗡️ for hunting updates in privacy policies across your favorite data-hoarding platforms.

Except now...  
There **is no button.**  
The machine awakens **every 15 minutes.**  
Silently.  
Efficiently.  
Like a paranoid squirrel with root access.

* * *

## 💡 What It Does

🧠 Scrapes privacy policies from surveillance-heavy platforms  
🔍 Compares current vs previous snapshots  
📝 Re-summarizes with GPT-4o **only when something changes**  
📁 Stores raw policies and summaries in `.txt` files  
📦 Serves clean Markdown summaries to a React frontend  
🕒 Auto-updates every 15 minutes (**no cron job**, no clicky rituals)

* * *

## ✨ Why This Exists

Because privacy policies are legal obfuscation in Helvetica.  
Because your data shouldn't be fuel for the ad gods.  
Because your inner caveman deserves automated vigilance.

* * *

## 🔧 Setup

**Backend:** Node.js + Express + Puppeteer + OpenAI  
**Frontend:** Vite + React (hosted on Vercel)  
**Deployment:**

- Backend: Railway
    
- Frontend: Vercel
    

**Environment Variable:**

`OPENAI_API_KEY=sk-...`

**Run It Locally:**

`npm install npm start`

* * *

## 🕸️ Tracked Platforms

PolicyPal currently watches the watchers at:

- Facebook
    
- Instagram
    
- X (formerly Twitter, now just entropy)
    
- LinkedIn
    
- Snapchat
    
- TikTok
    
- Google
    
- Reddit
    
- Pinterest
    
- WhatsApp
    

**Want to monitor more?**  
Just drop the URL into the `urls` array in `index.js`.  
That's it.  
**It will begin watching.** 👁️

* * *

## 🧠 How Smart Is It?

✅ **Snapshot-aware** – Re-summarizes only when content changes  
✅ **Hardcoded titles** – No slug soup, just names you recognize  
✅ **Buttonless** – Frontend pulls straight from the latest `.txt` summaries  
✅ **SetInterval Overlord** – Scrapes every 15 mins, rain or shine

* * *

## ⚠️ Disclaimer

Not legal advice.  
Not compliance advice.  
Not even *advice*, really.  
Just **vibes**, surveillance of the surveillance, and Markdown.

* * *

## 🪓 Special Thanks

🦴 Neanderthal brain for loving button presses  
🧠 OpenAI for decoding corporate bullshit  
💻 Railway + Vercel for painless deploys  
💡 Curiosity, caffeine, and mild distrust of all Terms & Conditions

* * *

Built in 2025.  
By humans.  
**For humans.**  
The button presses itself now.  
Sleep easy. Or don't.