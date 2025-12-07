import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect wallet
router.post('/wallet/connect', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Airdrop initial tokens
    const INITIAL_AIRDROP = 50;
    if (user.svlBalance === 0) {
      user.svlBalance = INITIAL_AIRDROP;
      await user.save();
    }

    res.json({
      message: 'Wallet connected',
      svlBalance: user.svlBalance,
      reputationCredit: user.reputationCredit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Airdrop tokens (for testing)
router.post('/airdrop', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const AIRDROP_AMOUNT = 50;
    user.svlBalance += AIRDROP_AMOUNT;
    await user.save();

    res.json({
      message: 'Airdrop successful',
      svlBalance: user.svlBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

