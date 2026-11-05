# 🚀 Render Deployment Guide for MedSupply

This guide walks you through deploying **MedSupply** on [Render](https://render.com) for **100% free hosting**.

The repository is pre-configured with a Render Blueprint file (`render.yaml`), enabling complete one-click deployment for both the backend API and frontend React client.

---

## 📋 Overview of Deployed Architecture

| Service | Type | Plan | Build Command | Start Command | Directory |
|---|---|---|---|---|---|
| **`medsupply-api`** | Web Service (Node.js) | Free | `npm install` | `node server.js` | `backend` |
| **`medsupply-web`** | Static Site | Free | `npm install && npm run build` | *Static CDN* (`dist`) | `frontend` |

*Note: Render's In-Memory Data Store fallback ensures the application runs immediately without requiring a remote MongoDB instance. If you have MongoDB Atlas, you can optionally provide `MONGODB_URI` in the environment variables.*

---

## ⚡ Method 1: One-Click Deploy via Render Blueprint (Recommended)

1. **Sign in to Render:**
   - Go to [dashboard.render.com](https://dashboard.render.com/) and sign in with your GitHub account.

2. **Create New Blueprint:**
   - In the top right corner of the dashboard, click **"New +"** and select **"Blueprint"** (or visit [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)).

3. **Connect Repository:**
   - Under **Connect a repository**, select `mohansaibolagani/Med_Supply`.
   - If not listed, click **"Configure account"** to grant Render access to your `Med_Supply` repository.

4. **Review & Apply:**
   - Render will automatically detect `render.yaml` at the root of the repository.
   - Enter a **Blueprint Name** (e.g., `medsupply-production`).
   - Click **"Apply"**.

5. **Deployment:**
   - Render will automatically provision both:
     - `medsupply-api` (Backend Express Web Service)
     - `medsupply-web` (Frontend Static Site)
   - Once the build succeeds, click on `medsupply-web` to access your live production URL (e.g., `https://medsupply-web.onrender.com`).

---

## 🛠️ Method 2: Manual Service Creation on Render

If you prefer to configure the services manually on Render instead of using the Blueprint:

### Step 1: Deploy Backend Web Service (`medsupply-api`)
1. Click **"New +"** -> **"Web Service"**.
2. Connect `mohansaibolagani/Med_Supply`.
3. Set the following fields:
   - **Name:** `medsupply-api`
   - **Region:** Any (e.g., Oregon or Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
4. Expand **Environment Variables** and add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: *(Enter any secret random string or click generate)*
   - `CLIENT_URL`: `*`
   - *(Optional)* `MONGODB_URI`: *(Leave empty for resilient in-memory mode or paste your MongoDB Atlas connection string)*
5. Click **"Create Web Service"**.
6. Note down your backend URL (e.g., `https://medsupply-api.onrender.com`).

---

### Step 2: Deploy Frontend Static Site (`medsupply-web`)
1. Click **"New +"** -> **"Static Site"**.
2. Connect `mohansaibolagani/Med_Supply`.
3. Set the following fields:
   - **Name:** `medsupply-web`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://medsupply-api.onrender.com/api` *(replace with your actual backend URL from Step 1)*
5. In the left navigation, open **"Redirects/Rewrites"** and add:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
6. Click **"Create Static Site"**.

---

## 🔍 Verification & Testing on Live Render

Once both services show **"Live"**:
1. Open the frontend static site URL in your browser.
2. The unmuted intro video will play on your first visit (with 1-click skip/enter).
3. The role selection dialog ("Who are you today?") will appear.
4. Try logging in using any of the quick **Demo Accounts** on the Login modal (Donor, Patient, or Admin).
5. Post an emergency blood request or reserve equipment to verify real-time data persistence.
