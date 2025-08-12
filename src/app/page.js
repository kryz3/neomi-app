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
    </>
  );
}
