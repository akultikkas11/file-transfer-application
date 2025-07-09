# ⚡ File Share App

A simple real-time file-sharing application built with **React**, **Node.js**, and **Socket.IO**. Share any type of file (images, videos, documents, etc.) seamlessly on a single machine via local network sockets.

---

## 🚀 Features

- 📦 **Real-time File Transfer**: Share files instantly between sender and receiver.
- 📊 **Progress Tracking**: Displays live progress percentage for each file.
- 🧠 **Supports All File Types**: Upload and transfer any type of file (images, PDFs, videos, etc.).
- 💡 **No Cloud Dependency**: Peer-to-peer style file sharing using sockets (ideal for offline/local use).

---

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Socket.IO

---

## 📌 Limitations & Future Scope

- 🔐 No backend authentication — login and user management not implemented yet.
- 🖥️ Currently works only on the **same PC** or **local network**.

- 🌐 **Future Improvements:**
  - Support for internet-based transfers (across networks)
  - File history
  - User authentication

---

## 🧪 Usage

### Run Backend (Socket.IO Server)

- cd backend
- npm install
- npm start

### Run Backend (Socket.IO Server)

- cd client
- npm install
- npm run dev