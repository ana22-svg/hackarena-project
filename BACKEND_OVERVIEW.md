# CoinStash Backend - Technical Overview & Implemented Issues


## 1. Backend Architecture

The backend is a production-ready Node.js application built with a modern, scalable architecture.

-   **Runtime:** Node.js v24.14.0
-   **Framework:** Express 5.2.1
-   **Database:** PostgreSQL 18
-   **ORM:** Sequelize 6.37.7 (for data modeling, validation, and SQL abstraction)
-   **Core Dependencies:**
    -   `cors`: To allow the frontend application to communicate with the API.
    -   `dotenv`: To manage environment variables (database credentials, ports).
    -   `pg`: The Node.js driver for PostgreSQL.
-   **Design Pattern:** A **3-tier (or Service-Oriented) architecture** is used to separate concerns:
    1.  **Routes (`/routes`)**: Defines the API endpoints and maps them to controller methods.
    2.  **Controllers (`/controllers`)**: Handles incoming HTTP requests, validates input, and orchestrates calls to the service layer. It is the "traffic cop" of the application.
    3.  **Services (`/services`)**: Contains all the core business logic. This is where calculations, data processing, and algorithms reside. Services are stateless and reusable.
    4.  **Models (`/models`)**: Defines the database schema and relationships using Sequelize. This is the data layer.

### Folder Structure
```
backend/
├── server.js             # Main entry point, starts server, connects to DB
├── .env                  # Environment variables (DB_USER, DB_PASS, etc.)
└── src/
    ├── app.js            # Express app setup, middleware, route mounting
    ├── config/
    │   └── database.js   # Sequelize database connection config
    ├── models/
    │   ├── User.js       # User schema and associations
    │   └── Transaction.js# Transaction schema and associations
    ├── routes/
    │   ├── userRoutes.js
    │   └── transactionRoutes.js
    ├── controllers/
    │   ├── userController.js
    │   └── transactionController.js
    └── services/
        ├── TransactionService.js # Issue #1: Mock data generation
        ├── RoundUpService.js     # Issue #2: Rounding & categorization logic
        └── TrustScoreService.js  # Issue #3: Trust score calculation
```

---

## 2. Database Schema

Two core models drive the application, defined with Sequelize. The database is automatically synced (`alter: true`) on server start, which updates tables to match model definitions without dropping data.

### `users` Table
Stores user profile information, their savings totals, and financial discipline metrics.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | Unique identifier for the user. |
| `name` | `STRING` | Not Null | User's full name. |
| `email` | `STRING` | Not Null, Unique | User's email address. |
| `trustScore` | `INTEGER` | Default 0 | The calculated financial discipline score (0-1000). |
| `currentStreak`| `INTEGER` | Default 0 | Number of consecutive days the user has saved. |
| `totalSaved` | `DECIMAL(12,2)`| Default 0.00 | The cumulative total of all saved round-up amounts. |
| `lastScoreUpdate`| `DATE` | Nullable | Timestamp of the last trust score recalculation. |
| `createdAt` | `TIMESTAMP` | | Auto-generated. |
| `updatedAt` | `TIMESTAMP` | | Auto-generated. |

### `transactions` Table
Stores every purchase, its associated round-up, and categorization.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `txId` | `UUID` | Primary Key | Unique identifier for the transaction. |
| `userId` | `UUID` | Foreign Key (users.id) | Links the transaction to a user. |
| `merchantName` | `STRING` | Not Null | The name of the merchant (e.g., "Starbucks"). |
| `originalAmount`| `DECIMAL(10,2)`| Not Null | The actual purchase amount (e.g., $4.73). |
| `roundedAmount` | `DECIMAL(10,2)`| Nullable | The amount after rounding up (e.g., $5.27). |
| `savedAmount` | `DECIMAL(10,2)`| Nullable | The spare change saved (e.g., $0.54). |
| `category` | `ENUM` | Default 'other' | Purchase category (food, entertainment, etc.). |
| `roundUpMultiplier`| `FLOAT` | Nullable | The behavioral multiplier applied (e.g., 2.0 for food). |
| `createdAt` | `TIMESTAMP` | | Auto-generated. |
| `updatedAt` | `TIMESTAMP` | | Auto-generated. |

---

## 3. Implemented Issues & Technical Details

### Issue #1: Mock Transaction Generator API

-   **Objective:** Create a system to generate realistic but fake purchase data for demos and testing.
-   **Implementation:** The logic is encapsulated in `src/services/TransactionService.js`.
    -   It contains a predefined list of 14 merchants (e.g., "Starbucks", "Netflix", "Uber", "Walmart") and maps them to one of 7 categories.
    -   Each merchant has a realistic price range (e.g., Starbucks: $2-$15, Amazon: $5-$120).
    -   The `generateMockTransaction(userId)` function randomly selects a merchant, generates a price within its range, and returns a transaction object ready to be processed further.

### Issue #2: Categorization & Dynamic Rounding Logic

