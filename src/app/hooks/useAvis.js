// Hook personnalisé pour récupérer les avis depuis l'API
import { useState, useEffect } from 'react';

export function useAvis() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/avis');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAvis(data.data);
        setError(null);
      } else {
        throw new Error(data.error || 'Erreur lors de la récupération des avis');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
      setError(err.message);
      setAvis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  return {
    avis,
    setAvis,
    loading,
    error,
    refetch: fetchAvis
  };
}

// Fonction utilitaire pour créer un avis
export async function createAvis(avisData) {
  try {
    const response = await fetch('/api/avis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avisData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Erreur HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    throw error;
  }
}

// Fonction utilitaire pour mettre à jour un avis
export async function updateAvis(id, updateData) {
  try {
    const response = await fetch(`/api/avis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Erreur HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    throw error;
  }
}

// Fonction utilitaire pour mettre à jour un champ spécifique
export async function updateAvisField(id, field, value) {
  try {
    const response = await fetch(`/api/avis/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, value }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Erreur HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du champ:', error);
    throw error;
  }
}

// Fonction utilitaire pour supprimer un avis
export async function deleteAvis(id) {
  try {
    const response = await fetch(`/api/avis/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Erreur HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    throw error;
  }
}
