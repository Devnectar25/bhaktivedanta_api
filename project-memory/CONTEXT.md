# CONTEXT.md — Backend Context & API Specifications

This document serves as the project context repository for the **Bhaktivedanta Hospital Web Application** backend API.

---

## 1. Project Overview & Architectural Boundaries
The application utilizes a Node.js and Express.js REST API backend, separated from the React frontend SPA.
The backend exposes JSON endpoints for all resources and uses a lightweight JSON file-based database for persistence.

- **Frontend Origin**: `http://localhost:5173`
- **Backend Origin**: `http://localhost:5000`

---

## 2. Directory Layout & Mapping

```
bhaktivedanta-api/
├── package.json          # Dependency configurations
├── .env                  # Environment configurations (Port, Frontend CORS URL)
├── src/
│   ├── server.js         # Entry point, Express startup & route routing
│   ├── utils/
│   │   ├── seeds.js      # Seeding structures mapped from initial states
│   │   └── storage.js    # FS loader & saver file DB manager
│   ├── data/             # Seeding storage JSON files (Auto-generated on startup)
│   │   ├── doctors.json
│   │   ├── appointments.json
│   │   ├── specialities_state.json
│   │   ├── events.json
│   │   ├── testimonials.json
│   │   ├── news.json
│   │   ├── gallery.json
│   │   ├── queries.json
│   │   └── subadmins.json
│   └── routes/           # REST API routes files
│       ├── doctors.js
│       ├── appointments.js
│       ├── specialities.js
│       ├── events.js
│       ├── testimonials.js
│       ├── news.js
│       ├── gallery.js
│       ├── queries.js
│       └── subadmins.js
└── project-memory/       # Backend system documents
    ├── CONTEXT.md
    ├── DECISIONS.md
    ├── PROGRESS.md
    ├── requirements.md
    └── SKILL.md
```

---

## 3. Database Schema Mapping
All records are saved inside `src/data/` as JSON arrays (except `specialities_state.json` which is saved as a single layout config object).
Seeding runs automatically on first boot, parsing the schema arrays defined in [seeds.js](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-api/src/utils/seeds.js).
