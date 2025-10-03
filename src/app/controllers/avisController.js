import Avis from '../models/Avis.js';
import Trash from '../models/Trash.js';
import dbConnect from '../lib/mongodb.js';

export class AvisController {
  
  // Obtenir tous les avis actifs
  static async getAllAvis(filters = {}) {
    try {
      await dbConnect();
      
      const query = {};
      
      // Exclure les avis supprimés par défaut
      if (filters.includeDeleted !== true) {
        query.deletedAt = { $exists: false };
      }
      
      const avisList = await Avis.find(query).sort({ ordre: 1, createdAt: -1 });
      
      return {
        success: true,
        data: avisList,
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
  static async getAvisById(id, includeDeleted = false) {
    try {
      await dbConnect();
      
      const query = { _id: id };
      if (!includeDeleted) {
        query.deletedAt = { $exists: false };
      }
      
      const avis = await Avis.findOne(query);
      
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
  static async createAvis(avisData) {
    try {
      await dbConnect();
      
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
        data: savedAvis,
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
      await dbConnect();
      
      const avis = await Avis.findOne({ _id: id, deletedAt: { $exists: false } });
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      // Mise à jour des champs autorisés
      const allowedFields = ['entreprise', 'logo', 'referent', 'role', 'recommandation', 'ordre'];
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
        data: updatedAvis,
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



  // Supprimer un avis (suppression logique - mise en corbeille)
  static async deleteAvis(id) {
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

      // Sauvegarder dans la corbeille
      await Trash.findOneAndUpdate(
        { itemId: id, itemType: 'Avis' },
        {
          itemId: id,
          itemType: 'Avis',
          itemData: avis,
          deletedAt: new Date(),
          originalCollection: 'avis'
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        message: 'Avis mis en corbeille avec succès'
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

  // Restaurer un avis depuis la corbeille
  static async restore(id) {
    try {
      await dbConnect();
      
      const avis = await Avis.findOneAndUpdate(
        { _id: id, deletedAt: { $exists: true } },
        { $unset: { deletedAt: 1 } },
        { new: true }
      );
      
      if (!avis) {
        return {
          success: false,
          message: 'Avis non trouvé dans la corbeille'
        };
      }
      
      // Supprimer de la corbeille
      await Trash.findOneAndDelete({ itemId: id, itemType: 'Avis' });
      
      return {
        success: true,
        data: avis,
        message: 'Avis restauré avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'avis:', error);
      return {
        success: false,
        message: 'Erreur lors de la restauration de l\'avis'
      };
    }
  }

  // Suppression définitive (pour l'administration)
  static async permanentDelete(id) {
    try {
      await dbConnect();
      
      const avis = await Avis.findByIdAndDelete(id);
      if (!avis) {
        return {
          success: false,
          error: 'Avis non trouvé'
        };
      }

      // Supprimer aussi de la corbeille
      await Trash.findOneAndDelete({ itemId: id, itemType: 'Avis' });

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
