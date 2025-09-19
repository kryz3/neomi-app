import Link from 'next/link';
import RainbowBackground from './components/RainbowBackground';

export const metadata = {
  title: "Page non trouvée - Neomi",
  description: "La page que vous recherchez n'existe pas.",
};

export default function NotFound() {
  return (
    <section
      className="w-full flex items-center justify-center bg-light flex-col relative overflow-hidden snap-start"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <RainbowBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto ">
        {/* Numéro d'erreur 404 stylisé */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-accent opacity-20 leading-none">
            404
          </h1>
        </div>
        
        {/* Message principal */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-6xl font-semibold text-accent mb-4 text-shadow-lg">
            Oups !
          </h2>
          <p className="text-xl md:text-2xl text-secondary mb-2 text-shadow-2xs">
            La page que vous recherchez n'existe pas
          </p>
          <p className="text-lg text-secondary/80 text-shadow-2xs">
            Elle a peut-être été déplacée, supprimée ou vous avez saisi une URL incorrecte.
          </p>
        </div>

        {/* Boutons de redirection */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <Link
            href="/"
            className="inline-block bg-accent text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[200px]"
          >
            Retour à l'accueil
          </Link>
          
          <Link
            href="/blog"
            className="inline-block bg-white text-accent border-2 border-accent px-8 py-4 rounded-full text-lg font-semibold hover:bg-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[200px]"
          >
            Voir le blog
          </Link>
        </div>

        {/* Message d'aide supplémentaire */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <h3 className="text-lg font-semibold text-accent mb-3">
            Vous cherchez quelque chose de spécifique ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link 
              href="/services" 
              className="text-secondary hover:text-accent transition-colors duration-300 hover:underline"
            >
              → Nos services
            </Link>
            <Link 
              href="/secteurs" 
              className="text-secondary hover:text-accent transition-colors duration-300 hover:underline"
            >
              → Nos secteurs
            </Link>
            <Link 
              href="/contact" 
              className="text-secondary hover:text-accent transition-colors duration-300 hover:underline"
            >
              → Nous contacter
            </Link>
          </div>
        </div>

        {/* Animation d'illustration */}
        <div className="mt-8 opacity-30">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border-4 border-accent/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-8 border-4 border-accent/70 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-12 bg-accent/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}