export default function PolitiqueConfidentialite() {
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
            Politique de confidentialité
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
                    "Dispositions générales",
                    "Pourquoi NEOMI traite vos données",
                    "Catégories des données traitées",
                    "Obligation de confidentialité",
                    "Sous-traitance de NEOMI",
                    "Territorialité",
                    "Durée de conservation",
                    "Désignation d'un DPO",
                    "Mesures de sécurité",
                    "Demande de droits - Vos droits",
                    "Accès de mineurs",
                    "Profilage et décision automatisée",
                    "Version",
                    "Glossaire"
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

                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    NEOMI considère que la sécurité des données et la conformité à la protection des données constituent un sujet très important.
                    Ce document a pour objectif de décrire les grandes lignes de la politique de NEOMI pour protéger les Données à Caractère Personnel (« DCP »), collectées lors de la préparation des travaux d'expertise comptable qui comprennent notamment l'assistance à l'établissement des comptes annuels, assistance à l'élaboration des déclarations fiscales, réalisation de missions accessoires telles que la gestion RH, établissement de la paie, secrétariat juridique pour les clients de NEOMI. Ce document précise la gestion des DCP pendant les missions d'expertise comptable dans le cadre de la mise en conformité avec le Règlement Européen sur la Protection des données (UE) 2016/679. (« RGPD »).
                  </p>
                </div>
          
                <section id="section-1">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    1. Dispositions générales
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Dans le cadre des missions qui lui sont confiées, NEOMI traite les Données à caractère personnel conformément aux lois et règlements en vigueur relatifs à la protection des Données à caractère personnel, conformément La loi Informatique et Libertés du 17 juin 2019, loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.
                    </p>
                    <p>
                      Les Données à caractère personnel demeurent la propriété du Client, ce dernier intervenant en tant que Responsable de Traitement. Ce dernier est seul responsable du respect de ses obligations en tant que Responsable de Traitement en vertu de la réglementation en vigueur à l'égard des Personnes Concernées et des autorités de contrôle (notamment la CNIL).
                    </p>
                    <p>
                      Le Client est responsable de l'exactitude et de l'intégrité des Données à caractère personnel.
                    </p>
                    <p>
                      Le Client s'engage à mettre à disposition de NEOMI toutes les informations nécessaires à la réalisation des opérations de Traitement par NEOMI.
                    </p>
                    <p>
                      NEOMI intervient en tant que sous-traitant du Client, au sens des dispositions des articles 4 et 28 du RGPD. A ce titre, NEOMI s'engage à traiter les Données à caractère personnel conformément aux instructions documentées fournies par le Client, dont ce dernier est seul responsable.
                    </p>
                    <p>Le Client en tant que Responsable de Traitement est notamment responsable :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Du respect du principe de minimisation, selon lequel seules les Données à caractère personnel nécessaires à la finalité du Traitement doivent être traitées ;</li>
                      <li>De l'obligation d'information des Personnes Concernées, dont notamment le transfert à NEOMI</li>
                      <li>Du recueil du consentement des Personnes Concernées,</li>
                    </ul>
                    <p>
                      Nous ne vendons ni ne louons les données personnelles que vous nous transmettez ou qui vous concernent à quelque fin que ce soit.
                    </p>
                    <p>
                      Pour toute question complémentaire concernant les données à caractère personnel, le délégué à la protection des données de NEOMI vous répondra à l'adresse mail dédiée mna@neomi.fr.
                    </p>
                  </div>
                </section>

                <section id="section-2">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    2. Pourquoi NEOMI traite vos données ?
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      NEOMI ne traite les données personnelles que pour des finalités déterminées, explicites et légitimes. NEOMI ne traite pas ces données de manière incompatible avec ces finalités.
                    </p>
                    <p>Nous sommes amenés à collecter des données à caractère personnel à des fins suivantes :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>l'assistance à l'établissement des comptes annuels,</li>
                      <li>assistance à l'élaboration des déclarations fiscales professionnelles et personnelles,</li>
                      <li>réalisation de missions accessoires telles que la gestion RH,</li>
                      <li>établissement de la paie, préparer les bulletins de paies du personnel du client</li>
                      <li>secrétariat juridique</li>
                      <li>Communiquer avec le client : Répondre à des demandes d'information émises par le client, Gérer la communication opérationnelle (incident, évolutions fonctionnelles, sécurité, …), Gérer la communication commerciale</li>
                      <li>Assister le client : Assister pour la résolution d'incidents techniques ou des difficultés d'usage</li>
                      <li>Gérer l'accès du client : Authentifier les utilisateurs, provisionner les droits d'accès et surveiller les accès</li>
                      <li>Gérer l'accès du client : créer les comptes et les utilisateurs dans les logiciels tiers, initialiser les paramétrages par défaut dans les services tiers</li>
                      <li>Réaliser les contrôles des travaux du client,</li>
                      <li>Traiter les documents en provenance des fournisseurs du client</li>
                      <li>Tenir la comptabilité du client, réviser ou superviser les opérations comptables</li>
                      <li>Et tous les autres travaux participant à la tenue de la comptabilité, à la supervision de tels travaux, ou à la révision de ce type de travaux comptables.</li>
                      <li>Vérifier et documenter l'actionnariat du client</li>
                      <li>L'affiliation aux régimes de protection sociale</li>
                      <li>Et tous les autres travaux participant à la mission de tenue de la paie et du social.</li>
                    </ul>
                  </div>
                </section>

                <section id="section-3">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    3. Catégories des données à caractère personnel traitées
                  </h2>
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div>
                      <p>
                        Dans le cadre des activités d'Expertise-Comptable, les équipes de NEOMI sont amenées à traiter les catégories de DCP qui suivent :
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                        <li>Les contacts du client de NEOMI qui interagissent avec les collaborateurs de NEOMI.</li>
                        <li>Les DCP des clients du client de NEOMI,</li>
                        <li>Les DCP des collaborateurs des clients,</li>
                        <li>Les DCP des fournisseurs des clients,</li>
                        <li>Les DCP des actionnaires des clients,</li>
                      </ul>
                      <p className="mt-4">
                        et de toutes autres parties utilisées par les clients de NEOMI qui font l'objet de traitements par nos soins.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">
                        Informations collectées relatives aux contacts chez clients Expertise comptable
                      </h3>
                      <p>
                        Chez NEOMI, nous centralisons le traitement des données personnelles concernant les contacts (clients anciens, actuels et potentiels, personnes employées par ou associées à de tels clients et autres contacts commerciaux, tels que des anciens collaborateurs, des consultants, des régulateurs et des journalistes).
                      </p>
                      <p className="mt-4">
                        Ces contacts sont traités conformément à la politique de confidentialité tel que décrite sur le site www.neomi.fr.
                      </p>
                      <p className="mt-4">
                        Nous ne collectons pas intentionnellement de données sensibles, sauf si vous nous fournissez de telles données dans le cadre de votre participation à nos événements.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">
                        Exemple de données à caractère personnel transmises par le client Expertise comptable dans le cadre de la mission assignée à NEOMI
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Nom, prénom</li>
                        <li>Adresse postale</li>
                        <li>Adresse mail</li>
                        <li>Téléphone</li>
                        <li>Lieu, date de naissance</li>
                        <li>Nationalité</li>
                        <li>Date de décès</li>
                        <li>Numéro de sécurité sociale</li>
                        <li>Numéro d'identité fiscale</li>
                        <li>Relevé d'Identité Bancaire du Collaborateur</li>
                        <li>Salaires mensuels, avantage en nature</li>
                        <li>L'intitulé du poste, l'échelon ou la fonction, le rôle</li>
                        <li>Le nom de l'entreprise ou de l'organisation</li>
                        <li>Des données sur l'entreprise</li>
                        <li>Des informations géographiques telles que le pays, le code postal</li>
                        <li>Des informations pertinentes pour la prestation de nos services</li>
                        <li>Et toutes autres informations dont nous avons besoin afin de mener à bien la mission que vous nous avez attribuée.</li>
                      </ul>
                      <p className="mt-4">
                        Nous ne collectons pas intentionnellement de données sensibles, sauf si vous nous les fournissez. Bien que vous puissiez saisir toute sorte d'informations dans les champs libres présents sur notre site, nous n'avons en aucun cas l'intention de traiter des informations sensibles. Vous n'êtes en aucun cas obligé de fournir, et ne devez pas divulguer, de données personnelles sensibles dans ces champs de texte. Si vous décidez de fournir des données personnelles sensibles de cette manière, vous consentez à la collecte et au traitement de celles-ci.
                      </p>
                      <p className="mt-4">
                        Les bases juridiques pour le traitement des données à caractère personnel sont l'exécution d'un contrat signé par le client de NEOMI avec le cabinet.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="section-4">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    4. Obligation de confidentialité
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      NEOMI s'engage à garantir la confidentialité des Données à caractère personnel traitées en application des contrats conclus avec ses clients. Pour ce faire, NEOMI préserve la confidentialité des Données à caractère personnel à tout moment à l'égard de son personnel, de ses collaborateurs et de toute personne susceptible d'y avoir accès.
                    </p>
                    <p>NEOMI s'engage à veiller à ce que le personnel autorisé à traiter les Données à caractère personnel :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>S'engage à en respecter la confidentialité et/ou soit soumis à une obligation légale ou contractuelle de confidentialité.</li>
                      <li>Reçoive la formation nécessaire en matière de protection des Données à caractère personnel.</li>
                    </ul>
                  </div>
                </section>

                <section id="section-5">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    5. Sous-traitance de NEOMI
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      NEOMI peut faire appel à des sous-traitants (ci-après, les « Sous-Traitants Ultérieurs ») pour mener ses activités de traitement. Dans ce cas, NEOMI informe par écrit les clients concernés.
                    </p>
                    <p>
                      Le Sous-Traitant est tenu de respecter les obligations prévues par le Règlement européen de la protection des données (UE) 2016/679 (RGPD). NEOMI s'assure directement que le Sous-Traitant Ultérieur présente les mêmes garanties suffisantes quant à la mise en œuvre de mesures techniques et organisationnelles appropriées de manière à ce que les Traitements répondent aux exigences du RGPD.
                    </p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Liste des Sous-Traitants :</h3>
                      <ul className="space-y-3">
                        <li><strong>ACD :</strong> Editeur de solutions informatiques pour les experts comptables (<a href="https://acd-groupe.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">ACD : Politique de protection des données personnelles</a>)</li>
                        <li><strong>PENNYLANE :</strong> Outil de Gestion et de production comptable en SAAS (<a href="https://www.pennylane.com/fr/legal/securite-rgpd/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://www.pennylane.com/fr/legal/securite-rgpd/</a>)</li>
                        <li><strong>MICROSOFT 365 :</strong> solutions logicielles de bureautique</li>
                        <li><strong>CLICKIMPOTS :</strong> Outil de calcul d'impôts et de déclarations de revenus (<a href="https://www.clickimpots.com/politique-de-confidentialite/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://www.clickimpots.com/politique-de-confidentialite/</a>)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="section-6">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    6. Territorialité
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Dans l'éventualité où NEOMI procède à un transfert de Données à caractère personnel vers un pays situé hors de l'Union Européenne ou une organisation internationale, NEOMI s'engage à en informer préalablement l'utilisateur, sauf motif légitime d'intérêt public exonérant NEOMI de l'obligation de notification.
                    </p>
                    <p>
                      Dans le cas d'un tel transfert, NEOMI s'engage à respecter les garanties appropriées prévues par le RGPD, par la mise en place de clauses contractuelles type ou par l'application de règles contraignantes.
                    </p>
                    <p>
                      Lorsque des clauses contractuelles types ont été signées, vous disposez du droit d'en demander une copie. Pour toute question ou réclamation, vous pouvez la soumettre par écrit comme indiqué au paragraphe 10. Demande de droits – Vos droits.
                    </p>
                    <p>
                      En utilisant le site www.neomi.fr nous ne procédons à aucun transfert Hors-UE.
                    </p>
                  </div>
                </section>

                <section id="section-7">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    7. Durée de conservation des données à caractère personnel
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Dans le respect des obligations de confidentialité, notre politique est de conserver les données personnelles uniquement pendant le temps nécessaire aux fins décrites dans les Finalités de Traitement. Ces données sont conservées pour une durée conforme aux dispositions régissant les activités de NEOMI en France.
                    </p>
                    <p>
                      Concernant les contacts du client, dans le cas où votre entreprise est cliente de NEOMI, les données à caractère personnel des contacts resteront « actifs » dans le traitement.
                    </p>
                    <p>
                      Concernant les DCP du personnel du client, NEOMI conservera ces données pour une durée en adéquation avec la nature de sa mission.
                    </p>
                    <p>
                      A titre d'exemple, ce délai est de 5 ans après la fin du contrat pour l'activité de production de paies.
                    </p>
                    <p>
                      A titre d'exemple, les dossiers de travail d'expertise-comptable d'une année civile sont conservés pendant une durée de 10 ans.
                    </p>
                    <p>
                      Toutefois, dans le cas où vous souhaiteriez que nous supprimions vos données à caractère personnel, collectées, utilisées, vous pouvez nous adresser une demande de droit à travers le lien indiqué dans le point 10 de ce document.
                    </p>
                  </div>
                </section>

                <section id="section-8">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    8. Désignation d'un DPO
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      NEOMI a désigné un DPO qui est l'interlocuteur référent/privilégié pour toute question relative aux Données à caractère personnel et aux Traitements de Données à caractère personnel effectués par NEOMI pour le compte de ses clients.
                    </p>
                    <p>
                      Pour toute information complémentaire, vous pouvez adresser votre demande / requête au Délégué à la Protection des données (DPO) de NEOMI à mna@neomi.fr.
                    </p>
                  </div>
                </section>

                <section id="section-9">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    9. Mesures de sécurité
                  </h2>
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      NEOMI s'appuie sur la combinaison plusieurs niveaux de sécurité logique, physique et humaine lesquels participent activement à la sécurité de son système d'information.
                    </p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Sécurité logique</h3>
                      <p>En termes de sécurité logique, les mesures appliquées sont, notamment :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                        <li>Paramétrage des ordinateurs, serveurs selon un protocole identique qui tient compte des dernières versions des éditeurs.</li>
                        <li>Protection des serveurs et ordinateurs via un anti-virus, régulièrement mis à jour.</li>
                        <li>Chiffrement des disques de tous les serveurs.</li>
                        <li>Un système de double authentification</li>
                        <li>Une protection logique des appareils mobiles dont notamment les téléphones portables, tablettes.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Sécurité physique des serveurs de Production « Métier »</h3>
                      <p>En termes de sécurité physique, les mesures appliquées sont, notamment :</p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                        <li>Un accès restreint du personnel de l'informatique administrateur des serveurs ou ayant des opérations de maintenance à réaliser.</li>
                        <li>Gestion des privilèges : seuls les administrateurs peuvent configurer un ordinateur ou un serveur. NEOMI met en place une ségrégation des rôles d'administrateurs.</li>
                        <li>Des composants de sécurité périmétrique de type : firewalls, proxy, reverse proxy filtrent les accès aux ressources de NEOMI.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Sécurité humaine de l'information lors des missions Expertise comptable</h3>
                      <p>
                        Depuis 2018, l'ensemble des collaborateurs NEOMI a bénéficié de formations relatives au RGPD en présentiel ou en webinar.
                      </p>
                      <p className="mt-4">
                        Toutefois, internet peut ne pas procurer le degré de sécurité attendu. Bien que nous ayons mis en œuvre les moyens appropriés nous ne pouvons garantir la sécurité et intégrité lors de ce transfert. Une fois les données arrivées sur votre système d'information, il relève de votre responsabilité d'assurer cette sécurité.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="section-10">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    10. Demande de droits - Vos droits
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Sauf dans le cas où vous nous feriez une demande de droits, NEOMI est le responsable de traitement de toutes les données à caractère personnel que vous nous transmettriez via nos sites internet.
                    </p>
                    <p>En conséquence, vous pouvez exercer un certain nombre de droits sur vos données, notamment :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Droit d'accès aux données à caractère personnel, pour accéder aux données personnelles que nous détenons à votre sujet</li>
                      <li>Droit à la rectification de vos données personnelles, si celles-ci sont incomplètes, ou incorrectes, ou inexactes.</li>
                      <li>Droit à tout moment à ne plus recevoir de communications marketing ;</li>
                      <li>Droit à la limitation ou à l'opposition quant au traitement des données personnelles ;</li>
                      <li>Droit à l'oubli, demande de suppression de vos données personnelles (sous certaines conditions et conformément à la législation en vigueur) ;</li>
                    </ul>
                    <p>
                      Nous nous occuperons de tout exercice de vos droits de personne concernée conformément aux exigences du RGPD et conformément à la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés et du règlement (UE) 2016/679 du 27 avril 2016.
                    </p>
                    <p>
                      Pour les contacts du client avec NEOMI, nous vous permettons d'effectuer toutes vos demandes de droits directement par mail au DPO mna@neomi.fr.
                    </p>
                  </div>
                </section>

                <section id="section-11">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    11. Accès de mineurs à notre site internet
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Notre portail n'est pas destiné à être utilisé par des mineurs de moins de seize (16) ans. NEOMI ne collecte, ne divulgue ni ne vend sciemment les données personnelles des mineurs de moins de 16 ans.
                    </p>
                  </div>
                </section>

                <section id="section-12">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    12. Profilage et décision entièrement automatisée
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Aucun profilage n'est prévu dans le cadre des travaux d'Expertise-Comptable.
                    </p>
                    <p>
                      Concernant le site internet www.neomi.fr, aucun cookie n'est utilisé pour les utilisateurs non-administrateurs. Le site ne fait appel à aucun service de tracking ou d'analyse tiers.
                    </p>
                  </div>
                </section>

                <section id="section-13">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    13. Version
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Tout changement dans cette politique RGPD qui concerne le site internet www.neomi.fr sera mis en ligne le plus rapidement possible par nos équipes afin de vous tenir informés.
                    </p>
                    <p>
                      Nous vous recommandons de vérifier régulièrement cette politique afin de rester informés des évolutions de notre registre de traitement.
                    </p>
                  </div>
                </section>

                <section id="section-14">
                  <h2 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-accent/20 pb-2">
                    14. Glossaire
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>Les termes ci-après sont définis comme suit dans le respect de la réglementation RGPD.</p>
                    <ul className="space-y-3">
                      <li><strong>Données à caractère personnel :</strong> toute information se rapportant à une personne physique identifiée ou identifiable (par exemple : nom, prénom, adresse, date de naissance, etc.)</li>
                      <li><strong>DPO :</strong> Data Protection Officer, ou délégué à la protection des données à caractère personnel ;</li>
                      <li><strong>Personne Concernée :</strong> personne dont les données à caractère personnel sont traitées</li>
                      <li><strong>Responsable de Traitement :</strong> la personne physique ou morale qui détermine les finalités et les moyens d'un ou plusieurs traitements de données à caractère personnel, en l'espèce le Client ;</li>
                      <li><strong>RGPD :</strong> Règlement Général sur la Protection des Données n°2016/679 du 27 avril 2016 qui entre en application le 25 mai 2018 ;</li>
                      <li><strong>Sous-Traitant :</strong> la personne physique ou morale qui traite des données à caractère personnel pour le compte, sur instruction et sous l'autorité d'un responsable de traitement,</li>
                      <li><strong>Traitement :</strong> désigne toute opération ou ensemble d'opérations effectués à l'aide de procédés automatisés ou non et portant sur des données à caractère personnel, en l'espèce le ou les traitement(s) effectués par NEOMI dans le cadre de sa mission décrite au Contrat ;</li>
                      <li><strong>Violation de Données à caractère personnel :</strong> toute violation de sécurité entraînant de manière accidentelle ou illicite la destruction, la perte, l'altération, la divulgation ou l'accès non autorisés aux Données à caractère personnel traitées.</li>
                    </ul>
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
