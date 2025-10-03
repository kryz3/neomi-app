import Trash from '../models/Trash.js';
import Article from '../models/Article.js';
import Avis from '../models/Avis.js';
import Secteur from '../models/Secteur.js';
import Organigramme from '../models/Organigramme.js';
import dbConnect from '../lib/mongodb.js';

export class TrashController {
  
  // Obtenir tous les éléments de la corbeille
  static async getAll(filters = {}) {
    try {
      await dbConnect();
      
      const query = {};
      
      // Filtrer par type si spécifié
      if (filters.itemType) {
        query.itemType = filters.itemType;
      }
      
      const trashItems = await Trash.find(query)
        .sort({ deletedAt: -1 })
        .limit(filters.limit || 100);
      
      return {
        success: true,
        data: trashItems || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la corbeille:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération de la corbeille'
      };
    }
  }
  
  // Restaurer un élément depuis la corbeille
  static async restore(itemId, itemType) {
    try {
      await dbConnect();
      
      const trashItem = await Trash.findOne({ itemId, itemType });
      
      if (!trashItem) {
        return {
          success: false,
          message: 'Élément non trouvé dans la corbeille'
        };
      }
      
      let Model;
      switch (itemType) {
        case 'Article':
          Model = Article;
          break;
        case 'Avis':
          Model = Avis;
          break;
        case 'Secteur':
          Model = Secteur;
          break;
        case 'Organigramme':
          Model = Organigramme;
          break;
        default:
          return {
            success: false,
            message: 'Type d\'élément non reconnu'
          };
      }
      
      // Restaurer l'élément
      const restoredItem = await Model.findOneAndUpdate(
        { _id: itemId },
        { $unset: { deletedAt: 1 } },
        { new: true }
      );
      
      if (!restoredItem) {
        return {
          success: false,
          message: 'Impossible de restaurer l\'élément'
        };
      }
      
      // Supprimer de la corbeille
      await Trash.findOneAndDelete({ itemId, itemType });
      
      return {
        success: true,
        data: restoredItem,
        message: 'Élément restauré avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return {
        success: false,
        message: 'Erreur lors de la restauration'
      };
    }
  }
  
  // Supprimer définitivement un élément
  static async permanentDelete(itemId, itemType) {
    try {
      await dbConnect();
      
      const trashItem = await Trash.findOne({ itemId, itemType });
      
      if (!trashItem) {
        return {
          success: false,
          message: 'Élément non trouvé dans la corbeille'
        };
      }
      
      let Model;
      switch (itemType) {
        case 'Article':
          Model = Article;
          break;
        case 'Avis':
          Model = Avis;
          break;
        case 'Secteur':
          Model = Secteur;
          break;
        case 'Organigramme':
          Model = Organigramme;
          break;
        default:
          return {
            success: false,
            message: 'Type d\'élément non reconnu'
          };
      }
      
      // Supprimer définitivement de la base de données
      await Model.findByIdAndDelete(itemId);
      
      // Supprimer de la corbeille
      await Trash.findOneAndDelete({ itemId, itemType });
      
      return {
        success: true,
        message: 'Élément supprimé définitivement'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression définitive:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression définitive'
      };
    }
  }
  
  // Vider la corbeille (suppression définitive de tous les éléments)
  static async empty() {
    try {
      await dbConnect();
      
      const trashItems = await Trash.find({});
      
      for (const item of trashItems) {
        let Model;
        switch (item.itemType) {
          case 'Article':
            Model = Article;
            break;
          case 'Avis':
            Model = Avis;
            break;
          case 'Secteur':
            Model = Secteur;
            break;
          case 'Organigramme':
            Model = Organigramme;
            break;
          default:
            continue;
        }
        
        // Supprimer définitivement
        await Model.findByIdAndDelete(item.itemId);
      }
      
      // Vider la corbeille
      await Trash.deleteMany({});
      
      return {
        success: true,
        message: 'Corbeille vidée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors du vidage de la corbeille:', error);
      return {
        success: false,
        message: 'Erreur lors du vidage de la corbeille'
      };
    }
  }
  
  // Obtenir les statistiques de la corbeille
  static async getStats() {
    try {
      await dbConnect();
      
      const stats = await Trash.aggregate([
        {
          $group: {
            _id: '$itemType',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const total = await Trash.countDocuments();
      
      return {
        success: true,
        data: {
          total,
          byType: stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {})
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      };
    }
  }
}