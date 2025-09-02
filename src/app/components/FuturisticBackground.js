"use client";
import { useState, useEffect } from "react";

export default function FuturisticBackground({ 
  gridOpacity = "opacity-10", 
  particleCount = 20,
  gridCols = 12,
  gridRows = 8 
}) {
  const [particles, setParticles] = useState([]);

  // Générer les particules côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    const generatedParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 2
    }));
    setParticles(generatedParticles);
  }, [particleCount]);

  return (
    <>
      {/* Effet de grille futuriste en arrière-plan */}
      <div className={`absolute inset-0 ${gridOpacity}`}>
        <div className={`grid grid-cols-${gridCols} grid-rows-${gridRows} h-full`}>
          {Array.from({ length: gridCols * gridRows }).map((_, i) => (
            <div
              key={i}
              className="border-accent/20 border-r border-b animate-pulse"
              style={{
                animationDelay: `${i * 50}ms`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-accent rounded-full animate-ping"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>
    </>
  );
}
