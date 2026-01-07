---
description: Run the AI Invoice Generator project locally and deploy to Vercel
---

# Run and Deploy AI Invoice Generator

This workflow outlines the steps to run the full-stack application locally and deploy it to Vercel.

## 1. Run Locally

You need to run the backend and frontend in separate terminal instances or tabs.

### Backend Setup & Run

1.  Open a terminal.
2.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    *The server will start on port 8000 (specified in your `.env` file).*

### Frontend Setup & Run

1.  Open a **new** terminal.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend/invoice-generator
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open the URL shown (usually `http://localhost:5173`) in your browser.

## 2. Make Live (Deploy to Vercel)

The presence of `vercel.json` indicates this project is configured for Vercel.

1.  Open a terminal in the root directory (`/Users/apple/Desktop/FINALL YEAR PROJECT/Other Project/ai-invoice-generator-main`).
2.  Install Vercel CLI (if not already installed):
    ```bash
    npm install -g vercel
    ```
3.  Login to Vercel:
    ```bash
    vercel login
    ```
4.  Deploy:
    ```bash
    vercel
    ```
    *   Follow the prompts.
    *   Accept default settings mostly, but ensure:
        *   Root Directory is `./` (current).
        *   It detects `vercel.json` configuration.

5.  **Environment Variables**:
    *   You MUST add your environment variables (`SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY`) to the Vercel project settings via the Vercel dashboard or CLI (`vercel env add`).

6.  Deploy to Production:
    ```bash
    vercel --prod
    ```
