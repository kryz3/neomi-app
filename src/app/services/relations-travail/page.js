import RainbowBackground from "../../components/RainbowBackground";
import Link from "next/link";

export const metadata = {
  title: "Relations de Travail - Neomi",
  description: "Sécuriser les pratiques au quotidien",
};

export default function RelationsTravail() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 snap-start">
      {/* Rainbow background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <RainbowBackground className="opacity-20" />
      </div>
      
      {/* Navigation breadcrumb */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <span className="mx-2">›</span>
            <span className="text-accent font-medium">Relations de Travail</span>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              SOCIAL & RH
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">
              Relations de Travail
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Sécuriser les pratiques au quotidien.
            </p>
          </div>

          {/* Bénéfices */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-accent/10 mb-8">
            <h2 className="text-2xl font-bold text-accent mb-6">Bénéfices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Risques maîtrisés",
                "Décisions rapides", 
                "Preuves"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Périmètre & Livrables */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-accent/10 mb-8">
            <h2 className="text-2xl font-bold text-accent mb-6">Périmètre & Livrables</h2>
            <div className="space-y-4">
              {[
                "Contrats/avenants (CDI, CDD, apprentissage…)",
                "Procédures disciplinaires (mises en garde, sanctions)", 
                "Ruptures (RC, licenciement) + courriers & check-lists"
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sécuriser une situation RH
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Retour aux services */}
          <div className="text-center mt-12">
            <Link 
              href="/services"
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              ← Retour aux services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}