import { useState, useEffect } from 'react';

export function useSecteur() {
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSecteurs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/secteurs');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des secteurs');
      }
      
      const data = await response.json();
      setSecteurs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchSecteurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSecteur = async (secteurData) => {
    try {
      const response = await fetch('/api/secteurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(secteurData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du secteur');
      }

      const newSecteur = await response.json();
      return { success: true, data: newSecteur };
    } catch (err) {
      console.error('Erreur createSecteur:', err);
      return { success: false, error: err.message };
    }
  };

  const updateSecteur = async (id, secteurData) => {
    try {
      const response = await fetch(`/api/secteurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(secteurData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du secteur');
      }

      const updatedSecteur = await response.json();
      return { success: true, data: updatedSecteur };
    } catch (err) {
      console.error('Erreur updateSecteur:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteSecteur = async (id) => {
    try {
      const response = await fetch(`/api/secteurs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du secteur');
      }

      return { success: true };
    } catch (err) {
      console.error('Erreur deleteSecteur:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSecteurs();
  }, []);

  return {
    secteurs,
    loading,
    error,
    createSecteur,
    updateSecteur,
    deleteSecteur,
    refreshSecteurs: fetchSecteurs
  };
}
