import mongoose from 'mongoose';

const scratchCardSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  scratchedAt: {
    type: Date,
    default: Date.now,
  },
  couponsRevealed: [{
    type: String,
  }],
});

scratchCardSchema.index({ phone: 1 });

const ScratchCard = mongoose.model('ScratchCard', scratchCardSchema);

export default ScratchCard;
