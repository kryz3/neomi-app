import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets']
  },
  contenu: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  resume: {
    type: String,
    required: [true, 'Le résumé est requis'],
    maxlength: [300, 'Le résumé ne peut pas dépasser 300 caractères']
  },
  image: {
    type: String,
    trim: true
  },
  imageAlt: {
    type: String,
    trim: true,
    default: ''
  },
  mediaItems: [{
    type: {
      type: String,
      enum: ['image', 'video', 'button'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String, // Pour les images
    caption: String, // Pour les images et vidéos
    buttonText: String, // Pour les boutons
    buttonStyle: {
      type: String,
      enum: ['primary', 'secondary', 'outline'],
      default: 'primary'
    },
    position: {
      type: Number,
      required: true,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  auteur: {
    type: String,
    required: [true, 'L\'auteur est requis'],
    trim: true,
    default: 'Admin'
  },
  statut: {
    type: String,
    enum: ['brouillon', 'publie', 'archive'],
    default: 'brouillon'
  },
  datePublication: {
    type: Date,
    default: null
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'La meta description ne peut pas dépasser 160 caractères']
  },
  motsCles: [{
    type: String,
    trim: true
  }],
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

// Index pour améliorer les performances (éviter les doublons avec unique: true)
ArticleSchema.index({ statut: 1 });
ArticleSchema.index({ datePublication: -1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ ordre: 1 });
// Index de recherche textuelle (supprimé car on utilise regex dans le contrôleur)
// ArticleSchema.index({ titre: 'text', contenu: 'text', resume: 'text' });

// Middleware pour gérer la date de publication
ArticleSchema.pre('save', function(next) {
  if (this.statut === 'publie' && !this.datePublication) {
    this.datePublication = new Date();
  }
  if (this.statut !== 'publie') {
    this.datePublication = null;
  }
  next();
});

// Générer automatiquement le slug si non fourni
ArticleSchema.pre('save', function(next) {
  if (!this.slug && this.titre) {
    this.slug = this.titre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/-+/g, '-') // Supprime les tirets multiples
      .trim('-'); // Supprime les tirets en début/fin
  }
  next();
});

const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

export default Article;
