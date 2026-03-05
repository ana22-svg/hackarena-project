const { User, Transaction } = require('../models');
const TrustScoreService = require('../services/TrustScoreService');

const userController = {
  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      // No password hashing yet — direct match
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const { name, email, walletAddress } = req.body;
      const user = await User.create({ name, email, walletAddress });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get trust score
  async getTrustScore(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const transactions = await Transaction.findAll({
        where: { userId: req.params.id },
        order: [['createdAt', 'DESC']],
      });

      const result = TrustScoreService.calculate(transactions, user);

      res.json({
        success: true,
        data: {
          userId: user.id,
          trustScore: result.score,
          breakdown: result.breakdown,
          totalTransactions: transactions.length,
          currentStreak: user.currentStreak,
          totalSaved: user.totalSaved,
          lastScoreUpdate: user.lastScoreUpdate || null,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = userController;