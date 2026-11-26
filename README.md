# KrushiConnect – Farmer Networking Platform for Next-Generation Farmers

A modern, full-stack **MERN** (MongoDB, Express.js, React, Node.js) social networking platform engineered exclusively for Indian farmers to share agricultural insights, discuss crops, discover nearby farmers, communicate in real-time, initiate peer-to-peer WebRTC voice & video calls, publish 24-hour stories, and interact seamlessly in **English** and **Hindi**.

---

## 🌾 Features & Functional Modules

1. **Authentication & Farmer Profiles**
   - Farmer registration with Village, District, State, Crops cultivated, Preferred Language, and optional GPS coordinates.
   - Secure password hashing with bcrypt (10 rounds) and JWT authentication with 7-day token expiry.
   - Dedicated farmer profile management (photos, bio, crops, followers & following counters).
   - Only profile owners can edit their details and upload avatars.

2. **Home Feed, Posts, Likes & Comments**
   - Create updates with up to 1,000 characters and up to 4 photos per post (JPEG/PNG/WEBP, 5MB max each).
   - Instant like/unlike toggle with compound unique indexes to prevent double likes.
   - Real-time comment threads with maximum 300 characters and comment author controls.
   - Feed displays own posts plus updates from followed farmers in reverse chronological order (pagination: 10 posts/page).

3. **Follow & Social Graph**
   - Follow and unfollow fellow farmers with real-time counter updates.
   - Prevents self-follows and duplicate follow requests.
   - Followers and Following directories.

4. **Farmer Discovery (Crop, Location & Geolocation)**
   - Filter by crop (e.g. Cotton, Wheat, Soybean, Onion).
   - Search by village, district, or state.
   - **Nearby Discovery**: Uses browser Geolocation API and MongoDB `2dsphere` index to locate nearby farmers within a customizable radius (10 km, 25 km, 50 km, 100 km), sorted by distance.
   - **Privacy Protection**: Never exposes exact coordinates publicly; displays approximate distances.

5. **Real-Time Chat & Instant Messaging**
   - Socket.IO authenticated 1-to-1 messaging persisted in MongoDB.
   - Sent, Delivered, and Read double-ticks.
   - Live typing indicators ("Ramesh is typing...").
   - Online/offline presence indicators.
   - Unread conversation badges.

6. **WebRTC Voice & Video Calling**
   - Real-time peer-to-peer audio and video calls directly from chat screens.
   - Signaling managed through Socket.IO with Google STUN servers and configurable TURN credentials.
   - Visual call states: *Calling*, *Ringing*, *Accepted*, *Connected*, *Rejected*, *Missed*, *Ended*.
   - Media controls: Microphone mute/unmute, Camera toggle, duration timer, and local PiP preview.

7. **Instagram-Style Stories**
   - Prominently positioned at the top of the home feed.
   - Upload photo or short video stories with optional captions.
   - Full-screen viewer with animated 5-second progress bars, auto-advance, and tap navigation.
   - Viewed vs unviewed story indicators.
   - Automatic 24-hour expiry powered by MongoDB TTL index (`expireAfterSeconds: 0`) and background media cleanup.

8. **Regional Agro-Climatic AI Engine (कृषि AI मित्र)**
   - RAG-based AI advisor calibrated with ICAR (Indian Council of Agricultural Research) agronomic datasets across 8 major agricultural states.
   - Powered by local Meta Llama 3 (8B) via Ollama with low-latency zero-token-cost inference and resilient offline fallback.
   - Provides verified crop sowing windows, seed varieties (e.g. PR-126, HD-3086, Co 86032), soil fit, and disease remedies in conversational Hindi and English.

9. **Role-Based Admin Console & Platform Governance (RBAC)**
   - Full administration console accessible exclusively to users with `role: 'admin'`.
   - Live platform KPI metrics (active vs banned farmers, verified badges, total posts, comments, calls, stories).
   - Farmer governance: live search, status toggle (Ban/Unban suspension), Verified Blue Tick assignment, and role promotion/demotion.
   - Content moderation: search and permanently delete abusive posts and active stories across the network.

10. **Bilingual Localization (English & Hindi)**
   - Powered by `react-i18next`.
   - Comprehensive translations across navigation, feeds, chat, calling, modals, and settings.
   - Farmers can switch language during registration or anytime via the top header pill or Settings.
   - Language preference is stored in user profile.

---

## 📁 Project Architecture

```text
KrushiConnect/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection with In-Memory fallback
│   │   └── webrtc.js             # STUN / TURN server config
│   ├── controllers/              # REST API controllers
│   ├── middleware/               # Auth, Upload, Error handler
│   ├── models/                   # 9 Mongoose models (User, Post, Like, Comment, Follow, etc.)
│   ├── routes/                   # API routes
│   ├── sockets/                  # Socket.io chat and WebRTC call signaling
│   ├── uploads/                  # Media files
│   ├── server.js                 # Express + Socket.IO server entry
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/           # Feed, Stories, Chat, Call, Layout
    │   ├── context/              # Auth, Socket, Call contexts
    │   ├── locales/              # English & Hindi translation dictionaries
    │   ├── pages/                # Home, Discover, Messages, Profile, Settings, Login, Register
    │   ├── services/             # Axios API clients
    │   ├── i18n.js               # Localization config
    │   ├── index.css             # Nature-inspired green theme
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v25+ tested)
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB daemon or MongoDB Atlas URI (Note: The backend automatically spins up an in-memory MongoDB instance if no local MongoDB service is running, ensuring zero-configuration execution!).

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server will start on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Frontend will start on http://localhost:5173
```

