"use client";
import { useState, useEffect, useRef } from "react";

export default function Avis() {
  const avisList = [
    {
      entreprise: "XEFI",
      logo: "/avis/xefi.webp",
      referent: "Jerome CANU",
      role: "Dirigeant",
      recommandation: `Nous sommes clients depuis plus de huit ans auprès du cabinet Neomi.
Nous apprécions l'écoute, le conseil et la multitude de services : RH, expertise comptable et autres.
C'est un cabinet à taille humaine capable de s'adapter à différentes formes juridiques.`,
    },
    {
      entreprise: "O'Sign",
      logo: "/avis/osign.webp",
      referent: "Houcine CHEDRI",
      role: "Gérant",
      recommandation: `J'ai connu la société Neomi en novembre 2018.
Ce qui m'a plu dans cette collaboration, c'est la disponibilité, les conseils apportés ainsi que cette relation de confiance mutuelle.
Pour toutes ces raisons, je ne peux que recommander ce cabinet comptable.`,
    },
    {
      entreprise: "SOS Raymond",
      logo: null,
      referent: "Edwige Navarro",
      role: "Dirigeante",
      recommandation: `Je travaille avec Neomi depuis la création de mon entreprise en octobre 2020, suite à la recommandation de mon avocate. Ce qui me plaît chez Neomi : les échanges faciles et réguliers au cours des années écoulées, ainsi que la disponibilité et les explications claires et détaillées selon le niveau de compréhension.`,
    },
    {
      entreprise: "Natreflexo",
      logo: "/avis/natreflexo.webp",
      referent: "Nathalie MAYENS",
      role: "Gérante",
      recommandation: `Je travaille avec le Cabinet NEOMI depuis 2018, qui m'a été chaleureusement recommandé par une relation commune.
Résultat : Gain immédiat pour moi de 20% de mon CA quant à mon régime de TVA. Professionnalisme et disponibilité. Neomi est un vrai partenaire, réactif et force de proposition.`,
    },
    {
      entreprise: "CANIS CONSULTING",
      logo: null,
      referent: "Abdelhafid CHABANE",
      role: "Président",
      recommandation: `Je travaille avec le cabinet Neomi depuis 5 ans maintenant, suite à la recommandation d'un de mes collègues entrepreneur.
Je travaille dans l'informatique, et fais entièrement confiance au cabinet Neomi pour tous mes travaux de comptabilité (bilan annuel, fiches de paie et diverses déclarations, partie juridique, optimisation fiscale…).
Je recommande vivement le cabinet Neomi : en plus de réaliser les travaux avec beaucoup de professionnalisme, ils sont toujours à l'écoute et répondent à nos diverses questions et demandes de conseils.`,
    },
    {
      entreprise: "VNAF",
      logo: "/avis/vnaf.webp",
      referent: "Nathalie VIAUD",
      role: "Gérante",
      recommandation: ` J'ai fait la connaissance du cabinet NEOMI lorsque j'exerçais mon activité en qualité de travailleur indépendant à COMBS LA VILLE. Nous avons dans un premier temps échangé sur des dossiers, puis c'est en 2017 que j'ai missionné le cabinet NEOMI afin qu'il s'occupe en direct de ma propre comptabilité.
Un travail important et exhaustif de reprise de ma comptabilité a été réalisé et depuis cette période, ma comptabilité est parfaitement bien tenue par le cabinet, ce qui est un atout précieux pour moi pour exercer mon activité de la manière la plus sereine possible.
Je recommande vivement le cabinet NEOMI pour ses qualités humaines, d'écoute et d'attention, ainsi que pour les compétences et le professionnalisme des membres de son équipe.`,
    },
  ];

  // Nouveau coverflow 3D moderne, robuste et fluide
  // On duplique la liste pour plus de cartes visibles et des transitions plus douces
  const displayList = [...avisList, ...avisList];
  const len = displayList.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef(null);
  const [vw, setVw] = useState(0);

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
    resetAutoplay();
    return () => autoplayRef.current && clearInterval(autoplayRef.current);
  }, [currentIndex, len]);

  // Centrage horizontal déterministe via math (pas de mesure DOM nécessaire)

  const goToPrevious = () => {
    setCurrentIndex((i) => (i - 1 + len) % len);
    resetAutoplay();
  };
  const goToNext = () => {
    setCurrentIndex((i) => (i + 1) % len);
    resetAutoplay();
  };

  // Utilitaire pour obtenir l'offset circulaire [-half..+half]
  const circularOffset = (idx) => {
    let off = (idx - currentIndex + len) % len; // [0..len-1]
    if (off > len / 2) off = off - len; // vers [-floor..+floor]
    return off; // négatif à gauche, positif à droite
  };

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
