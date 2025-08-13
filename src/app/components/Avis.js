"use client";
import { useState, useEffect, useRef } from "react";
import { useAvis } from "../hooks/useAvis";

export default function Avis() {
  // Utilisation du hook pour récupérer les avis depuis l'API
  const { avis: avisList, loading, error } = useAvis();

  // Tous les hooks doivent être appelés AVANT les return conditionnels
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef(null);
  const [vw, setVw] = useState(0);

  // Nouveau coverflow 3D moderne, robuste et fluide
  // On utilise la liste originale sans duplication
  const displayList = avisList;
  const len = displayList.length;

  // Mesure du viewport pour adapter l'espacement
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth || 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const spacing = vw < 640 ? 160 : vw < 1024 ? 200 : 240; // espace entre cartes
  const centerBias = vw < 640 ? 150 : vw < 1024 ? 50 : 50; // léger décalage à droite

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % len);
    }, 6000);
  };

  useEffect(() => {
    if (len > 0) {
      resetAutoplay();
      return () => autoplayRef.current && clearInterval(autoplayRef.current);
    }
  }, [currentIndex, len]);

  // Utilitaire pour obtenir l'offset circulaire [-half..+half]
  const circularOffset = (idx) => {
    let off = (idx - currentIndex + len) % len; // [0..len-1]
    if (off > len / 2) off = off - len; // vers [-floor..+floor]
    return off; // négatif à gauche, positif à droite
  };

  const goToPrevious = () => {
    setCurrentIndex((i) => (i - 1 + len) % len);
    resetAutoplay();
  };
  const goToNext = () => {
    setCurrentIndex((i) => (i + 1) % len);
    resetAutoplay();
  };

  // Gestion des états de chargement et d'erreur APRÈS tous les hooks
  if (loading) {
    return (
      <div className="relative w-full h-[350px] md:h-[350] lg:h-[350px] overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des avis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-[350px] md:h-[350] lg:h-[350px] overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erreur lors du chargement des avis</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (avisList.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-[350] lg:h-[350px] overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucun avis disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
  <div className="relative w-full h-[350px] md:h-[350] lg:h-[350px] overflow-hidden">
      {/* Boutons de contrôle */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-accent text-white hover:bg-accent/80 p-3 rounded-full shadow-xl border-2 border-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-accent text-white hover:bg-accent/80 p-3 rounded-full shadow-xl border-2 border-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Stage Coverflow 3D */}
      <div className="relative h-full" style={{ perspective: '1000px' }}>
  {displayList.map((avis, index) => {
          const off = circularOffset(index); // ex: -2,-1,0,+1,+2
          const dist = Math.abs(off);
          const scale = off === 0 ? 1 : off === -1 || off === 1 ? 0.95 : 0.9;
          const rotate = off * -10; // degrés
          const translateX = off * spacing; // px
          const opacity = off === 0 ? 1 : dist === 1 ? 0.95 : 0.8;
          const z = 100 - dist; // priorise la carte du centre

          return (
            <div
              key={`${avis.entreprise}-${index}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 cursor-pointer"
              style={{
                transform: `translate(-50%, -48%) translateX(${translateX + centerBias}px) rotateY(${rotate}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
                transition: 'transform 700ms ease, opacity 700ms ease',
                opacity,
                zIndex: z,
              }}
              onClick={() => {
                setCurrentIndex(index);
                resetAutoplay();
              }}
            >
              <div className="bg-white p-6 rounded-xl shadow-xl w-80 md:w-96 h-72 flex flex-col transform-gpu">
                <div className="flex items-center gap-4 mb-6">
                  {avis.logo && avis.logo.trim() !== "" ? (
                    <img
                      src={avis.logo}
                      alt={avis.entreprise}
                      className="w-12 h-12 object-contain flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {avis.entreprise.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-primary text-base truncate">{avis.entreprise}</h3>
                    <p className="text-gray-600 text-xs truncate">{avis.referent}</p>
                    <p className="text-accent font-medium text-xs">{avis.role}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-700 text-xs leading-relaxed text-justify">
                    "{avis.recommandation}"
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicateurs en bas */}
  {/* Dots retirés */}
    </div>
  );
}
