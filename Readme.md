# ⚡ File Share App

A simple real-time file-sharing application built with **React**, **Node.js**, and **Socket.IO**. Share any type of file (images, videos, documents, etc.) seamlessly on a single machine via local network sockets.

---

## 🌐 Live Deployment

- 🔧 **Backend**: Deployed on [Render.com](https://render.com)  
  ➤ [https://file-transfer-joez.onrender.com](https://file-transfer-joez.onrender.com)

- 💻 **Frontend**: Deployed on [Vercel](https://vercel.com)  
  ➤ [https://file-transfer-client-ten.vercel.app](https://file-transfer-client-ten.vercel.app)

## 🚀 Features

- 📦 **Real-time File Transfer**: Share files instantly between sender and receiver.
- 📊 **Progress Tracking**: Displays live progress percentage for each file.
- 🧠 **Supports All File Types**: Upload and transfer any type of file (images, PDFs, videos, etc.).
- 🔌 **WebSocket Powered** – Peer-to-peer style file transfer using `Socket.IO`

---

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Socket.IO
- **Hosting**: Vercel(Frontend) + Render(Backend)

---

## 📌 Limitations & Future Scope

- 🔐 No backend authentication — login and user management not implemented yet.
- 📁 Single File Transfer - Only one file can be sent at a time. No file queue or batch support yet.
- 🔌 No Recovery on Disconnect -  If sender/receiver disconnects during a transfer, the process is interrupted, and the file is lost.
- 📱 Mobile Responsiveness - 	Currently optimized for desktop view. UI improvements needed for mobile and tablet devices.


## 🧪 Usage

### Run Backend (Socket.IO Server)

- cd backend
- npm install
- npm start

### Run Frontend

- cd client
- npm install
- npm run dev