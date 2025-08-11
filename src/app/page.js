

export const metadata = {
  title: "Accueil - Neomi",
  description: "Bienvenue sur le site officiel de Neomi",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Bienvenue chez Neomi</h1>
      <p className="text-lg text-secondary mb-4">
        Découvrez nos services et notre expertise.
      </p>
      
      {/* Test des couleurs */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-primary text-white rounded">
          Test couleur primary en arrière-plan
        </div>
        <div className="p-4 bg-secondary text-white rounded">
          Test couleur secondary en arrière-plan
        </div>
        <div className="p-4 bg-accent text-white rounded">
          Test couleur accent en arrière-plan
        </div>
        <div className="text-primary text-xl font-bold">
          Texte en couleur primary
        </div>
        <div className="text-secondary text-xl font-bold">
          Texte en couleur secondary
        </div>
        <div className="text-accent text-xl font-bold">
          Texte en couleur accent
        </div>
      </div>
    </div>
  );
}
