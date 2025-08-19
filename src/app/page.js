import Link from "next/link";
import Organigramme from "@/app/components/Organigramme";
import RainbowBackground from "@/app/components/RainbowBackground";
import Avis from "./components/Avis";

export const metadata = {
  title: "Accueil - Neomi",
  description: "Bienvenue sur le site officiel de Neomi",
};

export default function Home() {
  return (
    <>
      {/* Section 1 */}
      <section
        className="w-full flex items-center justify-center bg-light flex-col relative overflow-hidden snap-start"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <RainbowBackground />
        <div className="flex flex-col w-2/3 md:w-1/3 mx-auto relative z-10">
          <h1 className="text-accent text-center text-5xl font-semibold  text-shadow-lg">
            Gagnez du temps grâce à votre expert-comptable
          </h1>
        </div>
        <div className="mt-5 text-xl md:w-full w-2/3 relative z-10 text-shadow-2xs">
          <h2 className="text-secondary text-center">
            Un accompagnement quotidien par des des professionnels
          </h2>
          <h2 className="text-secondary text-center text-shadow-2xs">
            Une solution adaptée à vos besoins
          </h2>
        </div>
      </section>
      {/* Section 2 */}
      <section
        className="w-full flex items-center justify-center bg-secondary flex-col snap-start"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <Organigramme />
      </section>
            {/* Section 3 */}
      <section
        className="w-full flex items-center justify-center bg-light flex-col snap-start "
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="" >
                <p className="text-xl uppercase text-center">Ce qu'ils disent de nous</p>
        <p className="text-3xl text-accent font-semibold text-center">Les avis de nos clients</p>
        </div>
        <Avis/>

      </section>
      
      {/* Section 4 */}
      <section
        className="w-full flex items-center justify-center bg-accent flex-col snap-start px-8"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="max-w-5xl mx-auto text-center h-full flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Des services complets du stade projet, à la vie de votre entreprise
          </h1>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
            {/* Service 1 */}
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 hover:rounded-tl-4xl  transition-all duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center ">
                <span className="text-sm ">1</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Projet</h3>
              <p className="text-white/90 text-xs">
                Business Plan<br></br>Choix de structure
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white/35 backdrop-blur-sm rounded-lg p-3 hover:rounded-t-4xl transition-all duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">2</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Structuration
              </h3>
              <p className="text-white/90 text-xs">
                Rédaction des statuts<br></br>Création de l'entreprise<br></br>
                Accompagnement
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 hover:rounded-tr-4xl transition-all duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">3</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Entreprise
              </h3>
              <p className="text-white/90 text-xs">
                Comptabilité<br></br>Fiscalité<br></br>Contrôle de gestion
                <br></br>Juridique
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            {/* Service 4 */}
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 hover:rounded-bl-4xl transition-all duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">6</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Cessation & Transmission
              </h3>
              <p className="text-white/90 text-xs">
                Étude du projet<br></br>Fiscalité<br></br>Pacte Dutreil
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:rounded-b-4xl transition-all duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">5</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Croissance
              </h3>
              <p className="text-white/90 text-xs">
                Embauche<br></br>Paye<br></br>Déclarations<br></br>Plan de
                financement
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-white/25 backdrop-blur-sm rounded-lg p-3 hover:rounded-br-4xl transition-all duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">4</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Dirigeants
              </h3>
              <p className="text-white/90 text-xs">
                Gestion de patrimoine<br></br>Statut marital<br></br>
                Investissements locatifs<br></br>Retraite
              </p>
            </div>
          </div>

          <Link
            href="/services"
            className="inline-block bg-white text-accent px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Section 5 - Notre histoire */}
      <section
        className="w-full flex items-center justify-center bg-primary flex-col snap-start px-8"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="max-w-6xl mx-auto text-center h-full flex flex-col justify-center">
          {/* Version Desktop - Timeline en zigzag moderne */}
          <div className="hidden md:flex relative flex-col items-center justify-center flex-1">
            <div className="mb-12">
              <p className="text-3xl uppercase text-center text-light">Notre histoire</p>
            </div>
            <div className="relative max-w-5xl mx-auto">
              {/* Ligne de connexion principale */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-secondary to-accent opacity-30 transform -translate-y-1/2"></div>
              
              {/* Container avec alternance haut/bas */}
              <div className="grid grid-cols-6 gap-8 items-center">
                
                {/* 2016 - En haut */}
                <div className="flex flex-col items-center group">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 mb-6 transform hover:-translate-y-2 shadow-lg">
                    <h4 className="text-accent font-bold text-base mb-2">2016</h4>
                    <p className="text-white text-sm text-center leading-tight">Création du cabinet à PARIS</p>
                  </div>
                  <div className="w-4 h-4 bg-accent rounded-full shadow-lg relative">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="w-px h-8 bg-accent/50"></div>
                </div>

                {/* 2018 - En bas */}
                <div className="flex flex-col items-center group">
                  <div className="w-px h-8 bg-accent/50"></div>
                  <div className="w-4 h-4 bg-accent rounded-full shadow-lg relative mb-6">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 transform hover:translate-y-2 shadow-lg">
                    <h4 className="text-accent font-bold text-base mb-2">2018</h4>
                    <p className="text-white text-sm text-center leading-tight">Mise en place d'un service RH</p>
                  </div>
                </div>

                {/* 2019 - En haut */}
                <div className="flex flex-col items-center group">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 mb-6 transform hover:-translate-y-2 shadow-lg">
                    <h4 className="text-accent font-bold text-base mb-2">2019</h4>
                    <p className="text-white text-sm text-center leading-tight">Développement en accompagnement clients et gestion du patrimoine</p>
                  </div>
                  <div className="w-4 h-4 bg-accent rounded-full shadow-lg relative">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="w-px h-8 bg-accent/50"></div>
                </div>

                {/* 2020 - En bas */}
                <div className="flex flex-col items-center group">
                  <div className="w-px h-8 bg-accent/50"></div>
                  <div className="w-4 h-4 bg-accent rounded-full shadow-lg relative mb-6">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 transform hover:translate-y-2 shadow-lg">
                    <h4 className="text-accent font-bold text-base mb-2">2020</h4>
                    <p className="text-white text-sm text-center leading-tight">Embauche d'un chargé de dossier en expertise comptable</p>
                  </div>
                </div>

                {/* 2021 - En haut */}
                <div className="flex flex-col items-center group">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 mb-6 transform hover:-translate-y-2 shadow-lg">
                    <h4 className="text-accent font-bold text-base mb-2">2021</h4>
                    <p className="text-white text-sm text-center leading-tight">Embauche d'une gestionnaire de paie et ouverture du bureau à Combs la ville</p>
                  </div>
                  <div className="w-4 h-4 bg-accent rounded-full shadow-lg relative">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="w-px h-8 bg-accent/50"></div>
                </div>

                {/* 2022 - En bas */}
                <div className="flex flex-col items-center group">
                  <div className="w-px h-8 bg-accent/50"></div>
                  <div className="w-4 h-4 bg-accent rounded-full shadow-lg relative mb-6">
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 hover:bg-white/25 transition-all duration-300 transform hover:translate-y-2 shadow-lg">
                    <h4 className="text-accent font-bold text-base mb-2">2022</h4>
                    <p className="text-white text-sm text-center leading-tight">Déménagement du bureau de Combs la ville à Moissy (Sextant)</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Version Mobile - Timeline verticale simple */}
          <div className="md:hidden space-y-6">
            <div className="mb-6">
              <p className="text-3xl uppercase text-center text-light">Notre histoire</p>
            </div>
            {[
              { year: '2016', text: 'Création du cabinet à PARIS' },
              { year: '2018', text: 'Mise en place d\'un service RH' },
              { year: '2019', text: 'Développement de nos compétences en accompagnement clients et gestion du patrimoine' },
              { year: '2020', text: 'Embauche d\'un chargé de dossier en expertise comptable' },
              { year: '2021', text: 'Embauche d\'une gestionnaire de paie et ouverture du bureau à Combs la ville' },
              { year: '2022', text: 'Déménagement du bureau de Combs la ville à Moissy (Sextant)' }
            ].map((item, index) => (
              <div key={item.year} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{item.year}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1">
                  <p className="text-white text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
