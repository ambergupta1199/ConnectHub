# 🌐 ConnectHub

ConnectHub is a **real-time chat and video calling application**.  
It allows users to connect with friends, chat in real time, and practice their communication skills and learn new languages also through video calls.  

With support of Stream, ConnectHub provides an engaging and scalable communication experience.  

---

## ✨ Features

- 🔑 **User Authentication & Onboarding**  
  - Sign up & login with secure **JWT-based authentication**  
  - Guided profile completion (onboarding)  

- 💬 **Real-Time Chat System**  
  - One-on-one and group chat  
  - Message reactions (👍 ❤️ 😂 etc.)  
  - Typing indicators  
  - Read receipts & online status    
  - Image & file uploads  

- 📹 **Video Calling**  
  - One-on-one or group calls  
  - Screen sharing  
  - In-call reactions  
  - Call recording  
  - Invite friends via shareable links  

- 🌍 **Enhancing Communication Skills**  
  - Practice real-time conversations with global users  
  - Video + chat combined for learning languages interactively  

- 🎨 **Customizable UI**  
  - Can select 20+ different themes from theme store  

---

## 🛠️ Tech Stack

**Frontend**  
- ⚛️ [React](https://reactjs.org/) — Component-based UI  
- 🎯 [TanStack Query](https://tanstack.com/query) — Server-state management  

**Backend**  
- 🟢 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — REST API backend  
- 🍃 [MongoDB](https://www.mongodb.com/) — NoSQL database for user & message storage  
- 🔐 JSON Web Tokens (JWT) — Secure authentication system  

**Real-Time & Video**  
- 🔥 [Stream](https://getstream.io/) — Scalable chat infrastructure  
- 🎥 Functionality of Video calling, screen sharing, and recording

---
## 🧪 .env Setup

### Backend (`/backend`)

```
PORT=5001
MONGO_URI=your_mongo_uri
STEAM_API_KEY=your_steam_api_key
STEAM_API_SECRET=your_steam_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

### Frontend (`/frontend`)

```
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```