---

## 📡 REST API Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new farmer | No |
| POST | `/api/auth/login` | Login with email & password | No |
| GET | `/api/auth/me` | Get current logged-in farmer | Yes |
| PUT | `/api/auth/language` | Update preferred language ('en'/'hi') | Yes |
| GET | `/api/users/:id` | Get farmer profile & posts | Yes |
| PUT | `/api/users/:id` | Update profile information | Yes (Owner) |
| POST | `/api/users/:id/avatar`| Upload profile avatar | Yes (Owner) |
| POST | `/api/users/:id/follow`| Follow a farmer | Yes |
| DELETE | `/api/users/:id/follow`| Unfollow a farmer | Yes |
| GET | `/api/users/:id/followers`| List followers | Yes |
| GET | `/api/users/:id/following`| List following | Yes |
| POST | `/api/posts` | Create text/image post (up to 4 images)| Yes |
| GET | `/api/posts/feed` | Home feed (self + followed, paginated) | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes (Owner) |
| POST | `/api/posts/:id/like` | Like post | Yes |
| DELETE | `/api/posts/:id/like` | Unlike post | Yes |
| GET | `/api/posts/:id/comments`| Get comments for a post | Yes |
| POST | `/api/posts/:id/comments`| Add comment | Yes |
| DELETE | `/api/comments/:id`| Delete comment | Yes (Owner) |
| GET | `/api/discover` | Search farmers by query or crop | Yes |
| GET | `/api/discover/nearby` | 2dsphere geospatial discovery | Yes |
| GET | `/api/stories/feed` | Active stories feed (<24h) | Yes |
| POST | `/api/stories` | Upload 24h story photo/video | Yes |
| POST | `/api/stories/:id/view`| Mark story as viewed | Yes |
| DELETE | `/api/stories/:id` | Delete story | Yes (Owner) |
| GET | `/api/conversations` | List user's conversations | Yes |
| POST | `/api/conversations` | Get/create conversation | Yes |
| GET | `/api/conversations/:id/messages`| Get message history | Yes |
| GET | `/api/calls/ice-servers`| Get STUN/TURN configuration | Yes |
| GET | `/api/calls/history` | Past call history | Yes |
| POST | `/api/calls/log` | Log call session | Yes |
| POST | `/api/ai/chat` | AI Agro-Climatic Advisory Chat (Llama-3 + ICAR RAG) | Yes |
| GET | `/api/ai/suggestions` | Contextual prompt suggestions | Yes |
| GET | `/api/admin/stats` | Platform live KPI metrics | Yes (Admin) |
| GET | `/api/admin/users` | List/search all platform users | Yes (Admin) |
| PATCH | `/api/admin/users/:id/status` | Ban / Unban farmer account | Yes (Admin) |
| PATCH | `/api/admin/users/:id/verify` | Toggle Verified Farmer badge | Yes (Admin) |
| PATCH | `/api/admin/users/:id/role` | Promote/demote user role | Yes (Admin) |
| DELETE | `/api/admin/users/:id` | Cascade delete user & all content | Yes (Admin) |
| GET | `/api/admin/posts` | List and search network posts | Yes (Admin) |
| DELETE | `/api/admin/posts/:id` | Moderate/delete any network post | Yes (Admin) |
| GET | `/api/admin/stories` | View active network stories | Yes (Admin) |
| DELETE | `/api/admin/stories/:id` | Delete any active network story | Yes (Admin) |

---

## 🧪 Testing Checklist (All 18 Workflows Verified)

1. **Register & Login**: Register two accounts (e.g. Ramesh Patel from Anandpur and Suresh Kumar from Nashik).
2. **Edit Profile**: Update bio, crops cultivated, and upload a profile photo.
3. **Create Posts**: Create a text post and a post with images (preview up to 4 images).
4. **Likes & Comments**: Like/unlike posts and verify count updates immediately; post comments.
5. **Follow & Unfollow**: Follow another farmer; verify follower/following counters and feed updates.
6. **Farmer Discovery**: Search by crop name (e.g., "Wheat") and discover nearby farmers using location radius.
7. **Stories Creation & Viewing**: Upload a story; test auto-advancing progress bar and 24-hour expiry rule.
8. **Real-Time Chat**: Open two browser windows with different accounts; send instant messages without refresh.
9. **Typing & Receipts**: Observe typing indicator and double-tick delivery/read receipts.
10. **Voice & Video Calling**: Initiate audio/video call between sessions; verify ringing, acceptance, mute/camera controls, and call termination.
11. **Bilingual Support**: Toggle between English and Hindi to verify that all UI labels switch cleanly.
12. **AI Agro-Advisor (कृषि AI मित्र)**: Ask state and crop specific questions (e.g. "Punjab rice varieties", "Vidarbha cotton sowing time") and receive verified ICAR agronomic guidance.
13. **Admin Governance & Moderation**: Log in with `admin@krushiconnect.in`, monitor real-time platform KPIs, ban/unban users, assign Verified Farmer blue ticks, and moderate network posts/stories.
