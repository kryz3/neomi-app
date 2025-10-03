import mongoose from 'mongoose';

const TrashSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Article', 'Avis', 'Secteur', 'Organigramme']
  },
  itemData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  deletedBy: {
    type: String,
    default: 'Admin'
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  originalCollection: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
TrashSchema.index({ itemType: 1 });
TrashSchema.index({ deletedAt: -1 });
TrashSchema.index({ itemId: 1, itemType: 1 }, { unique: true });

const Trash = mongoose.models.Trash || mongoose.model('Trash', TrashSchema);

export default Trash;