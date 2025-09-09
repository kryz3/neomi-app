import Link from 'next/link';

export default function BlogPreview({ articles = [] }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Prendre les 3 articles les plus récents
  const recentArticles = articles.slice(0, 3);

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Blog & Actualités
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos derniers articles, conseils et actualités dans le domaine du conseil et de l'innovation.
          </p>
        </div>

        {/* Articles */}
        {recentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recentArticles.map((article) => (
              <article key={article._id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                {article.image && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.imageAlt || article.titre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                {/* Contenu */}
                <div className="p-6">
                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(article.datePublication)}
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/blog/${article.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {article.titre}
                    </Link>
                  </h3>
                  
                  {/* Résumé */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateText(article.resume)}
                  </p>
                  
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
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Bientôt des articles !
            </h3>
            <p className="text-gray-600">
              Nous préparons du contenu intéressant pour vous. Revenez prochainement.
            </p>
          </div>
        )}

        {/* Lien vers le blog complet */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Voir tous les articles
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
