"use client";
import { useState } from "react";
import { useSecteursData } from "../context/SecteursContext";
import ChosenSecteur from "./ChosenSecteur";

export default function Secteurs() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const { secteurs, isLoading, error } = useSecteursData();

  const handleSecteurClick = (secteur) => {
    setSelectedSecteur(secteur);
    // Scroll vers la section du secteur choisi avec un délai pour permettre le rendu
    setTimeout(() => {
      const element = document.getElementById('chosen-secteur');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleCloseSecteur = () => {
    setSelectedSecteur(null);
    // Scroll vers la section des secteurs
    setTimeout(() => {
      const element = document.getElementById('secteurs-grid');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <section 
        className="w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary to-gray-800 snap-start flex items-center justify-center"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white">Chargement des secteurs...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-400 text-xl">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <>
      <section 
        id="secteurs-grid"
        className="w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary to-gray-800 snap-start flex items-center justify-center"
        style={{ height: "calc(100vh - 5rem)" }}
      >
      {/* Effet de grille futuriste en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full">
          {Array.from({ length: 96 }).map((_, i) => (
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
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 py-8 w-full">
        {/* Titre futuriste */}
        <div className="text-center mb-8 md:mb-12">

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide">
            DOMAINES D'EXPERTISE NEOMI
          </p>
        </div>

        {/* Grille en échiquier moderne */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
          {secteurs.map((secteur, index) => {
            // Logique pour décaler les lignes (échiquier)
            const row = Math.floor(index / 4);
            const isEvenRow = row % 2 === 0;
            const colStart = isEvenRow ? '' : 'md:col-start-2';
            
            return (
              <div
                key={secteur._id}
                className={`relative group cursor-pointer transform transition-all duration-500 ease-out ${
                  hoveredIndex === index 
                    ? 'scale-110 z-20' 
                    : hoveredIndex !== null 
                      ? 'scale-95 opacity-70' 
                      : 'scale-100'
                } ${colStart}`}
                style={{
                  gridColumn: typeof window !== 'undefined' && window.innerWidth >= 768 && index >= 8 ? 'span 2' : 'span 1'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSecteurClick(secteur)}
              >
                {/* Container principal avec effet holographique */}
                <div className="relative h-24 md:h-40 overflow-hidden rounded-xl md:rounded-2xl border border-accent/30 bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-sm">
                  {/* Image d'arrière-plan floutée */}
                  <div className="absolute inset-0">
                    <img
                      src={secteur.icone}
                      alt={secteur.nom}
                      className="w-full h-full object-cover opacity-30 blur-sm group-hover:blur-none group-hover:opacity-50 transition-all duration-700"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-800/70 to-transparent"></div>
                  </div>

                  {/* Effet de scan futuriste */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent transform -skew-y-12 group-hover:animate-pulse"></div>

                  {/* Bordures lumineuses */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 rounded-2xl transition-all duration-500"></div>
                  
                  {/* Coin lumineux */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full opacity-60 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-accent/50 transition-all duration-300"></div>

                  {/* Contenu */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-2 md:p-4">
                    {/* Numéro du secteur */}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                      <span className="inline-block px-2 py-1 text-xs font-bold text-accent bg-gray-900/80 rounded-full border border-accent/30">
                        {secteur.ordre ? secteur.ordre.toString().padStart(2, '0') : (index + 1).toString().padStart(2, '0')}
                      </span>
                    </div>

                    {/* Nom du secteur */}
                    <h3 className="text-white font-bold text-xs md:text-base leading-tight group-hover:text-accent transition-colors duration-300">
                      {secteur.nom}
                    </h3>

                    {/* Barre de progression futuriste */}
                    <div className="mt-1 md:mt-3 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"
                      ></div>
                    </div>
                  </div>

                  {/* Effet de réflexion */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>

                {/* Ombre dynamique */}
                <div className="absolute -bottom-4 left-4 right-4 h-4 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* Ligne de scan animée */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>
      </div>
    </section>

    {/* Composant ChosenSecteur conditionnel */}
    <ChosenSecteur 
      secteur={selectedSecteur} 
      onClose={handleCloseSecteur} 
    />
  </>
  );
}
