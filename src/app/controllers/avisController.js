import Avis from '../models/Avis.js';
import { connectToDatabase } from '../../back/lib/mongodb.js';

export class AvisController {
  
  // Obtenir tous les avis actifs
  static async getAllAvis() {
    try {
      await connectToDatabase();
      const avisList = await Avis.getActiveAvis();
      return {
        success: true,
        data: avisList.map(avis => avis.toPublic()),
        count: avisList.length
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

  // Obtenir un avis par ID
  static async getAvisById(id) {
    try {
      await connectToDatabase();
      const avis = await Avis.findById(id);
      
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      return {
        success: true,
        data: avis.toPublic()
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
  static async createAvis(avisData) {
    try {
      await connectToDatabase();
      
      // Validation des données requises
      const requiredFields = ['entreprise', 'referent', 'role', 'recommandation'];
      for (const field of requiredFields) {
        if (!avisData[field] || !avisData[field].trim()) {
          return {
            success: false,
            error: `Le champ ${field} est requis`
          };
        }
      }

      const newAvis = new Avis(avisData);
      const savedAvis = await newAvis.save();

      return {
        success: true,
        data: savedAvis.toPublic(),
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
  static async updateAvis(id, updateData) {
    try {
      await connectToDatabase();
      
      const avis = await Avis.findById(id);
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      // Mise à jour des champs autorisés
      const allowedFields = ['entreprise', 'logo', 'referent', 'role', 'recommandation', 'isActive', 'ordre'];
      const filteredData = {};
      
      for (const field of allowedFields) {
        if (updateData.hasOwnProperty(field)) {
          filteredData[field] = updateData[field];
        }
      }

      const updatedAvis = await Avis.findByIdAndUpdate(
        id,
        filteredData,
        { new: true, runValidators: true }
      );

      return {
        success: true,
        data: updatedAvis.toPublic(),
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

  // Mettre à jour un champ spécifique
  static async updateAvisField(id, field, value) {
    try {
      await connectToDatabase();
      
      const allowedFields = ['entreprise', 'logo', 'referent', 'role', 'recommandation', 'isActive', 'ordre'];
      
      if (!allowedFields.includes(field)) {
        return {
          success: false,
          error: `Le champ ${field} n'est pas autorisé à être modifié`
        };
      }

      const avis = await Avis.findById(id);
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      const updateData = { [field]: value };
      const updatedAvis = await Avis.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return {
        success: true,
        data: updatedAvis.toPublic(),
        message: `Champ ${field} mis à jour avec succès`
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

  // Supprimer un avis (suppression douce - désactiver)
  static async deleteAvis(id) {
    try {
      await connectToDatabase();
      
      const avis = await Avis.findById(id);
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      // Suppression douce - on désactive l'avis
      const updatedAvis = await Avis.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      return {
        success: true,
        data: updatedAvis.toPublic(),
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

  // Suppression définitive (pour l'administration)
  static async hardDeleteAvis(id) {
    try {
      await connectToDatabase();
      
      const avis = await Avis.findByIdAndDelete(id);
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      return {
        success: true,
        message: 'Avis supprimé définitivement'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression définitive:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression définitive',
        details: error.message
      };
    }
  }
}
