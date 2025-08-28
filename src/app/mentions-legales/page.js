export const metadata = {
  title: "Mentions légales - Neomi",
  description: "Découvrez les mentions légales de Neomi",
};

export default function MentionsLegales() {
  return (
    <div className="w-full bg-light snap-start">
      {/* Header avec navigation */}
      <div className="w-full bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <a 
            href="/" 
            className="text-accent hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </a>
          <h1 className="text-2xl md:text-3xl font-bold">
            Mentions légales
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Table des matières */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-primary mb-4 border-b border-accent/20 pb-2">
                  Sommaire
                </h3>
                <nav className="space-y-2">
                  {[
                    "Présentation",
                    "Informations juridiques", 
                    "Contacts",
                    "Informations relatives au site",
                    "Hébergement",
                    "Responsable de publication",
                    "Propriété intellectuelle",
                    "Disclaimer",
                    "Crédits"
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={`#section-${index + 1}`}
                      className="block text-sm text-gray-600 hover:text-primary transition-colors duration-300 py-1"
                    >
                      {index + 1}. {item}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="md:col-span-9">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-10">
          
                <section id="section-1">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    1. Présentation
                  </h2>
                  <div className="text-gray-700">
                    <p className="leading-relaxed">
                      Neomi est un cabinet d'expertise comptable offrant des services complets du stade projet à la gestion au quotidien de votre entreprise : business plan, création d'entreprise, comptabilité, fiscalité, secrétariat juridique, gestion sociale, transmission d'entreprise, accompagnement des dirigeants, gestion de patrimoine, etc.
                    </p>
                  </div>
                </section>

                <section id="section-2">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    2. Informations juridiques
                  </h2>
                  <div className="text-gray-700 space-y-3">
                    <p><strong>SARL NEOMI</strong></p>
                    <p>Société inscrite au Conseil de l'Ordre des Experts Comptables de Paris</p>
                    <p><strong>Siège social :</strong> 216 rue de Charenton, 75012 Paris</p>
                    <p><strong>Capital :</strong> 5 000 €</p>
                    <p><strong>RCS Paris 822 884 912 / APE 6920Z / TVA FR 92 822 884 912</strong></p>
                    <p><strong>Représentée par</strong> Monsieur Késarhoussen Mohamed Nazamoudine</p>
                  </div>
                </section>

                <section id="section-3">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    3. Contacts
                  </h2>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email :</strong> contact@neomi.fr</p>
                    <p><strong>Tél. :</strong> +33 (0)6 78 29 60 28</p>
                  </div>
                </section>

                <section id="section-4">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    4. Informations relatives à notre site internet
                  </h2>
                  <div className="text-gray-700">
                    <p className="leading-relaxed">
                      Notre site internet est disponible à l'adresse suivante : www.neomi.fr (le "Site"). Il s'agit d'un Site d'information, avec un lien vers un accès client.
                    </p>
                  </div>
                </section>

                <section id="section-5">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    5. Hébergement
                  </h2>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Le Site est hébergé par :</strong></p>
                    <div className="ml-4 space-y-1">
                      <p><strong>IONOS SARL</strong></p>
                      <p>7, place de la Gare</p>
                      <p>BP 70109</p>
                      <p>57200 Sarreguemines Cedex France</p>
                      <p><strong>Email :</strong> info@ionos.fr</p>
                      <p><strong>Tél. :</strong> 0970 808 911 (appel non surtaxé)</p>
                    </div>
                  </div>
                </section>

                <section id="section-6">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    6. Responsable de la publication
                  </h2>
                  <div className="text-gray-700">
                    <p>Le responsable de la publication est Monsieur Késarhoussen Mohamed Nazamoudine, dont l'adresse email est mna@neomi.fr.</p>
                  </div>
                </section>

                <section id="section-7">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    7. Propriété intellectuelle
                  </h2>
                  <div className="text-gray-700">
                    <p className="leading-relaxed">
                      Le contenu du Site, y compris les textes, photos, vidéos, etc. appartenant à Neomi ne pourra en aucun cas être copié et/ou réutilisé par des tiers, notamment à des fins commerciales.
                    </p>
                  </div>
                </section>

                <section id="section-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    8. Disclaimer
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="leading-relaxed">
                      En tant que Site d'information, tout élément publié sur le Site n'a qu'une valeur strictement informative, qui ne saurait être interprétée comme étant un conseil personnalisé à l'égard d'un quelconque utilisateur.
                    </p>
                    <p className="leading-relaxed">
                      Si nous nous attachons à publier du contenu de qualité, aucune garantie quant à son contenu n'est accordée (exhaustivité, mise à jour, etc.). Aucun droit ne peut donc être dérivé de l'utilisation du Site de manière générale.
                    </p>
                    <p className="leading-relaxed">
                      En visitant le Site, l'utilisateur accepte par ailleurs les présentes conditions.
                    </p>
                  </div>
                </section>

                <section id="section-9">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    9. Crédits
                  </h2>
                  <div className="text-gray-700">
                    <p className="leading-relaxed">
                      Pour concevoir notre Site, nous utilisons des photos et vidéos, provenant de différentes plateformes, et appartenant parfois à des auteurs tiers. Un crédit leur sera fait si nécessaire, selon la licence d'utilisation des contenus.
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
