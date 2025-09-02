"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const SecteursContext = createContext();

export function useSecteursData() {
  const context = useContext(SecteursContext);
  if (!context) {
    throw new Error('useSecteursData must be used within a SecteursProvider');
  }
  return context;
}

export function SecteursProvider({ children }) {
  const [secteurs, setSecteurs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const fetchSecteurs = async () => {
    if (isPreloaded && secteurs.length > 0) {
      return secteurs; // Retourner les données déjà chargées
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/secteurs');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des secteurs');
      }
      const data = await response.json();
      setSecteurs(data);
      setIsPreloaded(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Préchargement automatique au montage du provider
  useEffect(() => {
    if (!isPreloaded && secteurs.length === 0) {
      fetchSecteurs().catch(console.error);
    }
  }, []);

  const value = {
    secteurs,
    isLoading,
    error,
    isPreloaded,
    fetchSecteurs,
    refreshSecteurs: () => {
      setIsPreloaded(false);
      setSecteurs([]);
      return fetchSecteurs();
    }
  };

  return (
    <SecteursContext.Provider value={value}>
      {children}
    </SecteursContext.Provider>
  );
}
