import Article from '../models/Article.js';
import dbConnect from '../lib/mongodb.js';

export class ArticleController {
  
  // Obtenir tous les articles avec filtres
  static async getAll(filters = {}) {
    try {
      await dbConnect();
      
      const query = {};
      
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
  static async getById(id) {
    try {
      await dbConnect();
      
      const article = await Article.findById(id);
      
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
        statut: 'publie'
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
      
      // Vérifier si le slug existe déjà
      if (articleData.slug) {
        const existingArticle = await Article.findOne({ slug: articleData.slug });
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
      
      // Si le slug est modifié, vérifier qu'il n'existe pas déjà
      if (articleData.slug) {
        const existingArticle = await Article.findOne({ 
          slug: articleData.slug,
          _id: { $ne: id }
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
  
  // Supprimer un article
  static async delete(id) {
    try {
      await dbConnect();
      
      const article = await Article.findByIdAndDelete(id);
      
      if (!article) {
        return {
          success: false,
          message: 'Article non trouvé'
        };
      }
      
      return {
        success: true,
        message: 'Article supprimé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression de l\'article'
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