-   **Objective:** Intelligently categorize purchases and apply behavioral "boost multipliers" to the round-up amount to gamify and incentivize saving.
-   **Implementation:** The logic is encapsulated in `src/services/RoundUpService.js`.
    -   **Categorization:** A hash map (`CATEGORY_KEYWORDS`) maps over 50 keywords (e.g., 'starbucks', 'mcdonalds', 'amc', 'netflix') to their respective categories. When a transaction is processed, the service scans the merchant name for these keywords to auto-categorize it.
    -   **Dynamic Multipliers:** A `CATEGORY_MULTIPLIERS` configuration applies a multiplier to the *base round-up amount* (not the original purchase). This is the core behavioral incentive.
        -   **Entertainment: 3x** (Highest incentive for discretionary spending)
        -   **Food: 2x** (Encourages tracking food expenses)
        -   **Education: 0.5x** (A "reward" for beneficial spending, resulting in a smaller round-up)
        -   **Others: 1x** (Standard round-up)
    -   **Edge Case Handling:**
        -   If a purchase is an exact dollar amount (e.g., $5.00), the base round-up is set to a full dollar ($1.00) before the multiplier is applied.
        -   A global cap (`MAX_ROUNDUP`) prevents any single `savedAmount` from exceeding $5.00, keeping it a "micro-savings" platform.
    -   **API Exposure:** Two helper endpoints were created:
        -   `POST /api/transactions/roundup/calculate`: A standalone calculator for the frontend to preview a round-up without creating a transaction.
        -   `GET /api/transactions/roundup/multipliers`: Exposes the multiplier configuration for the frontend to display.

### Issue #3: Trust Score Calculator Engine

-   **Objective:** Develop a sophisticated, multi-dimensional algorithm to score a user's financial discipline based on their saving patterns.
-   **Implementation:** The logic is encapsulated in `src/services/TrustScoreService.js`. The final score is a weighted average of five distinct dimensions:
    1.  **Frequency (25% weight):** How many transactions has the user made? Score maxes out at 50 transactions.
    2.  **Volume (20% weight):** What is the total dollar amount saved? Score maxes out at $100 saved.
    3.  **Streak (20% weight):** How many consecutive *calendar days* has the user saved? A dedicated `updateStreak()` method handles this logic, resetting if a day is missed. Score maxes out at a 30-day streak.
    4.  **Consistency (15% weight):** How regular is the saving pattern? This is the most complex metric. It calculates the time gaps (in hours) between each transaction and then finds the **standard deviation** of those gaps. A low standard deviation (meaning the user saves at very regular intervals) results in a high consistency score. This penalizes erratic, burst-like saving behavior.
    5.  **Recency (20% weight):** How recently did the user save? This creates an incentive for ongoing engagement. The score is tiered: saving within the last 24 hours gives max points, with the score decaying over time (72h, 168h, 336h).
-   **Real-Time Auto-Update:** The entire trust score calculation is triggered automatically after every single `POST /simulate` call. The new score is immediately persisted to the `users` table and returned in the API response, providing instant feedback.
-   **API Exposure:** A dedicated endpoint `GET /api/users/:id/trust-score` allows the frontend to fetch the latest score and a full breakdown of all five-dimension sub-scores at any time.

---

## 4. The Integrated Pipeline: How It All Works

The core of the application is the `POST /api/transactions/simulate` endpoint, which integrates all three issues into a single, atomic pipeline:

1.  **Request In:** Frontend sends `{ "userId": "some-uuid" }`.
2.  **Controller (`transactionController.js`):** The `simulateTransaction` method is invoked.
3.  **Issue #1:** It calls `TransactionService.generateMockTransaction()` to get a raw purchase object (e.g., `{ merchantName: 'Starbucks', originalAmount: 4.73, category: 'food' }`).
4.  **Issue #2:** It passes this object to `RoundUpService.calculateRoundUp()`.
    -   The service confirms the category is 'food'.
    -   It calculates the base round-up: $5.00 - $4.73 = $0.27.
    -   It applies the 'food' multiplier: $0.27 * 2 = $0.54 (`savedAmount`).
    -   It calculates the final purchase amount: $4.73 + $0.54 = $5.27 (`roundedAmount`).
5.  **Database Write:** The controller creates a new record in the `transactions` table with all this data.
6.  **User Update:** The controller increments the `totalSaved` field on the `users` table by $0.54.
7.  **Issue #3:** The controller now triggers the trust score engine.
    -   It calls `TrustScoreService.updateStreak()` to check and update the user's saving streak.
    -   It fetches all of the user's transactions from the database.
    -   It calls `TrustScoreService.calculate()`, which computes all five-dimension scores and the final weighted score.
8.  **Database Write:** The controller updates the `trustScore` and `lastScoreUpdate` fields on the `users` table.
9.  **Response Out:** The controller sends a `201 Created` response to the frontend containing the newly created transaction, the round-up details, the new trust score, and the full score breakdown.

This entire sequence happens in a single API call, providing a powerful, real-time feedback loop for the user.
