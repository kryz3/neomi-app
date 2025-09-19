import RainbowBackground from "../../components/RainbowBackground";
import Link from "next/link";

export const metadata = {
  title: "Fiscalité & Déclarations - Neomi",
  description: "Respecter les échéances et payer le juste impôt",
};

export default function FiscaliteDeclarations() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 snap-start">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <RainbowBackground className="opacity-20" />
      </div>
      
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <span className="mx-2">›</span>
            <span className="text-primary font-medium">Fiscalité & Déclarations</span>
          </nav>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              EXPERTISE COMPTABLE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Fiscalité & Déclarations
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Respecter les échéances et payer le juste impôt.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Bénéfices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Risques réduits",
                "Décisions arbitrées", 
                "Suivi des échéances"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Périmètre & Livrables</h2>
            <div className="space-y-4">
              {[
                "TVA (régimes, OSS/IOSS si besoin), IS/IR, CFE/autres",
                "Liasse fiscale, acomptes, estimations IR du dirigeant",
                "Préparation/assistance en cas de contrôle"
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Planifier un audit fiscal rapide
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/services"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              ← Retour aux services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}