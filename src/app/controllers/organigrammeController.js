import dbConnect from '../lib/mongodb';
import Organigramme from '../models/Organigramme';

// Obtenir tous les membres de l'organigramme
export const getOrganigrammes = async () => {
  try {
    await dbConnect();
    
    // Récupérer tous les membres triés par ordre
    const organigrammes = await Organigramme.find({}).sort({ ordre: 1 });
    
    return { success: true, data: organigrammes };
  } catch (error) {
    console.error('Erreur getOrganigrammes:', error);
    return { success: false, error: error.message };
  }
};

// Créer un nouveau membre de l'organigramme
export const createOrganigramme = async (organigrammeData) => {
  try {
    await dbConnect();

    // Si aucune photo n'est fournie, utiliser la valeur par défaut
    if (!organigrammeData.photo || organigrammeData.photo.trim() === '') {
      organigrammeData.photo = '/organigramme/default.webp';
    }

    // Vérifier si l'ordre est déjà utilisé
    if (organigrammeData.ordre) {
      const existingOrganigramme = await Organigramme.findOne({ ordre: organigrammeData.ordre });
      if (existingOrganigramme) {
        return {
          success: false,
          error: `L'ordre ${organigrammeData.ordre} est déjà utilisé par un autre membre`
        };
      }
    }

    const organigramme = new Organigramme(organigrammeData);
    await organigramme.save();
    
    return {
      success: true,
      data: organigramme
    };
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error);
    
    // Gestion spécifique des erreurs de contrainte unique
    if (error.code === 11000 && error.keyPattern && error.keyPattern.ordre) {
      return {
        success: false,
        error: `L'ordre ${error.keyValue.ordre} est déjà utilisé par un autre membre`
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

// PUT - Mettre à jour un membre de l'organigramme
export const updateOrganigramme = async (id, updateData) => {
  try {
    await dbConnect();

    // Si on met à jour l'ordre, vérifier qu'il n'est pas déjà utilisé
    if (updateData.ordre) {
      const existingOrganigramme = await Organigramme.findOne({ 
        ordre: updateData.ordre,
        _id: { $ne: id } // Exclure le membre actuel
      });
      if (existingOrganigramme) {
        return {
          success: false,
          error: `L'ordre ${updateData.ordre} est déjà utilisé par un autre membre`
        };
      }
    }

    const organigramme = await Organigramme.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!organigramme) {
      return {
        success: false,
        error: 'Membre non trouvé'
      };
    }

    return {
      success: true,
      data: organigramme
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    
    // Gestion spécifique des erreurs de contrainte unique
    if (error.code === 11000 && error.keyPattern && error.keyPattern.ordre) {
      return {
        success: false,
        error: `L'ordre ${error.keyValue.ordre} est déjà utilisé par un autre membre`
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

// DELETE - Supprimer un membre de l'organigramme
export const deleteOrganigramme = async (id) => {
  try {
    await dbConnect();
    
    const organigramme = await Organigramme.findByIdAndDelete(id);
    
    if (!organigramme) {
      return {
        success: false,
        error: 'Membre non trouvé'
      };
    }

    return {
      success: true,
      data: organigramme
    };
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
