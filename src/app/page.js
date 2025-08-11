import Organigramme from "@/app/components/Organigramme"

export const metadata = {
  title: "Accueil - Neomi",
  description: "Bienvenue sur le site officiel de Neomi",
};

export default function Home() {
  return (
    <div className="">
      {/* Section 1 */}
      <section className="w-full flex items-center justify-center bg-light flex-col mt-16" style={{height: 'calc(100vh - 4rem)'}}>
        <div className="flex flex-col w-2/3 md:w-1/3 mx-auto ">
          <h1 className="text-accent text-center text-5xl font-semibold">
            Gagnez du temps grâce à votre expert-comptable
          </h1>
           </div>
          <div className="mt-5 text-xl md:w-full w-2/3">
          <h2 className="text-secondary text-center">
            Un accompagnement quotidien par des des professionnels
          </h2>
          <h2 className="text-secondary text-center">
            Une solution adaptée à vos besoins
          </h2>
          </div>
      </section>
            {/* Section 2 */}
      <section className="w-full flex items-center justify-center bg-secondary flex-col" style={{height: 'calc(100vh - 4rem)'}}>

      
 <Organigramme /> 
      </section>
    </div>
  );
}
