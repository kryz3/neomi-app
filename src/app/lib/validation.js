import { z } from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Créer une instance DOM pour le serveur
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Schémas de validation Zod

// Formulaire de contact
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides'),
  
  email: z.string()
    .email('Email invalide')
    .max(254, 'Email trop long'),
  
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s\-\+\(\)\.]{8,20}$/.test(val), 'Numéro de téléphone invalide'),
  
  subject: z.string()
    .min(1, 'Le sujet est requis')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
  
  captcha: z.string()
    .min(1, 'Veuillez compléter le CAPTCHA')
});

// Authentification
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Nom d\'utilisateur requis')
    .max(50, 'Nom d\'utilisateur trop long'),
  
  password: z.string()
    .min(1, 'Mot de passe requis')
    .max(200, 'Mot de passe trop long')
});

// Article/Blog
export const articleSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  
  contenu: z.string()
    .min(50, 'Le contenu doit contenir au moins 50 caractères')
    .max(50000, 'Le contenu ne peut pas dépasser 50000 caractères'),
  
  resume: z.string()
    .min(20, 'Le résumé doit contenir au moins 20 caractères')
    .max(500, 'Le résumé ne peut pas dépasser 500 caractères'),
  
  slug: z.string()
    .optional()
    .refine((val) => !val || /^[a-z0-9-]+$/.test(val), 'Slug invalide (lettres minuscules, chiffres et tirets uniquement)'),
  
  statut: z.enum(['brouillon', 'publie', 'archive'])
    .default('brouillon'),
  
  image: z.string()
    .optional()
    .refine((val) => !val || /\.(jpg|jpeg|png|webp|gif)$/i.test(val), 'Format d\'image invalide'),
  
  tags: z.array(z.string().max(50))
    .max(10, 'Maximum 10 tags')
    .optional()
});

// Avis client
export const avisSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  entreprise: z.string()
    .min(1, 'Le nom de l\'entreprise est requis')
    .max(150, 'Le nom de l\'entreprise ne peut pas dépasser 150 caractères'),
  
  note: z.number()
    .min(1, 'La note doit être entre 1 et 5')
    .max(5, 'La note doit être entre 1 et 5')
    .int('La note doit être un nombre entier'),
  
  commentaire: z.string()
    .min(20, 'Le commentaire doit contenir au moins 20 caractères')
    .max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  
  photo: z.string()
    .optional()
    .refine((val) => !val || /\.(jpg|jpeg|png|webp)$/i.test(val), 'Format d\'image invalide')
});

// Secteur
export const secteurSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  enjeux: z.string()
    .min(10, 'Les enjeux doivent contenir au moins 10 caractères')
    .max(500, 'Les enjeux ne peuvent pas dépasser 500 caractères'),
  
  accompagnement: z.string()
    .min(10, 'L\'accompagnement doit contenir au moins 10 caractères')
    .max(1000, 'L\'accompagnement ne peut pas dépasser 1000 caractères'),
  
  resultats: z.string()
    .min(10, 'Les résultats doivent contenir au moins 10 caractères')
    .max(500, 'Les résultats ne peuvent pas dépasser 500 caractères'),
  
  minicas: z.string()
    .min(10, 'Le mini cas doit contenir au moins 10 caractères')
    .max(1000, 'Le mini cas ne peut pas dépasser 1000 caractères'),
  
  icone: z.string()
    .optional()
    .refine((val) => !val || /\.(jpg|jpeg|png|webp|svg)$/i.test(val), 'Format d\'icône invalide'),
  
  ordre: z.number()
    .min(1, 'L\'ordre doit être supérieur à 0')
    .max(100, 'L\'ordre ne peut pas dépasser 100')
    .int('L\'ordre doit être un nombre entier')
});

// Organigramme
export const organigrammeSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides'),
  
  firstname: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom contient des caractères invalides'),
  
  email: z.string()
    .email('Email invalide')
    .max(254, 'Email trop long'),
  
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)\.]{8,20}$/, 'Numéro de téléphone invalide'),
  
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  
  role: z.string()
    .min(2, 'Le rôle doit contenir au moins 2 caractères')
    .max(100, 'Le rôle ne peut pas dépasser 100 caractères'),
  
  ordre: z.number()
    .min(1, 'L\'ordre doit être supérieur à 0')
    .max(100, 'L\'ordre ne peut pas dépasser 100')
    .int('L\'ordre doit être un nombre entier'),
  
  photo: z.string()
    .optional()
    .refine((val) => !val || /\.(jpg|jpeg|png|webp)$/i.test(val), 'Format d\'image invalide')
});

/**
 * Sanitiser le contenu HTML pour éviter les attaques XSS
 */
export function sanitizeHTML(dirty) {
  if (typeof dirty !== 'string') return dirty;
  
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
}

/**
 * Sanitiser récursivement un objet
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeHTML(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  
  return sanitized;
}

/**
 * Valider et sanitiser les données
 */
export function validateAndSanitize(schema, data) {
  try {
    // Première validation avec Zod
    const validatedData = schema.parse(data);
    
    // Sanitisation du contenu
    const sanitizedData = sanitizeObject(validatedData);
    
    return {
      success: true,
      data: sanitizedData
    };
  } catch (error) {
    if (error.errors) {
      // Erreurs de validation Zod
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    } else {
      // Autres erreurs
      return {
        success: false,
        errors: [{ field: 'general', message: 'Erreur de validation' }]
      };
    }
  }
}

/**
 * Créer une réponse d'erreur de validation
 */
export function validationErrorResponse(errors) {
  return {
    success: false,
    message: 'Données invalides',
    errors: errors
  };
}