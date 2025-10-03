import { connectToDatabase } from '../../back/lib/mongodb.js';
import Avis from '../models/Avis.js';

// Helper function for database connection
const dbConnect = connectToDatabase;

// Récupérer tous les avis
export async function getAllAvis() {
  try {
    await dbConnect();
    const avis = await Avis.find({ deletedAt: { $exists: false } }).sort({ createdAt: -1 });
    
    return {
      success: true,
      data: avis
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des avis',
      details: error.message
    };
  }
}

// Récupérer un avis par ID
export async function getAvisById(id) {
  try {
    await dbConnect();
    const avis = await Avis.findOne({ _id: id, deletedAt: { $exists: false } });
    
    if (!avis) {
      return {
        success: false,
        error: 'Avis non trouvé'
      };
    }
    
    return {
      success: true,
      data: avis
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avis:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération de l\'avis',
      details: error.message
    };
  }
}

// Créer un nouvel avis
export async function createAvis(avisData) {
  try {
    await dbConnect();
    const avis = new Avis(avisData);
    await avis.save();
    
    return {
      success: true,
      data: avis,
      message: 'Avis créé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    return {
      success: false,
      error: 'Erreur lors de la création de l\'avis',
      details: error.message
    };
  }
}

// Mettre à jour un avis
export async function updateAvis(id, updateData) {
  try {
    await dbConnect();
    const avis = await Avis.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!avis) {
      return {
        success: false,
        error: 'Avis non trouvé'
      };
    }
    
    return {
      success: true,
      data: avis,
      message: 'Avis mis à jour avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour de l\'avis',
      details: error.message
    };
  }
}

// Mettre à jour un champ spécifique d'un avis
export async function updateAvisField(id, field, value) {
  try {
    await dbConnect();
    
    // Champs autorisés pour la mise à jour
    const allowedFields = [
      'entreprise', 'referent', 'role', 'recommandation', 
      'logo', 'ordre'
    ];
    
    if (!allowedFields.includes(field)) {
      return {
        success: false,
        error: `Le champ '${field}' n'est pas autorisé pour la mise à jour`,
        details: `Champs autorisés: ${allowedFields.join(', ')}`
      };
    }
    
    const updateData = { [field]: value };
    const avis = await Avis.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!avis) {
      return {
        success: false,
        error: 'Avis non trouvé'
      };
    }
    
    return {
      success: true,
      data: avis,
      message: `Champ '${field}' mis à jour avec succès`
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du champ:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du champ',
      details: error.message
    };
  }
}

// Supprimer un avis (suppression logique)
export async function deleteAvis(id) {
  try {
    await dbConnect();
    const avis = await Avis.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      { deletedAt: new Date() },
      { new: true }
    );
    
    if (!avis) {
      return {
        success: false,
        error: 'Avis non trouvé'
      };
    }
    
    return {
      success: true,
      message: 'Avis supprimé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    return {
      success: false,
      error: 'Erreur lors de la suppression de l\'avis',
      details: error.message
    };
  }
}
