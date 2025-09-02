"use client";

import { useEffect } from 'react';
import { useSecteursData } from '../context/SecteursContext';

export default function PreloadSecteurs() {
  const { fetchSecteurs, isPreloaded } = useSecteursData();

  useEffect(() => {
    // Précharger les secteurs dès que ce composant est monté
    if (!isPreloaded) {
      fetchSecteurs().catch(console.error);
    }
  }, [fetchSecteurs, isPreloaded]);

  // Ce composant ne rend rien, il sert juste à déclencher le préchargement
  return null;
}
