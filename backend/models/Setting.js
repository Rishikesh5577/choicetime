import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

settingSchema.index({ key: 1 });

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
