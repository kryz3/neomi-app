import dbConnect from '../lib/mongodb';
import Organigramme from '../models/Organigramme';

// Obtenir tous les membres de l'organigramme
export const getOrganigrammes = async () => {
  try {
    await dbConnect();
    const organigrammes = await Organigramme.find({}).sort({ createdAt: -1 });
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

    const organigramme = new Organigramme(organigrammeData);
    await organigramme.save();
    
    return {
      success: true,
      data: organigramme
    };
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error);
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
