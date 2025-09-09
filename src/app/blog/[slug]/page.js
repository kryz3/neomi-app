"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useArticlesContext } from '../../context/ArticlesContext';

export default function ArticlePage() {
  const { slug } = useParams();
  const { loading, error, getArticleBySlug, getSuggestedArticle } = useArticlesContext();
  const [article, setArticle] = useState(null);
  const [suggestedArticle, setSuggestedArticle] = useState(null);

  useEffect(() => {
    if (slug && !loading) {
      const articleData = getArticleBySlug(slug);
      if (articleData) {
        setArticle(articleData);
        const suggested = getSuggestedArticle(slug);
        setSuggestedArticle(suggested);
        
        // Mettre à jour les métadonnées pour le partage social
        updateMetaTags(articleData);
      } else {
        notFound();
      }
    }
  }, [slug, loading, getArticleBySlug, getSuggestedArticle]);

  // Fonction pour mettre à jour les meta tags dynamiquement
  const updateMetaTags = (article) => {
    if (typeof window !== 'undefined') {
      // Titre de la page
      document.title = article.titre;
      
      // Meta description
      updateMetaTag('name', 'description', article.resume);
      
      // Open Graph meta tags
      updateMetaTag('property', 'og:title', article.titre);
      updateMetaTag('property', 'og:description', article.resume);
      updateMetaTag('property', 'og:image', article.image);
      updateMetaTag('property', 'og:url', window.location.href);
      updateMetaTag('property', 'og:type', 'article');
      
      // Twitter meta tags
      updateMetaTag('name', 'twitter:card', 'summary_large_image');
      updateMetaTag('name', 'twitter:title', article.titre);
      updateMetaTag('name', 'twitter:description', article.resume);
      updateMetaTag('name', 'twitter:image', article.image);
    }
  };

  // Fonction utilitaire pour mettre à jour un meta tag
  const updateMetaTag = (attribute, attributeValue, content) => {
    let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const shareOnSocial = (platform, event = null) => {
    const url = window.location.href;
    const text = article.titre;
    const description = article.resume;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'linkedin':
        // LinkedIn nouvelle URL de partage
        shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + '\n\n' + description + '\n\n' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text + ' - ' + description)}`;
        break;
      case 'facebook':
        // Facebook simple - les meta tags feront le reste
        shareUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(article.titre)}&body=${encodeURIComponent(description + '\n\nLire l\'article complet : ' + url)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(text + ' - ' + description + ' ' + url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + description + '\n\n' + url)}`;
        break;
      case 'copy':
        // Copier le lien dans le presse-papier
        navigator.clipboard.writeText(url).then(() => {
          // Afficher une notification de succès
          if (event) {
            const button = event.target.closest('button');
            const originalText = button.innerHTML;
            button.innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            
            `;
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          }
        }).catch(() => {
          // Fallback pour les navigateurs qui ne supportent pas clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        });
        return;
    }
    
    if (platform === 'email' || platform === 'sms') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center snap-start">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center snap-start">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article introuvable</h1>
          <p className="text-gray-600 mb-8">
            L'article que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <Link
            href="/blog"
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 snap-start">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* En-tête de l'article */}
          <div className="px-8 pt-8 pb-6">
            {/* Métadonnées */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <time dateTime={article.datePublication}>
                {formatDate(article.datePublication)}
              </time>
              <span className="mx-2">•</span>
              <span>Par {article.auteur}</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.titre}
            </h1>

            {/* Résumé */}
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {article.resume}
            </p>

            {/* Mots-clés */}
            {article.motsCles && article.motsCles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.motsCles.map((motCle, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                  >
                    {motCle}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image principale - Taille encore plus réduite */}
          {article.image && (
            <div className="px-8 mb-8">
              <div className="aspect-[3/2] max-w-lg mx-auto bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={article.image}
                  alt={article.imageAlt || article.titre}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.imageAlt && (
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  {article.imageAlt}
                </p>
              )}
            </div>
          )}

          {/* Contenu */}
          <div className="px-8 pb-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:my-4 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: article.contenu }}
            />
          </div>
        </div>

        {/* Boutons de partage */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Partager cet article
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => shareOnSocial('linkedin')}
              className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006396] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
            
            <button
              onClick={() => shareOnSocial('twitter')}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
              X
            </button>
            
            <button
              onClick={() => shareOnSocial('facebook')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            
            <button
              onClick={() => shareOnSocial('whatsapp')}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#22C55E] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.085"/>
              </svg>
              WhatsApp
            </button>
            
            <button
              onClick={() => shareOnSocial('email')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
            
            <button
              onClick={() => shareOnSocial('sms')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              SMS
            </button>
            
            <button
              onClick={(e) => shareOnSocial('copy', e)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>

            </button>
          </div>
        </div>

        {/* Article suggéré */}
        {suggestedArticle && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Article suggéré</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                {suggestedArticle.image && (
                  <Link href={`/blog/${suggestedArticle.slug}`} className="block aspect-video md:aspect-auto bg-gray-100 overflow-hidden">
                    <img
                      src={suggestedArticle.image}
                      alt={suggestedArticle.imageAlt || suggestedArticle.titre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                )}
                
                {/* Contenu */}
                <div className="p-6 flex flex-col justify-center">
                  {/* Date et auteur */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <time dateTime={suggestedArticle.datePublication}>
                      {formatDate(suggestedArticle.datePublication)}
                    </time>
                    <span className="mx-2">•</span>
                    <span>Par {suggestedArticle.auteur}</span>
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    <Link 
                      href={`/blog/${suggestedArticle.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {suggestedArticle.titre}
                    </Link>
                  </h3>
                  
                  {/* Résumé */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {suggestedArticle.resume}
                  </p>
                  
                  {/* Lien de lecture */}
                  <Link 
                    href={`/blog/${suggestedArticle.slug}`}
                    className="inline-flex items-center text-accent font-medium hover:text-accent/80 transition-colors"
                  >
                    Lire cet article
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cet article vous a été utile ?
              </h3>
              <p className="text-gray-600">
                Découvrez d'autres articles ou contactez-nous pour en savoir plus
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Autres articles
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
