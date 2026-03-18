# 🌳 LeafLedger — Blockchain Tree Planting Game

A blockchain-based sustainability game where virtual trees map to real-world trees planted by NGO partners. Built for the **Initia Hackathon**.

## Monorepo Structure

```
.
├── contracts/   # Foundry smart contracts (Solidity)
├── backend/     # NestJS REST API
└── frontend/    # Vite + React + TypeScript
```

---

## Quick Start

### 1. Smart Contracts (Foundry)

```bash
cd contracts
forge build
forge test
```

### 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env   # fill in your credentials
npm install
npm run start:dev
# → http://localhost:3000
# → Swagger: http://localhost:3000/api/docs
```

> **Requires**: PostgreSQL running. Create `eco_game` database.

### 3. Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity 0.8.24, Foundry, OpenZeppelin |
| Blockchain | Initia Network (EVM compatible) |
| Backend | NestJS, TypeORM, PostgreSQL, Passport |
| Auth | Google OAuth2, Discord OAuth, JWT |
| Frontend | Vite, React 18, TypeScript, Zustand |
| Map | React-Leaflet (dark CARTO tiles) |
| Tokens | ECO (ERC20), VirtualTree (ERC721 NFT) |

---

## Smart Contracts

- **RewardToken.sol** — ERC20 `ECO` token rewarded for each tree planted
- **TreeNFT.sol** — ERC721 `VTREE` NFT minted for each virtual tree
- **PlantingLogic.sol** — Orchestrates verification, minting, and rewarding

## Backend API

| Method | Endpoint | Description |
|--|--|--|
| GET | `/auth/google` | Google OAuth login |
| GET | `/auth/discord` | Discord OAuth login |
| GET | `/users/me` | Current user profile |
| PUT | `/users/me/wallet` | Link Initia wallet |
| GET | `/trees` | All global trees (map data) |
| POST | `/trees` | Plant a new tree |
| GET | `/trees/my` | My trees |
| GET | `/trees/stats` | Global stats |
| GET | `/blockchain/balance` | ECO token balance |

## Frontend Pages

| Route | Page |
|--|--|
| `/` | Landing page (hero, stats, how-it-works) |
| `/login` | Social login (Google / Discord) |
| `/map` | World map (click to plant) |
| `/dashboard` | User stats, wallet, tree history |
| `/auth/callback` | OAuth redirect handler |
