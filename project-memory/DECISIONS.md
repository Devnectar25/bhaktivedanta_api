# DECISIONS.md — Architecture & Technical Decisions

This document records the architectural tradeoffs and technical decisions made for the Bhaktivedanta Hospital Web Application backend.

---

## 1. Choice of Node.js & Express.js

*   **Problem**: Need a fast, scalable, and simple backend technology stack to provide CRUD APIs for the hospital portal.
*   **Alternatives Considered**:
    1.  *Python + Flask*: Rejected due to mismatch with existing JS/React environment.
    2.  *Node.js + NestJS*: Rejected due to high overhead for simple REST configurations.
*   **Chosen Solution**: Node.js with Express.js.
*   **Impact**: Minimizes dependency footprints, enables rapid setup, and uses native ES modules (`import`/`export`) consistent with Vite/React.

---

## 2. File-Based JSON Database Model

*   **Problem**: Storing data dynamically without adding database dependencies (MongoDB, PostgreSQL) that would complicate staging or local setup.
*   **Alternatives Considered**:
    1.  *SQLite*: Rejected due to C++ compilation dependencies in npm on different operating systems.
    2.  *In-Memory Arrays*: Rejected because all added, edited, or deleted records would wipe out on server hot-reload/restart.
*   **Chosen Solution**: File-based storage reading/writing to `src/data/*.json` files using Node's `fs` library.
*   **Impact**: Retains CRUD state changes across restarts, runs instantly without setting up any server instances, and remains extremely easy to migrate to database solutions later.

---

## 3. Modular Router Structure

*   **Problem**: A monolithic router in `server.js` would become unreadable as API surfaces grow.
*   **Alternatives Considered**:
    1.  *Combined router file*: Standard routing file containing all routes. Rejected to preserve clean separation of concerns.
*   **Chosen Solution**: Create separate router modules under `src/routes/` for each entity, registering them as subroutes in `server.js`.
*   **Impact**: Keeps endpoints clean, readable, and highly maintainable.
