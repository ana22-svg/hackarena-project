const BASE = "http://localhost:5000/api";

// ── Users ──────────────────────────────────────────
export const loginUser = (email, password) =>
  fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());

export const createUser = (name, email, walletAddress) =>
  fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, walletAddress })
  }).then(r => r.json());

export const getUser = (id) =>
  fetch(`${BASE}/users/${id}`).then(r => r.json());

export const getTrustScore = (id) =>
  fetch(`${BASE}/users/${id}/trust-score`).then(r => r.json());

// ── Transactions ───────────────────────────────────
export const getUserTransactions = (userId) =>
  fetch(`${BASE}/transactions/${userId}`).then(r => r.json());

export const simulateTransaction = (userId) =>
  fetch(`${BASE}/transactions/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  }).then(r => r.json());

export const getRoundUpMultipliers = () =>
  fetch(`${BASE}/transactions/multipliers`).then(r => r.json());