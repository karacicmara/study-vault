import express from 'express';
import Script from '../models/Script.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Rating from '../models/Rating.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all scripts
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { course: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const scripts = await Script.find(query)
      .populate('authorId', 'email')
      .sort({ createdAt: -1 });

    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single script
router.get('/:id', async (req, res) => {
  try {
    const script = await Script.findById(req.params.id)
      .populate('authorId', 'email')
      .populate('purchasedBy', 'email');

    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    res.json(script);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create script (authenticated)
router.post('/', authenticate, [
  body('title').notEmpty().trim(),
  body('course').notEmpty().trim(),
  body('description').notEmpty(),
  body('price').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, course, description, price, content } = req.body;

    const script = new Script({
      title,
      course,
      description,
      price,
      content: content || '',
      authorId: req.userId
    });

    await script.save();
    await script.populate('authorId', 'email');

    res.status(201).json(script);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase script
router.post('/:id/purchase', authenticate, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    const buyer = await User.findById(req.userId);
    if (!buyer) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already purchased
    if (script.purchasedBy.includes(req.userId)) {
      return res.status(400).json({ error: 'Script already purchased' });
    }

    // Check balance
    if (buyer.svlBalance < script.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Get author
    const author = await User.findById(script.authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Update balances
    buyer.svlBalance -= script.price;
    author.svlBalance += script.price;

    // Add buyer to purchasedBy
    script.purchasedBy.push(req.userId);

    // Create transaction
    const transaction = new Transaction({
      buyerId: req.userId,
      sellerId: script.authorId,
      scriptId: script._id,
      amount: script.price,
      type: 'purchase'
    });

    await Promise.all([
      buyer.save(),
      author.save(),
      script.save(),
      transaction.save()
    ]);

    res.json({
      message: 'Purchase successful',
      script,
      newBalance: buyer.svlBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate script
router.post('/:id/rate', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const script = await Script.findById(req.params.id);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    // Check if user purchased the script
    if (!script.purchasedBy.includes(req.userId)) {
      return res.status(403).json({ error: 'Must purchase script before rating' });
    }

    const { rating, review } = req.body;

    // Check if already rated
    const existingRating = await Rating.findOne({
      userId: req.userId,
      scriptId: script._id
    });

    if (existingRating) {
      return res.status(400).json({ error: 'Already rated this script' });
    }

    // Create rating
    const newRating = new Rating({
      userId: req.userId,
      scriptId: script._id,
      rating,
      review: review || ''
    });

    await newRating.save();

    // Update script rating
    const allRatings = await Rating.find({ scriptId: script._id });
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    script.rating = (totalRating / allRatings.length).toFixed(1);
    script.numRatings = allRatings.length;

    await script.save();

    // Give reputation credit to user
    const user = await User.findById(req.userId);
    user.reputationCredit += 5;
    await user.save();

    res.json({
      message: 'Rating submitted',
      script,
      reputationCredit: user.reputationCredit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

