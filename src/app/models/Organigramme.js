import mongoose from 'mongoose';

const organigrammeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true,
    trim: true,
    default: "/organigramme/default.webp"
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  ordre: {
    type: Number,
    required: true,
    unique: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Organigramme = mongoose.models.Organigramme || mongoose.model('Organigramme', organigrammeSchema);

export default Organigramme;
