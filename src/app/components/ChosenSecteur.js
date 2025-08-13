"use client";

export default function ChosenSecteur({ secteur, onClose }) {
  if (!secteur) return null;

  return (
    <section 
      className="w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary to-gray-800 snap-start transition-all duration-700 ease-out h-[calc(100vh-4rem)]"
      id="chosen-secteur"
    >
      {/* Image d'arrière-plan avec overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={secteur.icone}
          alt={secteur.nom}
          className="w-full h-full object-cover opacity-100 blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-primary/50 to-gray-800/80"></div>
      </div>

      {/* Effet de grille futuriste en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-16 grid-rows-12 h-full">
          {Array.from({ length: 192 }).map((_, i) => (
            <div
              key={i}
              className="border-accent/20 border-r border-b animate-pulse"
              style={{
                animationDelay: `${i * 30}ms`,
                animationDuration: '6s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-8  max-w-7xl mx-auto">
        {/* En-tête du secteur */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <div className="flex items-center mb-4 md:mb-6">
            <span className="inline-block px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-bold text-accent bg-gray-900/80 rounded-full border border-accent/30 mr-3 md:mr-4">
              {secteur.ordre ? secteur.ordre.toString().padStart(2, '0') : '00'}
            </span>
            <div className="flex-1 h-1 bg-gradient-to-r from-accent via-white to-transparent"></div>
          </div>
          
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight">
            {secteur.nom}
          </h1>
          
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-accent to-transparent"></div>
        </div>

        {/* Contenu principal en grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          
          {/* Colonne gauche */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Enjeux */}
            <div className="group">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-accent rounded-full mr-2 md:mr-3 group-hover:shadow-lg group-hover:shadow-accent/50 transition-all duration-300"></div>
                <h2 className="text-xs md:text-lg lg:text-xl font-bold text-accent group-hover:text-white transition-colors duration-300">
                  ENJEUX
                </h2>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-accent/20 rounded-xl md:rounded-2xl p-3 md:p-6 group-hover:border-accent/40 transition-all duration-300">
                <p className="text-gray-300 text-xs md:text-base lg:text-lg leading-tight md:leading-relaxed whitespace-pre-line" style={{ fontSize: '11px' }}>
                  {secteur.enjeux}
                </p>
              </div>
            </div>

            {/* Accompagnement */}
            <div className="group">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-accent rounded-full mr-2 md:mr-3 group-hover:shadow-lg group-hover:shadow-accent/50 transition-all duration-300"></div>
                <h2 className="text-xs md:text-lg lg:text-xl font-bold text-accent group-hover:text-white transition-colors duration-300">
                  ACCOMPAGNEMENT
                </h2>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-accent/20 rounded-xl md:rounded-2xl p-3 md:p-6 group-hover:border-accent/40 transition-all duration-300">
                <p className="text-gray-300 text-xs md:text-base lg:text-lg leading-tight md:leading-relaxed whitespace-pre-line" style={{ fontSize: '11px' }}>
                  {secteur.accompagnement}
                </p>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Résultats */}
            <div className="group">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-accent rounded-full mr-2 md:mr-3 group-hover:shadow-lg group-hover:shadow-accent/50 transition-all duration-300"></div>
                <h2 className="text-xs md:text-lg lg:text-xl font-bold text-accent group-hover:text-white transition-colors duration-300">
                  RÉSULTATS
                </h2>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-accent/20 rounded-xl md:rounded-2xl p-3 md:p-6 group-hover:border-accent/40 transition-all duration-300">
                <p className="text-gray-300 text-xs md:text-base lg:text-lg leading-tight md:leading-relaxed whitespace-pre-line" style={{ fontSize: '11px' }}>
                  {secteur.resultats}
                </p>
              </div>
            </div>

            {/* Mini cas */}
            <div className="group">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-accent rounded-full mr-2 md:mr-3 group-hover:shadow-lg group-hover:shadow-accent/50 transition-all duration-300"></div>
                <h2 className="text-xs md:text-lg lg:text-xl font-bold text-accent group-hover:text-white transition-colors duration-300">
                  CAS PRATIQUES
                </h2>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-accent/20 rounded-xl md:rounded-2xl p-3 md:p-6 group-hover:border-accent/40 transition-all duration-300">
                <p className="text-gray-300 text-xs md:text-base lg:text-lg leading-tight md:leading-relaxed whitespace-pre-line" style={{ fontSize: '11px' }}>
                  {secteur.minicas}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ligne de scan animée */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>
    </section>
  );
}