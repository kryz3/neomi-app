"use client";

import { useState, useMemo } from "react";

export default function FaqClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState({});
  const [openQuestions, setOpenQuestions] = useState({});

  // Donnée        {/* Contact pour plus d'informations */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-white">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-lg mb-6 text-white">
              Notre équipe d'experts est là pour répondre à toutes vos questions spécifiques
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-accent px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Nous contacter
            </a>
          </div>
        </div>

  // Données FAQ organisées par catégories
  const faqData = {
    "Création d'entreprise": [
      {
        question: "Quelles sont les étapes pour créer une entreprise ?",
        reponse: "La création d'entreprise comprend plusieurs étapes : choix de la forme juridique, rédaction des statuts, constitution du capital social, publication d'une annonce légale, dépôt du dossier au greffe, et obtention du Kbis. Nous vous accompagnons dans chacune de ces étapes pour simplifier vos démarches."
      },
      {
        question: "Combien de temps faut-il pour créer une société ?",
        reponse: "En moyenne, il faut compter entre 2 à 4 semaines pour créer une société, selon la forme juridique choisie et la complexité du dossier. Ce délai peut être réduit avec une préparation optimale des documents et notre accompagnement personnalisé."
      },
      {
        question: "Quel est le capital minimum requis pour créer une entreprise ?",
        reponse: "Le capital minimum varie selon la forme juridique : 1€ pour une SARL ou SAS, 37 000€ pour une SA. Pour les entreprises individuelles, aucun capital n'est requis. Nous vous conseillons sur le montant optimal selon votre activité."
      },
      {
        question: "Quels documents sont nécessaires pour la création ?",
        reponse: "Vous aurez besoin des statuts, de la liste des souscripteurs, du certificat de dépôt des fonds, d'une attestation de parution dans un journal d'annonces légales, et du formulaire de déclaration. Notre équipe prépare tous ces documents pour vous."
      },
      {
        question: "Peut-on créer une entreprise avec un associé étranger ?",
        reponse: "Oui, il est possible d'avoir des associés étrangers dans votre société française. Cependant, certaines formalités spécifiques s'appliquent selon la nationalité et le pays de résidence. Nous vous accompagnons dans ces démarches particulières."
      }
    ],
    "Comptabilité": [
      {
        question: "À quelle fréquence dois-je tenir ma comptabilité ?",
        reponse: "La comptabilité doit être tenue en temps réel et les écritures doivent être enregistrées de manière chronologique. En pratique, nous recommandons une mise à jour mensuelle minimum pour un suivi optimal de votre activité."
      },
      {
        question: "Quelles sont les obligations comptables d'une PME ?",
        reponse: "Une PME doit tenir un livre-journal, un grand livre, un livre d'inventaire, établir des comptes annuels (bilan, compte de résultat, annexe) et les déposer au greffe. Nous nous occupons de toutes ces obligations pour vous."
      },
      {
        question: "Comment choisir entre régime réel et micro-entreprise ?",
        reponse: "Le choix dépend de votre chiffre d'affaires, de vos charges déductibles et de vos projets de développement. Le régime micro offre une simplicité administrative mais limite les déductions. Nous analysons votre situation pour vous conseiller."
      },
      {
        question: "Que faire en cas d'erreur dans ma comptabilité ?",
        reponse: "Les erreurs comptables doivent être corrigées rapidement par des écritures d'extourne ou de correction. Il est important de documenter ces corrections. Notre équipe détecte et corrige ces erreurs lors de nos révisions régulières."
      },
      {
        question: "Comment gérer la TVA dans ma comptabilité ?",
        reponse: "La TVA doit être comptabilisée séparément, avec distinction entre TVA collectée et TVA déductible. Les déclarations sont mensuelles ou trimestrielles selon votre régime. Nous gérons intégralement vos obligations TVA et optimisons votre trésorerie."
      }
    ],
    "Fiscalité": [
      {
        question: "Quand dois-je déclarer mes revenus professionnels ?",
        reponse: "Les déclarations fiscales ont des échéances précises : déclaration de résultats au plus tard le 2ème jour ouvré suivant le 1er mai, déclaration de TVA selon la périodicité choisie. Nous gérons tous ces calendriers pour vous éviter tout retard."
      },
      {
        question: "Comment optimiser ma fiscalité d'entreprise ?",
        reponse: "L'optimisation fiscale passe par une bonne gestion des charges déductibles, le choix du régime adapté, la planification des investissements et l'utilisation des dispositifs légaux. Nous établissons une stratégie fiscale personnalisée pour votre entreprise."
      },
      {
        question: "Quels sont les avantages du statut de JEI ?",
        reponse: "Le statut de Jeune Entreprise Innovante offre des exonérations d'impôt sur les sociétés, de taxe foncière, de CVAE, ainsi que des réductions de charges sociales. Nous vous aidons à constituer votre dossier pour obtenir ce statut avantageux."
      },
      {
        question: "Comment déduire mes frais professionnels ?",
        reponse: "Les frais professionnels déductibles incluent les frais de déplacement, de repas, de formation, d'équipement. Ils doivent être justifiés, nécessaires à l'activité et proportionnés. Nous vous conseillons sur les bonnes pratiques de déduction."
      },
      {
        question: "Que faire en cas de contrôle fiscal ?",
        reponse: "En cas de contrôle fiscal, il faut répondre dans les délais, fournir les documents demandés et se faire assister par un professionnel. Nous vous représentons et vous défendons lors de ces procédures pour protéger vos intérêts."
      }
    ],
    "Ressources Humaines": [
      {
        question: "Comment calculer les charges sociales ?",
        reponse: "Les charges sociales représentent environ 42% du salaire brut pour un salarié non-cadre et 45% pour un cadre. Elles incluent les cotisations sécurité sociale, retraite, assurance chômage et formation. Nous calculons précisément vos charges selon votre effectif."
      },
      {
        question: "Quelles sont les obligations lors d'un recrutement ?",
        reponse: "Le recrutement implique la rédaction d'un contrat de travail, la déclaration préalable à l'embauche (DPAE), l'organisation de la visite médicale, et la mise en place du registre du personnel. Nous vous accompagnons dans toutes ces démarches."
      },
      {
        question: "Comment gérer les congés payés ?",
        reponse: "Les congés payés sont acquis à raison de 2,5 jours par mois travaillé, soit 30 jours ouvrables par an. Ils doivent être planifiés et leurs indemnités calculées correctement. Notre service paie gère automatiquement ces calculs complexes."
      },
      {
        question: "Quelles sont les règles du télétravail ?",
        reponse: "Le télétravail doit faire l'objet d'un accord écrit précisant les conditions, les horaires, la prise en charge des frais. L'employeur doit garantir la santé et la sécurité du télétravailleur. Nous vous aidons à rédiger ces accords conformes."
      },
      {
        question: "Comment licencier un salarié en respectant la loi ?",
        reponse: "Un licenciement nécessite une cause réelle et sérieuse, le respect d'une procédure (entretien, notification), et le versement d'indemnités. Les délais et formalités sont stricts. Nous vous accompagnons pour sécuriser juridiquement ces procédures."
      }
    ],
    "Gestion financière": [
      {
        question: "Comment améliorer ma trésorerie ?",
        reponse: "L'amélioration de la trésorerie passe par l'optimisation des délais de paiement clients, la négociation avec les fournisseurs, la gestion des stocks et la planification des investissements. Nous établissons un plan de trésorerie personnalisé."
      },
      {
        question: "Quand dois-je faire appel à un financement externe ?",
        reponse: "Un financement externe devient nécessaire pour les investissements importants, le développement commercial, ou en cas de difficultés de trésorerie temporaires. Nous analysons vos besoins et vous orientons vers les solutions adaptées."
      },
      {
        question: "Comment analyser la rentabilité de mon entreprise ?",
        reponse: "L'analyse de rentabilité se base sur plusieurs indicateurs : marge brute, résultat d'exploitation, capacité d'autofinancement, ROI. Nous produisons des tableaux de bord personnalisés pour piloter votre performance financière."
      },
      {
        question: "Qu'est-ce que le contrôle de gestion ?",
        reponse: "Le contrôle de gestion permet de mesurer, analyser et améliorer la performance de l'entreprise. Il inclut la budgétisation, le suivi des écarts, l'analyse des coûts et la définition d'indicateurs. Nous mettons en place ces outils de pilotage."
      },
      {
        question: "Comment préparer un business plan financier ?",
        reponse: "Un business plan financier comprend le compte de résultat prévisionnel, le bilan prévisionnel, le plan de financement et le plan de trésorerie sur 3 ans minimum. Nous vous accompagnons dans cette démarche essentielle pour vos projets."
      }
    ]
  };

  // Fonction pour basculer l'ouverture des catégories
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Fonction pour basculer l'ouverture des questions
  const toggleQuestion = (category, index) => {
    const key = `${category}-${index}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filtrage des données en fonction de la recherche
  const filteredData = useMemo(() => {
    if (!searchTerm) return faqData;
    
    const filtered = {};
    Object.entries(faqData).forEach(([category, questions]) => {
      const filteredQuestions = questions.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reponse.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredQuestions.length > 0) {
        filtered[category] = filteredQuestions;
      }
    });
    return filtered;
  }, [searchTerm, faqData]);

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Foire aux Questions
          </h1>
          <p className="text-lg text-primary max-w-2xl mx-auto">
            Retrouvez toutes les réponses à vos questions sur nos services comptables, 
            fiscaux et de gestion d'entreprise
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg border-2 border-accent/20 rounded-2xl focus:outline-none focus:border-accent transition-all duration-300 bg-white shadow-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-accent hover:text-secondary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Résultats */}
        <div className="space-y-6">
          {Object.keys(filteredData).length === 0 ? (
            <div className="text-center py-12 ">
              <div className="w-24 h-24 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg text-secondary">
                Aucune question trouvée pour "{searchTerm}"
              </p>
              <p className="text-sm text-secondary mt-2">
                Essayez avec d'autres mots-clés ou consultez toutes nos catégories
              </p>
            </div>
          ) : (
            Object.entries(filteredData).map(([category, questions]) => (
              <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-accent/10">
                {/* En-tête de catégorie */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-6 bg-gradient-to-r from-primary to-secondary text-white text-left flex items-center justify-between hover:from-secondary hover:to-accent transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 place-">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">{category}</h3>
                      <p className="text-secondary text-sm">{questions.length} question{questions.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Contenu de la catégorie */}
                <div className={`transition-all duration-500 ease-in-out ${openCategories[category] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-6 space-y-4">
                    {questions.map((item, index) => (
                      <div key={index} className="border border-accent/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(category, index)}
                          className="w-full px-6 py-4 text-left bg-accent/5 hover:bg-accent/10 transition-all duration-300 flex items-center justify-between"
                        >
                          <h4 className="text-lg font-semibold text-secondary pr-4">{item.question}</h4>
                          <div className={`transform transition-transform duration-300 flex-shrink-0 ${openQuestions[`${category}-${index}`] ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out ${openQuestions[`${category}-${index}`] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                          <div className="px-6 py-4 bg-white">
                            <p className="text-secondary leading-relaxed">{item.reponse}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact pour plus d'informations */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-accent to-accent/90 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-accent">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-lg mb-6 text-secondary">
              Notre équipe d'experts est là pour répondre à toutes vos questions spécifiques
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-accent px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
