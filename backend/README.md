# Eco-Game Backend (NestJS)

## Architecture

```
src/
├── auth/               # JWT + Google + Discord OAuth2
│   ├── strategies/     # jwt.strategy.ts, google.strategy.ts, discord.strategy.ts
│   ├── guards/         # jwt-auth.guard.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.module.ts
├── users/              # User entity, CRUD, wallet management
├── trees/              # Tree planting, geo coordinates, NFT link
└── blockchain/         # ethers.js integration with PlantingLogic contract
```

## Setup

1. Copy env file and fill in values:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the PostgreSQL database:
   ```sql
   CREATE DATABASE eco_game;
   ```

4. Run dev server:
   ```bash
   npm run start:dev
   ```

5. Swagger docs available at: `http://localhost:3000/api/docs`

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /auth/google | — | Social login (Google) |
| GET | /auth/discord | — | Social login (Discord) |
| GET | /users/me | JWT | Get current user |
| PUT | /users/me/wallet | JWT | Link wallet address |
| GET | /trees | — | All planted trees (world map) |
| GET | /trees/stats | — | Global stats |
| POST | /trees | JWT | Plant a new tree |
| GET | /trees/my | JWT | My planted trees |
| GET | /blockchain/balance | JWT | ECO token balance |
