# 🕵️ PolicyPal

*"ME PRESS BUTTON. FIND PRIVACY LIES."*  
– Ancient Internet Wisdom, circa 2025

**PolicyPal** is your digital spear for hunting down changes in privacy policies from your favorite data-hoarding platforms.

Except now...  
There is no button.  
The machine just runs.  
Every 15 minutes.  
Silently.  
Efficiently.  
Like a paranoid squirrel with root access.

* * *

## 💡 What It Does

🧠 **Scrapes** privacy policies from the biggest platforms  
🔍 **Checks for changes** using snapshot comparison  
📝 **Re-generates summaries** using GPT-4o **only when needed**  
📁 **Stores summaries** and raw snapshots as `.txt` files  
🌐 **Serves summaries** via API to a React frontend  
🕒 **Auto-updates** every 15 minutes (no button smashing needed anymore)

* * *

## ✨ Why This Exists

- Because privacy policies are a wall of legal sadness
    
- Because you *should* know who’s watching
    
- Because your inner caveman deserves dignity and **automated surveillance of the surveillance**
    

* * *

## 🔧 Setup

**Backend**: Node.js + Express + Puppeteer + OpenAI  
**Frontend**: Vite + React (hosted on Vercel)  
**Deployment**:

- Backend: [Railway](https://railway.app)
    
- Frontend: [Vercel](https://vercel.com)
    

**Environment Vars**:

`OPENAI_API_KEY=sk-...`

Run it:

`npm installnpm start`

* * *

## 🕸️ Tracked Platforms

We currently monitor policies from:

- **Facebook**
    
- **Instagram**
    
- **X (Twitter)**
    
- **LinkedIn**
    
- **Snapchat**
    
- **TikTok**
    
- **Google**
    
- **Reddit**
    
- **Pinterest**
    
- **WhatsApp**
    

Wanna add more?  
Open `index.js`, chuck it in the `urls` array, and that’s it.  
No deploy button. It’ll start monitoring like the little daemon it is.

* * *

## 🧠 How Smart Is It?

- ✅ **Snapshot-aware**: Only scrapes and re-summarizes if something has changed.
    
- ✅ **Hardcoded titles**: No weird slugs or gibberish. Just clean names like “Google” and “Facebook.”
    
- ✅ **No frontend button anymore**: Summaries auto-load from existing `.txt` files.
    
- ✅ **Runs on a timer**: 15-minute scraping interval like clockwork. 
    

* * *

## ⚠️ Disclaimer

This is not legal advice.  
It’s not even good advice.  
It’s a VIBES-ONLY SERVICE for sniffing corporate behavior.

* * *

## 🪓 Special Thanks

🦍 Human muscle memory  
🧠 GPT for making legalese sound readable  
🛠️ Railway + Vercel for making deploys feel like magic  

* * *

Built with spite, curiosity, caffeine, and a small amount of dignity.  
**You don’t press the button anymore. The button presses *itself*.**