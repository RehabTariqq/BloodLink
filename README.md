#  BloodLink

BloodLink is a MERN-stack hospital & blood-bank management platform. It gives hospitals, blood banks, medical staff, and donors one system to manage donor records, blood inventory, donations, blood requests, and appointments — with role-based access control and an audit trail.

**🔗 Live :** [bloodlink-s5d7.onrender.com](https://bloodlink-s5d7.onrender.com/)

---

## Features

- **Auth & RBAC** — JWT login, 7 user roles, passcode-gated staff registration, account status checks
- **Donor management** — profiles, blood group, eligibility status, donation history
- **Donation tracking** — record donations with unique blood bag IDs and expiry dates
- **Inventory management** — blood units move through `quarantined → available → issued/expired`, with a live summary view
- **Blood requests** — doctors/nurses raise requests, staff review and fulfill them by issuing specific units
- **Hospital management** — multi-hospital support with an approval workflow
- **Appointments** — donors book donation slots; staff approve/manage them
- **Notifications** — per-user alerts for requests, appointments, and low inventory
- **Blood compatibility lookup** — donor/recipient matching for all 8 blood groups
- **Dashboard & reports** — key stats: available units, expiring soon, pending/emergency requests
- **Audit logs** — action-level trail for admin oversight

## Tech Stack

**Frontend:** React 19, Vite, React Router 7, Axios

**Backend:** Node.js, Express 4, MongoDB + Mongoose 8, JWT, bcryptjs

**Deployment:** Render

## Project Structure

```
BloodLink/
├── client/                  # React (Vite) frontend
│   └── src/
│       ├── context/         # Auth state
│       ├── services/        # API calls (Axios)
│       ├── layouts/         # Public & dashboard layouts
│       ├── components/      # Shared UI (Navbar, etc.)
│       └── pages/           # Route-level pages
│
├── server/                  # Express + MongoDB backend
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # User, Hospital, Donor, BloodDonation,
│   │                         # BloodUnit, BloodRequest, Appointment,
│   │                         # Notification, AuditLog
│   ├── controllers/         # Route logic per resource
│   ├── routes/              # Express routers per resource
│   ├── middleware/          # JWT auth + role-based access
│   └── utils/               # Token generation, helpers
│
└── README.md
```

## Getting Started

**Requirements:** Node.js 18+, npm, a MongoDB connection string ([Atlas](https://www.mongodb.com/atlas) or local)

```bash
git clone https://github.com/RehabTariqq/BloodLink.git
cd BloodLink

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

**`server/.env`**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
STAFF_PASSCODE=your_staff_registration_passcode
```

**`client/.env`** *(optional — defaults to `http://localhost:5000/api`)*
```env
VITE_API_URL=http://localhost:5000/api
```

**Run it:**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```
Backend: `http://localhost:5000` · Frontend: `http://localhost:5173`

## API Overview

Base path: `/api`

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/verify-password` |
| Donors | `GET/POST /donors`, `GET/PUT/DELETE /donors/:id` |
| Donations | `GET/POST /donations`, `GET/PUT /donations/:id` |
| Inventory | `GET/POST /inventory`, `GET /inventory/summary`, `PUT /inventory/:id` |
| Requests | `GET/POST /requests`, `GET/PUT/DELETE /requests/:id`, `POST /requests/:id/issue` |
| Hospitals | `GET/POST /hospitals`, `GET/PUT /hospitals/:id` |
| Appointments | `GET/POST /appointments`, `PUT /appointments/:id` |
| Notifications | `GET /notifications`, `PUT /notifications/:id/read` |
| Compatibility | `GET /compatibility/:bloodGroup` |
| Reports | `GET /reports/dashboard` |
| Audit logs | `GET /audit-logs` |

All routes except `/auth/register` and `/auth/login` require a `Bearer` JWT; most write actions are further restricted by role.

## User Roles

`superAdmin` · `hospitalAdmin` · `bloodBankStaff` · `doctor` · `nurse` · `donor` · `patient`

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit and push your changes
4. Open a Pull Request

## License

No license specified yet — all rights reserved by the repository owner.
