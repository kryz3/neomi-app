"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useArticlesContext } from '../context/ArticlesContext';

export default function BlogPage() {
  const { articles, loading, error, getFilteredArticles } = useArticlesContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    setFilteredArticles(getFilteredArticles(searchTerm));
  }, [articles, searchTerm, getFilteredArticles]);

  // Mettre à jour le titre de la page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = searchTerm 
        ? `Recherche: ${searchTerm} - Neomi`
        : 'Blog & Actualités - NEOMI Expertise Comptable';
    }
  }, [searchTerm]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 snap-start">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-accent mb-4">
              Blog & Actualités
            </h1>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Découvrez nos derniers articles, conseils et actualités dans le domaine de la gestion d'entreprise et de la comptabilité.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barre de recherche */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher dans les articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        )}

        {/* Articles */}
        {!loading && (
          <>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  {searchTerm ? 'Aucun article trouvé' : 'Aucun article publié'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Essayez de modifier votre recherche ou parcourez tous nos articles.'
                    : 'Les articles seront bientôt disponibles. Revenez prochainement !'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-6 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Voir tous les articles
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Résultats de recherche */}
                {searchTerm && (
                  <div className="mb-8">
                    <p className="text-gray-600">
                      {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''} pour "{searchTerm}"
                    </p>
                  </div>
                )}

                {/* Grille d'articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article) => (
                    <article key={article._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 snap-start">
                      {/* Image */}
                      {article.image && (
                        <Link href={`/blog/${article.slug}`} className="block aspect-video bg-gray-100 overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.imageAlt || article.titre}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      )}
                      
                      {/* Contenu */}
                      <div className="p-6">
                        {/* Date et auteur */}
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <time dateTime={article.datePublication}>
                            {formatDate(article.datePublication)}
                          </time>
                          <span className="mx-2">•</span>
                          <span>Par {article.auteur}</span>
                        </div>
                        
                        {/* Titre */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          <Link 
                            href={`/blog/${article.slug}`}
                            className="hover:text-accent transition-colors"
                          >
                            {article.titre}
                          </Link>
                        </h2>
                        
                        {/* Résumé */}
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {truncateText(article.resume)}
                        </p>
                        
                        {/* Mots-clés */}
                        {article.motsCles && article.motsCles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.motsCles.slice(0, 3).map((motCle, index) => (
                              <span 
                                key={index}
                                className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                              >
                                {motCle}
                              </span>
                            ))}
                            {article.motsCles.length > 3 && (
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{article.motsCles.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Lien de lecture */}
                        <Link 
                          href={`/blog/${article.slug}`}
                          className="inline-flex items-center text-accent font-medium hover:text-accent/80 transition-colors"
                        >
                          Lire la suite
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
