

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Organigramme() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);

  // Gérer l'overflow du body quand le popup mobile est ouvert
  useEffect(() => {
    if (isMobilePopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobilePopupOpen]);

  const members = [
    {
      name: "Mohamed",
      role: "Expert-Comptable et conseiller",
      img: "/organigramme/mohamed.webp",
      description:
        "Mohamed est bien plus qu'un expert-comptable. Titulaire du DEC et d'un DU Conseil en Gestion de Patrimoine, il est votre interlocuteur privilégié au sein du cabinet. Son écoute attentive et sa réactivité font de lui le partenaire idéal pour naviguer dans le monde complexe de l'entrepreneuriat. Passionné par la fiscalité et la gestion de patrimoine, il est très proche de ses clients et met un point d'honneur à trouver une solution adaptée à leurs besoins.",
      mail: "mna@neomi.fr",
      phone: "+33 6 78 29 60 28",
    },
    {
      name: "Agnès",
      role: "Expert-Comptable et conseiller",
      img: "/organigramme/agnes.webp",
      description:
        "Agnès apporte une expertise précieuse au cabinet avec sa formation approfondie en expertise comptable. Son approche méthodique et sa passion pour les chiffres en font une conseillère de choix pour nos clients. Elle excelle dans l'optimisation fiscale et accompagne avec bienveillance les entrepreneurs dans leurs projets.",
      mail: "agnes@neomi.fr",
      phone: "+33 6 78 29 60 29",
    },
    {
      name: "Ty Leng",
      role: "Expert-Comptable et conseiller",
      img: "/organigramme/tyleng.webp",
      description:
        "Ty Leng combine expertise technique et vision stratégique. Fort de son expérience internationale, il apporte une approche moderne et innovante à la gestion comptable. Sa capacité d'adaptation et son sens du relationnel font de lui un atout précieux pour nos clients internationaux.",
      mail: "tyleng@neomi.fr",
      phone: "+33 6 78 29 60 30",
    },
    {
      name: "Eugénie",
      role: "Expert-Comptable et conseiller",
      img: "/organigramme/eugenie.webp",
      description:
        "Eugénie se distingue par sa créativité dans la résolution de problèmes complexes. Spécialisée dans l'accompagnement des startups et des entreprises en croissance, elle sait allier rigueur comptable et conseil stratégique pour optimiser la performance de nos clients.",
      mail: "eugenie@neomi.fr",
      phone: "+33 6 78 29 60 31",
    },
    {
      name: "Inès",
      role: "Expert-Comptable et conseiller",
      img: "/organigramme/ines.webp",
      description:
        "Inès apporte une touche de modernité au cabinet avec sa maîtrise des outils digitaux. Passionnée par l'innovation en comptabilité, elle accompagne nos clients dans leur transformation numérique tout en maintenant l'excellence de nos services traditionnels.",
      mail: "ines@neomi.fr",
      phone: "+33 6 78 29 60 32",
    },
  ];

  // Calculer la taille optimale de la grille basée sur le nombre de membres
  const gridSize = Math.ceil(Math.sqrt(members.length));
  const totalCells = gridSize * gridSize;

  // Créer le tableau des cases avec membres et cases vides
  const gridCells = Array.from({ length: totalCells }, (_, index) => {
    return index < members.length ? members[index] : null;
  });

  const selectedMember = hoveredIndex !== null && hoveredIndex < members.length ? members[hoveredIndex] : null;

  // Membre actuellement affiché (priorité au sélectionné, sinon au hover)
  const displayedMemberIndex = selectedIndex !== null ? selectedIndex : hoveredIndex;
  const displayedMember = displayedMemberIndex !== null && displayedMemberIndex < members.length ? members[displayedMemberIndex] : null;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 flex items-center justify-center relative">
      {/* Layout Desktop - inchangé */}
      <div className="hidden sm:flex gap-12 w-full max-w-full h-full justify-center items-center px-8">
        {/* Échiquier Desktop */}
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-light mb-10 text-2xl">Un cabinet à taille humaine</h1>
          <div 
            className="grid gap-3 aspect-square w-[500px] h-[500px]"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {gridCells.map((member, index) => {
              const row = Math.floor(index / gridSize);
              const col = index % gridSize;
              const isEvenRow = row % 2 === 0;
              const isEvenCol = col % 2 === 0;
              const isDarkSquare = isEvenRow ? isEvenCol : !isEvenCol;
              const isHovered = hoveredIndex === index;
              const isSelected = selectedIndex === index;
              const isActive = isSelected || isHovered;
              const hasMember = member !== null;
              
              return (
                <div
                  key={index}
                  className={`relative aspect-square transition-all duration-300 ease-out ${
                    hasMember ? 'cursor-pointer' : ''
                  } ${isActive ? 'scale-110 z-10' : 'hover:scale-105'}`}
                  onMouseEnter={() => hasMember && setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => hasMember && setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  {hasMember ? (
                    /* Case avec membre */
                    <div className={`w-full h-full rounded-lg overflow-hidden transition-all duration-300 ${
                      isDarkSquare 
                        ? 'bg-slate-700 shadow-xl' 
                        : 'bg-slate-600 shadow-xl'
                    } ${isSelected 
                        ? 'ring-4 ring-blue-400 shadow-2xl shadow-blue-500/50' 
                        : isHovered 
                        ? 'ring-2 ring-blue-300'
                        : 'hover:ring-2 hover:ring-blue-300'
                    }`}>
                      {/* Photo */}
                      <div className="relative h-4/5">
                        <Image
                          src={member.img}
                          alt={member.name}
                          fill
                          className={`object-cover transition-all duration-300 ${
                            isActive ? 'brightness-110 contrast-110' : 'brightness-90'
                          }`}
                          sizes="(max-width: 768px) 25vw, 20vw"
                        />
                        <div className={`absolute inset-0 transition-opacity duration-300 ${
                          isDarkSquare 
                            ? 'bg-gradient-to-t from-slate-900/60 to-transparent' 
                            : 'bg-gradient-to-t from-slate-800/60 to-transparent'
                        } ${isActive ? 'opacity-30' : 'opacity-60'}`} />
                      </div>
                      
                      {/* Nom */}
                      <div className={`h-1/5 flex items-center justify-center px-2 ${
                        isDarkSquare 
                          ? 'bg-slate-800' 
                          : 'bg-slate-700'
                      } ${isSelected ? 'bg-blue-600' : isHovered ? 'bg-blue-700' : ''}`}>
                        <h3 className="text-white font-semibold text-xs text-center leading-tight truncate">
                          {member.name}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    /* Case vide */
                    <div className={`w-full h-full rounded-lg ${
                      isDarkSquare 
                        ? 'bg-slate-800/40' 
                        : 'bg-slate-700/40'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panneau d'informations à droite */}
        <div className="w-[450px] h-full flex flex-col">
          {displayedMember ? (
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 shadow-2xl animate-in slide-in-from-right-5 duration-500 h-full overflow-hidden flex flex-col">
              {/* Photo principale */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg flex-shrink-0">
                <Image
                  src={displayedMember.img}
                  alt={displayedMember.name}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h2 className="text-xl font-bold text-white mb-1">{displayedMember.name}</h2>
                  <p className="text-blue-300 font-medium text-sm">{displayedMember.role}</p>
                </div>
              </div>

              {/* Contenu en une seule colonne */}
              <div className="flex-1 space-y-6 min-h-0 overflow-y-auto">
                {/* À propos */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">À propos</h3>
                  <p className="text-slate-300 leading-relaxed text-base">
                    {displayedMember.description}
                  </p>
                </div>

                {/* Contact */}
                <div>
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${displayedMember.mail}`}
                      className="flex-1 flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all duration-300 border border-blue-500/30 group"
                    >
                      <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-400 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm">Email</p>
                        <p className="text-blue-300 text-xs break-all">{displayedMember.mail}</p>
                      </div>
                    </a>

                    <a
                      href={`tel:${displayedMember.phone}`}
                      className="flex-1 flex items-center gap-3 p-3 bg-green-600/20 hover:bg-green-600/30 rounded-xl transition-all duration-300 border border-green-500/30 group"
                    >
                      <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-400 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm">Téléphone</p>
                        <p className="text-green-300 text-xs truncate">{displayedMember.phone}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* État par défaut */
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Sélectionnez un membre</h3>
                <p className="text-slate-400">Survolez ou cliquez sur une case pour découvrir l'équipe</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout Mobile - avec popup */}
      <div className="sm:hidden flex flex-col items-center justify-center w-full h-full p-4">
        <h1 className="text-light mb-6 text-lg text-center">Un cabinet à taille humaine</h1>
        
        {/* Grille mobile compacte */}
        <div 
          className="grid gap-2 w-full max-w-xs"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {gridCells.map((member, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const isEvenRow = row % 2 === 0;
            const isEvenCol = col % 2 === 0;
            const isDarkSquare = isEvenRow ? isEvenCol : !isEvenCol;
            const hasMember = member !== null;
            
            return (
              <div
                key={`mobile-${index}`}
                className={`relative aspect-square transition-all duration-300 ${
                  hasMember ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (hasMember) {
                    setSelectedIndex(index);
                    setIsMobilePopupOpen(true);
                  }
                }}
              >
                {hasMember ? (
                  <div className={`w-full h-full rounded-lg overflow-hidden shadow-lg ${
                    isDarkSquare ? 'bg-slate-700' : 'bg-slate-600'
                  }`}>
                    {/* Photo mobile très petite */}
                    <div className="relative h-3/4">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    </div>
                    
                    {/* Nom mobile très petit */}
                    <div className="h-1/4 flex items-center justify-center px-1 bg-slate-800">
                      <h3 className="text-white font-medium text-[8px] text-center leading-tight truncate">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className={`w-full h-full rounded-lg ${
                    isDarkSquare ? 'bg-slate-800/20' : 'bg-slate-700/20'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-slate-400 text-sm mt-4 text-center">
          Touchez une case pour découvrir l'équipe
        </p>
      </div>

      {/* Popup Mobile */}
      {isMobilePopupOpen && selectedIndex !== null && members[selectedIndex] && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{ overflowY: 'hidden' }}
          onClick={() => setIsMobilePopupOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 rounded-2xl p-6 max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header popup avec bouton fermer */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {members[selectedIndex].name}
              </h2>
              <button
                onClick={() => setIsMobilePopupOpen(false)}
                className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Photo popup mobile */}
            <div className="relative h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
              <Image
                src={members[selectedIndex].img}
                alt={members[selectedIndex].name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-blue-300 font-medium text-sm">{members[selectedIndex].role}</p>
              </div>
            </div>

            {/* Contenu popup mobile */}
            <div className="space-y-6">
              {/* À propos */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">À propos</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {members[selectedIndex].description}
                </p>
              </div>

              {/* Contact */}
              <div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${members[selectedIndex].mail}`}
                    className="flex-1 flex items-center gap-2 p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-all duration-300 border border-blue-500/30"
                  >
                    <div className="p-1.5 bg-blue-500 rounded">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-xs">Email</p>
                      <p className="text-blue-300 text-[10px] truncate">{members[selectedIndex].mail}</p>
                    </div>
                  </a>

                  <a
                    href={`tel:${members[selectedIndex].phone}`}
                    className="flex-1 flex items-center gap-2 p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-all duration-300 border border-green-500/30"
                  >
                    <div className="p-1.5 bg-green-500 rounded">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-xs">Téléphone</p>
                      <p className="text-green-300 text-[10px] truncate">{members[selectedIndex].phone}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
