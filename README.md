# Conversation Session Service

Backend Take-Home Assignment built with **NestJS + MongoDB**.

## Features

- Idempotent session creation / upsert
- Idempotent event creation per session
- Immutable conversation events
- Session retrieval with ordered event pagination
- Idempotent session completion
- MongoDB indexing for correctness and performance

---

## Tech Stack

- NestJS
- TypeScript
- MongoDB
- Mongoose

---

## Setup Instructions

### 1. Clone / unzip project
```bash
    cd conversation-session-service

2. Install dependencies
    npm install

3. Create environment file
    cp .env.example .env

    Make sure .env contains:

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/conversation-service


4. Start MongoDB using Docker
    docker compose up -d


5. Run the application
    npm run start:dev

If successful, the server will run on: http://localhost:3000

Running Tests
    npm test