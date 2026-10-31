# AI YouTube Account Setup Automation 🤖📺

A secure browser orchestration tool running Playwright that allows an AI model to generate humanlike identity characteristics and use them to launch a brand new verified YouTube channel workspace.

## Prerequisites

1. Install target runtime systems:
   ```bash
   npm install
   ```
2. Fetch browser binary frameworks needed by Playwright:
   ```bash
   npx playwright install chromium
   ```
3. Populate your `.env` configuration template file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

## Execution Sequence

Kick off the registration sequence:
```bash
node index.js
```
The browser window will slide open autonomously. Because Google tightly polices account automation, **the script will temporarily pause at the Phone/SMS validation window**. Clear the security prompt inside the open window manually, press **Enter** inside your running CLI prompt, and the script will automatically finish building out your custom YouTube ecosystem layout.
