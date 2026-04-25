# 🚀 EduBag Deployment Guide (Monorepo)

This project consists of three independent services that must be deployed:
1. **Student Frontend**: Next.js (`/frontend`)
2. **Admin Dashboard**: Next.js (`/admin-dashboard`)
3. **Backend API**: Node.js/Express (`/backend`)

---

## 🏗️ Step 1: Push to GitHub
1. Create a new **Private Repository** on GitHub.
2. Push your entire `EduBag` folder to this repository.
   ```bash
   git init
   git add .
   git commit -m "Final production structure"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

---

## 🌐 Step 2: Deploy Backend (Render.com Recommended)
1. Sign in to [Render](https://render.com).
2. Create a **New Web Service**.
3. Connect your GitHub repository.
4. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   - `PORT`: `5000` (or leave default)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_uri`
   - `JWT_SECRET`: `random_strong_string`
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,https://your-admin.vercel.app`
   - `RAZORPAY_KEY_ID`: `your_razorpay_id`
   - `RAZORPAY_KEY_SECRET`: `your_razorpay_secret`

---

## 🎨 Step 3: Deploy Student Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com).
2. **New Project** -> Select the same GitHub repo.
3. **Project Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `your_razorpay_id`
5. **Deploy!**

---

## 🛡️ Step 4: Deploy Admin Dashboard (Vercel)
1. **New Project** in Vercel -> Select the same GitHub repo again.
2. **Project Settings**:
   - **Root Directory**: `admin-dashboard`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
4. **Deploy!**

---

## ⚙️ Step 5: Final Sync (CORS)
Once your Frontend and Admin URLs are live (e.g., `edubag.vercel.app`):
1. Go back to your **Backend (Render)** settings.
2. Update the `ALLOWED_ORIGINS` environment variable to include these real URLs (separated by commas).
3. Restart the Backend service.

---

## 🖥️ Alternative: VPS (PM2)
If using your own server, use the root commands:
1. `npm run install-all`
2. `npm run build-all`
3. Start with PM2:
   ```bash
   cd backend && pm2 start server.js --name edubag-api
   cd ../frontend && pm2 start npm --name edubag-client -- start
   cd ../admin-dashboard && pm2 start npm --name edubag-admin -- start
   ```
