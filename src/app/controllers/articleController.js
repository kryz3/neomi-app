import Article from '../models/Article.js';
import Trash from '../models/Trash.js';
import dbConnect from '../lib/mongodb.js';

export class ArticleController {
  
  // Obtenir tous les articles avec filtres
  static async getAll(filters = {}) {
    try {
      await dbConnect();
      
      const query = {};
      
      // Exclure les articles supprimés par défaut (sauf si explicitement demandé)
      if (filters.includeDeleted !== true) {
        query.deletedAt = { $exists: false };
      }
      
      // Filtres
      if (filters.statut) {
        query.statut = filters.statut;
      }
      
      // Recherche textuelle - utiliser une approche plus robuste
      if (filters.search) {
        const searchTerm = filters.search.trim();
        if (searchTerm) {
          // Utiliser une recherche regex plus simple qui fonctionne même sans index de texte
          query.$or = [
            { titre: { $regex: searchTerm, $options: 'i' } },
            { resume: { $regex: searchTerm, $options: 'i' } },
            { contenu: { $regex: searchTerm, $options: 'i' } },
            { motsCles: { $in: [new RegExp(searchTerm, 'i')] } }
          ];
        }
      }
      
      const sortOptions = {};
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'date':
            sortOptions.datePublication = -1;
            sortOptions.createdAt = -1; // Fallback pour les articles sans date de publication
            break;
          case 'titre':
            sortOptions.titre = 1;
            break;
          case 'ordre':
            sortOptions.ordre = 1;
            sortOptions.createdAt = -1; // Fallback
            break;
          default:
            sortOptions.createdAt = -1;
        }
      } else {
        // Tri par défaut : d'abord par date de publication, puis par date de création
        sortOptions.datePublication = -1;
        sortOptions.createdAt = -1;
      }
      
      const articles = await Article.find(query)
        .sort(sortOptions)
        .limit(filters.limit || 50);
      
      return {
        success: true,
        data: articles || [] // S'assurer qu'on retourne toujours un tableau
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des articles'
      };
    }
  }
  
  // Obtenir un article par son ID
  static async getById(id, includeDeleted = false) {
    try {
      await dbConnect();
      
      const query = { _id: id };
      if (!includeDeleted) {
        query.deletedAt = { $exists: false };
      }
      
      const article = await Article.findOne(query);
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      return {
        success: true,
        data: article
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération de l\'article'
      };
    }
  }
  
  // Obtenir un article par son slug
  static async getBySlug(slug) {
    try {
      await dbConnect();
      
      const article = await Article.findOne({ 
        slug: slug,
        statut: 'publie',
        deletedAt: { $exists: false }
      });
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      return {
        success: true,
        data: article
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération de l\'article'
      };
    }
  }
  
  // Créer un nouvel article
  static async create(articleData) {
    try {
      await dbConnect();
      
      // Vérifier si le slug existe déjà (parmi les articles non supprimés)
      if (articleData.slug) {
        const existingArticle = await Article.findOne({ 
          slug: articleData.slug,
          deletedAt: { $exists: false }
        });
        if (existingArticle) {
          return {
            success: false,
            message: 'Un article avec ce slug existe déjà'
          };
        }
      }
      
      const article = new Article(articleData);
      await article.save();
      
      return {
        success: true,
        data: article,
        message: 'Article créé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Un article avec ce slug existe déjà'
        };
      }
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return {
          success: false,
          message: messages.join(', ')
        };
      }
      
      return {
        success: false,
        message: 'Erreur lors de la création de l\'article'
      };
    }
  }
  
  // Mettre à jour un article
  static async update(id, articleData) {
    try {
      await dbConnect();
      
      // Si le slug est modifié, vérifier qu'il n'existe pas déjà (parmi les articles non supprimés)
      if (articleData.slug) {
        const existingArticle = await Article.findOne({ 
          slug: articleData.slug,
          _id: { $ne: id },
          deletedAt: { $exists: false }
        });
        if (existingArticle) {
          return {
            success: false,
            message: 'Un article avec ce slug existe déjà'
          };
        }
      }
      
      const article = await Article.findByIdAndUpdate(
        id,
        articleData,
        { new: true, runValidators: true }
      );
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      return {
        success: true,
        data: article,
        message: 'Article mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Un article avec ce slug existe déjà'
        };
      }
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return {
          success: false,
          message: messages.join(', ')
        };
      }
      
      return {
        success: false,
        message: 'Erreur lors de la mise à jour de l\'article'
      };
    }
  }
  
  // Supprimer un article (suppression logique - mise en corbeille)
  static async delete(id) {
    try {
      await dbConnect();
      
      const article = await Article.findOneAndUpdate(
        { _id: id, deletedAt: { $exists: false } },
        { deletedAt: new Date() },
        { new: true }
      );
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      // Sauvegarder dans la corbeille
      await Trash.findOneAndUpdate(
        { itemId: id, itemType: 'Article' },
        {
          itemId: id,
          itemType: 'Article',
          itemData: article,
          deletedAt: new Date(),
          originalCollection: 'articles'
        },
        { upsert: true, new: true }
      );
      
      return {
        success: true,
        message: 'Article mis en corbeille avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression de l\'article'
      };
    }
  }

  // Restaurer un article depuis la corbeille
  static async restore(id) {
    try {
      await dbConnect();
      
      const article = await Article.findOneAndUpdate(
        { _id: id, deletedAt: { $exists: true } },
        { $unset: { deletedAt: 1 } },
        { new: true }
      );
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé dans la corbeille'
        };
      }
      
      // Supprimer de la corbeille
      await Trash.findOneAndDelete({ itemId: id, itemType: 'Article' });
      
      return {
        success: true,
        data: article,
        message: 'Article restauré avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la restauration de l\'article'
      };
    }
  }

  // Supprimer définitivement un article
  static async permanentDelete(id) {
    try {
      await dbConnect();
      
      const article = await Article.findOneAndDelete({ _id: id });
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      // Supprimer aussi de la corbeille
      await Trash.findOneAndDelete({ itemId: id, itemType: 'Article' });
      
      return {
        success: true,
        message: 'Article supprimé définitivement'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression définitive de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression définitive de l\'article'
      };
    }
  }
  
  // Publier un article
  static async publish(id) {
    try {
      await dbConnect();
      
      const article = await Article.findByIdAndUpdate(
        id,
        { 
          statut: 'publie',
          datePublication: new Date()
        },
        { new: true }
      );
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      return {
        success: true,
        data: article,
        message: 'Article publié avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la publication de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la publication de l\'article'
      };
    }
  }
  
  // Dépublier un article
  static async unpublish(id) {
    try {
      await dbConnect();
      
      const article = await Article.findByIdAndUpdate(
        id,
        { 
          statut: 'brouillon',
          datePublication: null
        },
        { new: true }
      );
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      return {
        success: true,
        data: article,
        message: 'Article dépublié avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la dépublication de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la dépublication de l\'article'
      };
    }
  }
}
