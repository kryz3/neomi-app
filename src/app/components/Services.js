"use client";

import { useState } from "react";

export default function ServicesComponent() {
  const [active, setActive] = useState(2);

  const print1 = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 max-w-6xl mx-auto bg-primary/5 backdrop-blur-sm p-3 md:p-5 rounded-xl shadow-xl border border-primary/10">
        <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200">
          <h2 className="text-base md:text-xl font-bold text-primary mb-2 md:mb-3 border-b-2 border-primary/20 pb-1">
            Fiscalité
          </h2>
          <ul className="space-y-1 md:space-y-1.5">
            {[
              "TVA",
              "Liasse fiscale et déclarations",
              "Taxes et impôts",
              "Déclarations et revenus du dirigeant (IR)",
              "Contrôle de l'administration fiscale",
              "Crédits d'impôts",
            ].map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <p className="text-gray-800 text-xs md:text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200">
          <h2 className="text-base md:text-xl font-bold text-primary mb-2 md:mb-3 border-b-2 border-primary/20 pb-1">
            Comptabilité
          </h2>
          <ul className="space-y-1 md:space-y-1.5">
            {[
              "Tenue de votre comptabilité",
              "Rapprochement bancaire",
              "Note de frais",
              "TVA",
              "Comptes annuels",
              "Cotisations sociales",
            ].map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <p className="text-gray-800 text-xs md:text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const print2 = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 max-w-6xl mx-auto bg-accent/5 backdrop-blur-sm p-3 md:p-5 rounded-xl shadow-xl border border-accent/10">
        <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200">
          <h2 className="text-base md:text-xl font-bold text-accent mb-2 md:mb-3 border-b-2 border-accent/20 pb-1">
            Administration sociale
          </h2>
          <ul className="space-y-1 md:space-y-1.5">
            {["Paye", "Déclarations sociales", "Gestion des caisses sociales", "Contrôle URSSAF"].map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <p className="text-gray-800 text-xs md:text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200">
          <h2 className="text-base md:text-xl font-bold text-accent mb-2 md:mb-3 border-b-2 border-accent/20 pb-1">
            Relation de travail
          </h2>
          <ul className="space-y-1 md:space-y-1.5">
            {[
              "Fiches de poste",
              "Contrat de travail",
              "Aide à l'emploi",
              "Protection sociale individuelle et collective",
              "Épargne salariale, avantages, intéressements",
              "Accompagnement aux entretiens salariés",
              "Procédure disciplinaire et rupture",
              "Calcul des indemnités",
              "Gestion du temps de travail, décompte et suivi",
            ].map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <p className="text-gray-800 text-xs md:text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const print3 = () => {
    const sections = [
      {
        title: "Création d'entreprise",
        items: ["Analyse de projet", "Accompagnement dirigeant", "Choix structure", "Statuts et formalités"],
      },
      {
        title: "Croissance",
        items: ["Tableaux de bord", "Situations intermédiaires", "Outils de suivi", "Contrôle de gestion"],
      },
      {
        title: "Transmission",
        items: ["Cessation d'activité", "Transmission entreprise"],
      },
      {
        title: "Patrimoine",
        items: ["Gestion patrimoine", "Immobilier", "Retraite dirigeant", "Régime matrimonial"],
      },
      {
        title: "Juridique",
        items: ["Statuts", "Audit contractuel", "Secrétariat juridique", "Dépôt des comptes"],
      },
      {
        title: "Financement",
        items: ["Évaluation entreprise", "Plan de financement", "Business plan"],
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 max-w-7xl mx-auto bg-secondary/5 backdrop-blur-sm p-2 md:p-5 rounded-xl shadow-xl border border-secondary/10">
        {sections.map((section, i) => (
          <div
            key={i}
            className="bg-white/95 backdrop-blur-sm p-2 md:p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200"
          >
            <h2 className="text-xs md:text-base font-bold text-secondary mb-1 md:mb-3 border-b border-secondary/20 pb-1 md:pb-2">
              {section.title}
            </h2>
            <ul className="space-y-0.5 md:space-y-1.5">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start">
                  <span className="w-1 h-1 md:w-2 md:h-2 bg-secondary rounded-full mt-1 mr-1.5 md:mr-3 flex-shrink-0"></span>
                  <p className="text-gray-800 text-xs md:text-xs leading-tight">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      className="w-full flex items-center justify-center bg-light flex-col snap-start px-4"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Navigation fixe en haut */}
      <div className="w-full flex justify-center mb-4 md:mb-6 pt-3 md:pt-6 px-2">
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => setActive(1)}
            className={`px-3 md:px-5 py-2 md:py-3 rounded-l-lg font-medium text-xs md:text-sm transition-colors duration-300 ${
              active === 1
                ? "bg-primary text-white"
                : "text-gray-700 hover:text-primary hover:bg-primary/5"
            }`}
          >
            <span className="block md:hidden">Comptable</span>
            <span className="hidden md:block">Expertise Comptable</span>
          </button>
          <button
            onClick={() => setActive(2)}
            className={`px-3 md:px-5 py-2 md:py-3 font-medium text-xs md:text-sm transition-colors duration-300 border-l border-r border-gray-200 ${
              active === 2
                ? "bg-accent text-white"
                : "text-gray-700 hover:text-accent hover:bg-accent/5"
            }`}
          >
            <span className="block md:hidden">RH</span>
            <span className="hidden md:block">Ressources humaines</span>
          </button>
          <button
            onClick={() => setActive(3)}
            className={`px-3 md:px-5 py-2 md:py-3 rounded-r-lg font-medium text-xs md:text-sm transition-colors duration-300 ${
              active === 3
                ? "bg-secondary text-white"
                : "text-gray-700 hover:text-secondary hover:bg-secondary/5"
            }`}
          >
            Conseils
          </button>
        </div>
      </div>

      {/* Contenu avec transitions */}
      <div className="w-full flex-1 overflow-hidden relative">
        <div className="relative h-full">
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              active === 1 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            {print1()}
          </div>
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              active === 2
                ? "translate-x-0 opacity-100"
                : active < 2
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
          >
            {print2()}
          </div>
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              active === 3 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            {print3()}
          </div>
        </div>
      </div>
    </section>
  );
}