import ContactForm from '@/app/components/ContactForm';
import RainbowBackground from '@/app/components/RainbowBackground';

export const metadata = {
  title: "Contact - Neomi",
  description: "Contactez-nous pour plus d'informations sur nos services d'expertise comptable",
};

export default function Contact() {
  return (
    <section
      className="relative flex items-center justify-center w-full snap-start overflow-hidden"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      {/* Fond moderne avec dégradé + légère texture animée */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-100" />
      <div className="absolute inset-0 overflow-hidden">
        <RainbowBackground className="opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 h-full flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 py-8">
        
        {/* Bloc Formulaire */}
        <div className="flex-1 w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-4 md:p-6 lg:p-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Contactez-nous</h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
            Remplissez le formulaire et notre équipe reviendra vers vous rapidement.
          </p>
          <ContactForm />
        </div>

        {/* Bloc Adresses - 2 colonnes sur mobile uniquement */}
        <div className="flex-1 w-full max-w-lg flex flex-col md:flex-col gap-2 md:gap-4 lg:gap-6">
          {/* Sur mobile, les deux adresses côte à côte avec flex */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-4 lg:gap-6">
            <div className="flex-1 bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl p-1.5 md:p-3 lg:p-8">
              <h3 className="text-xs md:text-sm lg:text-xl font-semibold text-gray-800 mb-0.5 md:mb-1 lg:mb-2">Paris</h3>
              <p className="text-gray-600 text-[10px] md:text-xs lg:text-base leading-tight md:leading-relaxed">
                216 rue de Charenton<br />
                75012 Paris
              </p>
            </div>
            <div className="flex-1 bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl p-1.5 md:p-3 lg:p-8">
              <h3 className="text-xs md:text-sm lg:text-xl font-semibold text-gray-800 mb-0.5 md:mb-1 lg:mb-2">Seine-et-Marne</h3>
              <p className="text-gray-600 text-[10px] md:text-xs lg:text-base leading-tight md:leading-relaxed">
                462 rue Benjamin Delessert<br />
                77550 Moissy-Cramayel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
