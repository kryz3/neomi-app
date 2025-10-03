import mongoose from 'mongoose';

const secteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  enjeux: {
    type: String,
    required: true,
    trim: true
  },
  accompagnement: {
    type: String,
    required: true,
    trim: true
  },
  resultats: {
    type: String,
    required: true,
    trim: true
  },
  minicas: {
    type: String,
    required: true,
    trim: true
  },
  icone: {
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

// Index pour optimiser les requêtes par ordre
secteurSchema.index({ ordre: 1 });

const Secteur = mongoose.models.Secteur || mongoose.model('Secteur', secteurSchema);

export default Secteur;
