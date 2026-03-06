# 💰 MicroSave Student — CoinStash

**VICSTA Hackathon – Grand Finale | VIT College, Kondhwa Campus | 5th – 6th March**

---

## Team Details

**Team Name: Shadow Ledgers**  
**Members: 3**  
**Domain: Fintech & Money Management**

---

## The Problem

Students spend impulsively on small purchases — coffee, fast food, streaming — without realising how much those micro-transactions add up. Traditional savings tools require discipline and large deposits, creating a barrier for students with irregular incomes and no financial literacy.

---

## Our Solution

**CoinStash** is a fintech tool that automatically rounds up every digital transaction and invests the spare change into a low-risk, blockchain-secured educational fund.

> *Spend ₹47 on chai? We round it up to ₹50 and save ₹3 — silently, automatically, and with a multiplier if you spent on fast food.*

### Key Features

- **Smart Round-Up Engine** — category-based multipliers (Fast Food 2×, Entertainment 2×, Education 0.5×) applied automatically on every transaction
- **Trust Score System** — a 0–1000 decentralised credibility score based on savings frequency, volume, streaks, and lesson completion. Powers micro-loan and grant eligibility
- **Blockchain Vault** — funds locked in a Solidity smart contract (Hardhat/local testnet) with penalty-free withdrawal for verified educational expenses
- **MicroLearn Streak System** — financial literacy lessons unlocked by Trust Score milestones, each worth +20 points
- **Live Dashboard** — real-time savings tracker, transaction ledger, category breakdown, savings growth chart, and vault progress

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Blockchain | Solidity, Hardhat, Ethers.js |
| Database | PostgreSQL, Sequelize |


---

## Project Structure

```
Hackarena/
├── frontend/          # React app — dashboard, login, register, simulate
│   └── src/
│       ├── components/   # Login.jsx, Register.jsx, all page components
│       └── services/     # api.js — all backend fetch calls
├── backend/           # Node/Express REST API
│   └── src/
│       ├── controllers/  # userController, transactionController
│       ├── models/       # User, Transaction (Sequelize + PostgreSQL)
│       ├── routes/       # userRoutes, transactionRoutes
│       └── services/     # RoundUpService, TrustScoreService, BlockchainService
└── smart-contracts/   # Solidity vault contract (Hardhat)
    └── contracts/        # EducationalVault.sol
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- MetaMask (optional, for on-chain interaction)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/microsave-student.git
cd microsave-student
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file:
```
PORT=5000
DB_NAME=microsave
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

Sync the database and start:
```bash
node src/config/syncDb.js
npm start
```

### 3. Smart contract (local testnet)
```bash
cd smart-contracts
npm install
npx hardhat node          # Terminal 1 — keep running
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Frontend setup
```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

---
Snippets from the site:

<img width="1919" height="978" alt="Screenshot 2026-03-06 021036" src="https://github.com/user-attachments/assets/26690620-aae0-4743-90bd-1d8f69f0818a" />  

<img width="1910" height="960" alt="Screenshot 2026-03-06 021054" src="https://github.com/user-attachments/assets/7d682ba6-725e-4a5d-b3f7-df6193da9f6f" />  

<img width="1900" height="950" alt="Screenshot 2026-03-06 021110" src="https://github.com/user-attachments/assets/41aee11f-866f-4104-a65a-5384274f6473" />

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users` | Register new user |
| `POST` | `/api/users/login` | Login |
| `GET` | `/api/users/:id` | Get user profile |
| `GET` | `/api/users/:id/trust-score` | Get trust score + breakdown |
| `POST` | `/api/transactions/simulate` | Simulate a round-up transaction |
| `GET` | `/api/transactions/:userId` | Get all transactions for user |
| `POST` | `/api/transactions/roundup/calculate` | Preview round-up (no DB write) |
| `GET` | `/api/transactions/roundup/multipliers` | Get category multiplier config |

---

## Attribution

| Library / API | Purpose | License |
|---|---|---|
| [React](https://react.dev/) | Frontend UI framework | MIT |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling | MIT |
| [Recharts](https://recharts.org/) | Chart components | MIT |
| [Express](https://expressjs.com/) | Backend web framework | MIT |
| [Sequelize](https://sequelize.org/) | PostgreSQL ORM | MIT |
| [Hardhat](https://hardhat.org/) | Ethereum development environment | MIT |
| [Ethers.js](https://ethers.org/) | Blockchain interaction | MIT |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management | BSD-2 |

---


## Team — Shadow Ledgers

-Prerna Bora (leader)  
-Shruti Bhosale (member)  
-Ananya Palnitkar (member)
>
> Thank You!!
