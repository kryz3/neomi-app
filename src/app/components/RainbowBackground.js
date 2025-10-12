'use client';

import { useState, useEffect } from 'react';

export default function RainbowBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Générer 25 bandes avec des couleurs déterministes (basées sur l'index) - version statique
  const bands = Array.from({ length: 25 }, (_, i) => {
    const colorCombinations = [
      ['#AC0C61', '#435EB8', '#D6D6D6'], // accent, secondary, light
      ['#AC0C61', '#D6D6D6', '#435EB8'], // accent, light, secondary
      ['#D6D6D6', '#AC0C61', '#435EB8'], // light, accent, secondary
      ['#D6D6D6', '#435EB8', '#AC0C61'], // light, secondary, accent
      ['#435EB8', '#D6D6D6', '#AC0C61'], // secondary, light, accent
      ['#435EB8', '#AC0C61', '#D6D6D6'], // secondary, accent, light
    ];
    // Utiliser l'index pour sélectionner la combinaison de couleurs (déterministe)
    const combinationIndex = i % colorCombinations.length;
    const selectedCombination = colorCombinations[combinationIndex];
    
    // Position fixe basée sur l'index pour créer un motif statique
    const rightPosition = (i * 6) % 100; // Répartir les bandes sur 100vw
    
    return {
      id: i,
      colors: selectedCombination,
      rightPosition: `${rightPosition}vw`
    };
  });

  // Ne pas rendre l'animation côté serveur pour éviter l'hydratation mismatch
  if (!isClient) {
    return (
      <div className="absolute inset-0 bg-light" />
    );
  }

  // Ajout d'une image de fond légèrement floutée
  return (
    <>
      {/* Image de fond floutée */}


      {/* Bandes rainbow statiques */}
      {bands.map((band) => (
        <div
          key={band.id}
          className="absolute top-0 h-full w-0 origin-top-right transform rotate-12"
          style={{
            right: band.rightPosition,
            boxShadow: `
              -130px 0 80px 40px #D6D6D6,
              -50px 0 50px 25px ${band.colors[0]},
              0 0 50px 25px ${band.colors[1]},
              50px 0 50px 25px ${band.colors[2]},
              130px 0 80px 40px #D6D6D6
            `,
          }}
        />
      ))}

      {/* Ombres horizontales et verticales pour adoucir les bords */}
      <div 
        className="absolute bottom-0 left-0 w-full h-0"
        style={{
          boxShadow: '0 0 50vh 40vh #D6D6D6'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-0 h-full"
        style={{
          boxShadow: '0 0 35vw 25vw #D6D6D6'
        }}
      />
            <img
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-65 w-full " src="/bg.webp"
      />
    </>
  );
}
