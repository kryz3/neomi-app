import Organigramme from "@/app/components/Organigramme";
import RainbowBackground from "@/app/components/RainbowBackground";

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
        className="w-full flex items-center justify-center bg-accent flex-col snap-start"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <h1>Des services complets du stade projet à la vie de votre entreprise</h1>
      </section>
    </>
  );
}
