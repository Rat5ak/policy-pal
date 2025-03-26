# 🕵️ PolicyPal

**"ME PRESS BUTTON. FIND PRIVACY LIES."**  
– Ancient Internet Wisdom, circa 2025

PolicyPal is a tool for **monitoring and summarizing privacy policies** from your favorite data-hungry platforms.

You click a single button. It scrapes all the big sites.  
If anything has changed? Boom. You get the new summaries.  
If not? You still feel important.

* * *

## 💡 What It Does

- 🧠 Scrapes privacy policies from the most-used social platforms
    
- 🔍 Checks for changes since the last run
    
- 📝 If changed, re-generates a fancy AI summary using GPT-4o
    
- 📁 Saves everything in `.txt` files on the backend
    
- 🚨 You press the “Scrape Now” button and feel powerful
    
- 💬 React frontend displays the latest summaries
    
- 🕒 Optional cron job on Railway runs every 6 hours (so it works even when you’re asleep or distracted by a shiny rock)
    

* * *

## ✨ Why This Exists

Because reading privacy policies is hell.  
Because clicking buttons feels good.  
Because the line between caveman and cybersecurity researcher is thinner than we think.

* * *

## 🔧 Setup

1.  Backend: Node.js + Express + Puppeteer + OpenAI
    
2.  Frontend: Vite + React (hosted on Vercel)
    
3.  Deployment:
    
    - Backend: Railway
        
    - Frontend: Vercel
        
4.  Environment: Add your `OPENAI_API_KEY` in a `.env` file like:
    
    OPENAI_API_KEY=sk-...
    
5.  Run it:
    
    npm install  
    npm start
    

* * *

## 🕸️ Scraped URLs

We currently track privacy policies from:

- Meta (Facebook + Instagram)
    
- X (formerly Twitter, now just sadness)
    
- LinkedIn
    
- Snap
    
- TikTok
    
- Google
    
- Reddit
    
- Pinterest
    
- WhatsApp
    

Want to add more? Add URLs to the `urls` array in `index.js` and hit the button like the mighty ancestor you are.

* * *

## 🧠 Fun Facts

- The button does *not* blindly re-scrape every time.
    
- It uses snapshot diffs. If nothing changed, nothing regenerates.
    
- That means it's smart, but still lets you feel like a legend for clicking a thing.
    

* * *

## ⚠️ Disclaimer

This is not legal advice. It’s not even good advice.  
It’s a vibes-only service for keeping an eye on who's watching you.

* * *

## 🪓 Special Thanks

- 🦍 Human muscle memory
    
- 🦴 The need to feel in control
    
- 🤖 GPT for decoding corporate legalese into something digestible
    

* * *

Built with rage, curiosity, and excessive caffeine.  
**YOU PRESS BUTTON. DATA YIELD. WORLD SAFE.**