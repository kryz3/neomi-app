import ContactForm from '@/app/components/ContactForm';
import RainbowBackground from '@/app/components/RainbowBackground';

export const metadata = {
  title: "Contact - Neomi",
  description: "Contactez-nous pour plus d'informations sur nos services d'expertise comptable",
};

export default function Contact() {
  return (
    <>
      {/* Section principale avec formulaire */}
      <section 
        className="w-full flex items-center justify-center bg-light flex-col relative overflow-hidden snap-start"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <RainbowBackground />
        
        <div className="container mx-auto px-4 py-4 relative z-10 h-full flex flex-col justify-center">
          {/* En-tête */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-accent mb-2">
              Contactez-nous
            </h1>
          </div>

          {/* Conteneur principal centré avec dimensions limitées */}
          <div className="w-full md:w-2/3 h-full md:h-2/3 mx-auto flex flex-col md:flex-row gap-4">
            {/* Formulaire de contact */}
            <div className="flex-1 md:flex-[2] bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 overflow-y-auto">
              <ContactForm />
            </div>

            {/* Informations de contact */}
            <div className="md:flex-1 flex flex-row md:flex-col gap-2 md:gap-4">
              {/* Adresse */}
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center hover:bg-white/90 transition-all duration-300 shadow-lg">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-primary mb-1">Adresse</h3>
                <p className="text-xs text-secondary hidden md:block">
                  123 Rue de la Comptabilité<br />
                  75001 Paris
                </p>
                <p className="text-xs text-secondary md:hidden">
                  Paris
                </p>
              </div>

              {/* Téléphone */}
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center hover:bg-white/90 transition-all duration-300 shadow-lg">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-secondary rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-primary mb-1">Téléphone</h3>
                <p className="text-xs text-secondary">
                  <a href="tel:+33123456789" className="hover:text-accent transition-colors">
                    01 23 45 67 89
                  </a>
                </p>
              </div>

              {/* Email */}
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center hover:bg-white/90 transition-all duration-300 shadow-lg">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-info rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-primary mb-1">Email</h3>
                <p className="text-xs text-secondary">
                  <a href="mailto:contact@neomi.fr" className="hover:text-accent transition-colors">
                    contact@neomi.fr
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
