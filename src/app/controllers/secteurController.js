import dbConnect from '../lib/mongodb';
import Secteur from '../models/Secteur';

// Obtenir tous les secteurs
export const getSecteurs = async () => {
  try {
    await dbConnect();
    const secteurs = await Secteur.find({}).sort({ ordre: 1 });
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
    
    // Vérifier si l'ordre existe déjà
    const existingSecteur = await Secteur.findOne({ ordre: secteurData.ordre });
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
    
    // Si on met à jour l'ordre, vérifier qu'il n'est pas déjà pris
    if (updateData.ordre) {
      const existingSecteur = await Secteur.findOne({ 
        ordre: updateData.ordre, 
        _id: { $ne: id } 
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

// DELETE - Supprimer un secteur
export const deleteSecteur = async (id) => {
  try {
    await dbConnect();
    
    const secteur = await Secteur.findByIdAndDelete(id);
    
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
    console.error('Erreur lors de la suppression du secteur:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
