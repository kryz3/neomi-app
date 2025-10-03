import dbConnect from '../lib/mongodb';
import Secteur from '../models/Secteur';
import Trash from '../models/Trash';

// Obtenir tous les secteurs
export const getSecteurs = async (filters = {}) => {
  try {
    await dbConnect();
    
    const query = {};
    
    // Exclure les secteurs supprimés par défaut
    if (filters.includeDeleted !== true) {
      query.deletedAt = { $exists: false };
    }
    
    const secteurs = await Secteur.find(query).sort({ ordre: 1 });
    return { success: true, data: secteurs };
  } catch (error) {
    console.error('Erreur getSecteurs:', error);
    return { success: false, error: error.message };
  }
};

// Créer un nouveau secteur
export const createSecteur = async (secteurData) => {
  try {
    await dbConnect();
    
    // Vérifier si l'ordre existe déjà (parmi les secteurs non supprimés)
    const existingSecteur = await Secteur.findOne({ 
      ordre: secteurData.ordre,
      deletedAt: { $exists: false }
    });
    if (existingSecteur) {
      return {
        success: false,
        error: `L'ordre ${secteurData.ordre} est déjà utilisé`
      };
    }

    const secteur = new Secteur(secteurData);
    await secteur.save();
    
    return {
      success: true,
      data: secteur
    };
  } catch (error) {
    console.error('Erreur lors de la création du secteur:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// PUT - Mettre à jour un secteur
export const updateSecteur = async (id, updateData) => {
  try {
    await dbConnect();
    
    // Si on met à jour l'ordre, vérifier qu'il n'est pas déjà pris (parmi les secteurs non supprimés)
    if (updateData.ordre) {
      const existingSecteur = await Secteur.findOne({ 
        ordre: updateData.ordre, 
        _id: { $ne: id },
        deletedAt: { $exists: false }
      });
      if (existingSecteur) {
        return {
          success: false,
          error: `L'ordre ${updateData.ordre} est déjà utilisé`
        };
      }
    }

    const secteur = await Secteur.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!secteur) {
      return {
        success: false,
        error: 'Secteur non trouvé'
      };
    }

    return {
      success: true,
      data: secteur
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du secteur:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// DELETE - Supprimer un secteur (suppression logique - mise en corbeille)
export const deleteSecteur = async (id) => {
  try {
    await dbConnect();
    
    const secteur = await Secteur.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      { deletedAt: new Date() },
      { new: true }
    );
    
    if (!secteur) {
      return {
        success: false,
        error: 'Secteur non trouvé'
      };
    }

    // Sauvegarder dans la corbeille
    await Trash.findOneAndUpdate(
      { itemId: id, itemType: 'Secteur' },
      {
        itemId: id,
        itemType: 'Secteur',
        itemData: secteur,
        deletedAt: new Date(),
        originalCollection: 'secteurs'
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      message: 'Secteur mis en corbeille avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression du secteur:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Restaurer un secteur depuis la corbeille
export const restoreSecteur = async (id) => {
  try {
    await dbConnect();
    
    const secteur = await Secteur.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: true } },
      { $unset: { deletedAt: 1 } },
      { new: true }
    );
    
    if (!secteur) {
      return {
        success: false,
        message: 'Secteur non trouvé dans la corbeille'
      };
    }
    
    // Supprimer de la corbeille
    await Trash.findOneAndDelete({ itemId: id, itemType: 'Secteur' });
    
    return {
      success: true,
      data: secteur,
      message: 'Secteur restauré avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la restauration du secteur:', error);
    return {
      success: false,
      message: 'Erreur lors de la restauration du secteur'
    };
  }
};

// Supprimer définitivement un secteur
export const permanentDeleteSecteur = async (id) => {
  try {
    await dbConnect();
    
    const secteur = await Secteur.findByIdAndDelete(id);
    
    if (!secteur) {
      return {
        success: false,
        error: 'Secteur non trouvé'
      };
    }

    // Supprimer aussi de la corbeille
    await Trash.findOneAndDelete({ itemId: id, itemType: 'Secteur' });

    return {
      success: true,
      message: 'Secteur supprimé définitivement'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression définitive du secteur:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
