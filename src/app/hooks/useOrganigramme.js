import { useState, useEffect } from 'react';

export function useOrganigramme() {
  const [organigrammes, setOrganigrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganigrammes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/organigrammes');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des membres');
      }
      
      const data = await response.json();
      setOrganigrammes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchOrganigrammes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrganigramme = async (organigrammeData) => {
    try {
      const response = await fetch('/api/organigrammes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organigrammeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du membre');
      }

      const newOrganigramme = await response.json();
      return { success: true, data: newOrganigramme };
    } catch (err) {
      console.error('Erreur createOrganigramme:', err);
      return { success: false, error: err.message };
    }
  };

  const updateOrganigramme = async (id, organigrammeData) => {
    try {
      const response = await fetch(`/api/organigrammes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organigrammeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du membre');
      }

      const updatedOrganigramme = await response.json();
      return { success: true, data: updatedOrganigramme };
    } catch (err) {
      console.error('Erreur updateOrganigramme:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteOrganigramme = async (id) => {
    try {
      const response = await fetch(`/api/organigrammes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du membre');
      }

      return { success: true };
    } catch (err) {
      console.error('Erreur deleteOrganigramme:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchOrganigrammes();
  }, []);

  return {
    organigrammes,
    loading,
    error,
    createOrganigramme,
    updateOrganigramme,
    deleteOrganigramme,
    refreshOrganigrammes: fetchOrganigrammes
  };
}
