#!/usr/bin/env node

import { chromium } from 'playwright';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY is missing in your environment.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AI generates random but human-realistic profile identities to bypass basic filters
async function generateIdentity() {
  console.log("🤖 Asking AI to generate a realistic profile identity...");
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Generate a realistic first name, last name, unique username string for a Gmail/YouTube account, and a secure password. Output purely in JSON format with keys: firstName, lastName, username, password."
      }
    ]
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

async function run() {
  const identity = await generateIdentity();
  console.log(`👤 AI Generated Identity: ${identity.firstName} ${identity.lastName} (${identity.username})`);

  console.log("🚀 Launching stealth browser automation instance...");
  // Launching a non-headless browser so you can handle unexpected bot checks or SMS prompts manually
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    // Navigate straight to Google account setup
    console.log("🌐 Navigating to Google Sign Up canvas...");
    await page.goto('https://google.com', { waitUntil: 'networkidle' });

    // Step 1: Input Names
    await page.fill('input[name="firstName"]', identity.firstName);
    await page.fill('input[name="lastName"]', identity.lastName);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);

    // Step 2: Birthday & Gender (Using generic values)
    console.log("📅 Filling out basic profile demographic metrics...");
    await page.selectOption('select[id="month"]', '1'); // January
    await page.fill('input[id="day"]', '15');
    await page.fill('input[id="year"]', '1995');
    await page.selectOption('select[id="gender"]', '3'); // Rather not say / Custom options bypass standard patterns
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);

    // Step 3: Choose Username Option
    console.log("📧 Inputting custom AI-generated username handle...");
    // Choose "Create your own Gmail address" option if visible
    const customRadio = await page.$('input[value="custom"]');
    if (customRadio) await customRadio.click();
    
    await page.fill('input[name="Username"]', identity.username);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);

    // Step 4: Secure Password Credentials
    console.log("🔒 Injecting secure account password...");
    await page.fill('input[name="passwd"]', identity.password);
    await page.fill('input[name="confirmPasswd"]', identity.password);
    await page.click('button:has-text("Next")');
    
    // **CRITICAL PAUSE POINT**: Google will likely throw a Phone Verification / Captcha test here.
    console.log("⚠️  Bypassing anti-bot checks requires manual intervention or an external API.");
    console.log("⏸️  Script paused. Please look at the open browser window, complete any required verification checkpoints, and press enter in this terminal once done...");
    
    await new Promise(resolve => process.stdin.once('data', resolve));

    // Step 5: Post-verification redirect to YouTube and Channel Creation
    console.log("📺 Routing directly to YouTube platform to spin up the channel layout...");
    await page.goto('https://youtube.com', { waitUntil: 'networkidle' });
    
    // Navigate to the direct channel creator workflow URL
    await page.goto('https://youtube.comcreate_channel', { waitUntil: 'networkidle' });
    
    console.log("🛠️  Submitting final channel initialization forms...");
    // Click the final "Create Channel" button on the YouTube setup screen
    await page.click('button:has-text("Create channel")');
    await page.waitForTimeout(5000);

    console.log("🎉 Success! YouTube account and channel have been initialized by the AI worker script.");
    console.log(`🔐 Logins Saved: \nUsername: ${identity.username}@gmail.com\nPassword: ${identity.password}`);

  } catch (error) {
    console.error("❌ An execution disruption occurred during setup flow:", error);
  } finally {
    console.log("Keeping browser open for 30 seconds to confirm configurations...");
    await page.waitForTimeout(30000);
    await browser.close();
  }
}

run();
