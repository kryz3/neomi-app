import mongoose from 'mongoose';

const AvisSchema = new mongoose.Schema({
  entreprise: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true
  },
  referent: {
    type: String,
    required: [true, 'Le nom du référent est requis'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Le rôle est requis'],
    trim: true
  },
  recommandation: {
    type: String,
    required: [true, 'La recommandation est requise'],
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  ordre: {
    type: Number,
    default: 0
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
AvisSchema.index({ entreprise: 1 });
AvisSchema.index({ referent: 1 });
AvisSchema.index({ ordre: 1 });
AvisSchema.index({ createdAt: -1 });

const Avis = mongoose.models.Avis || mongoose.model('Avis', AvisSchema);

export default Avis;
