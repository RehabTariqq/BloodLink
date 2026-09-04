# BloodLink

BloodLink is a MERN-stack hospital and blood-bank management platform for managing donors, patients, blood inventory, blood requests, appointments, and hospital staff across multiple hospitals.

## Tech Stack
- MongoDB (Atlas)
- Express.js
- React.js (Vite)
- Node.js

## Project Structure
BloodLink/
│
├── client/                 ← Frontend / React
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                 ← Backend / Node + Express
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md



## Live App
https://bloodlink-s5d7.onrender.com/

## Status
🚧 In active development.
