import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numRatings: {
    type: Number,
    default: 0
  },
  purchasedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  content: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    default: null
  },
  ipfsHash: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Script || mongoose.model('Script', scriptSchema);

