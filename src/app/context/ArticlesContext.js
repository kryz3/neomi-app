"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les articles publiés au démarrage
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/articles?statut=publie&sortBy=date&limit=50');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Trier par date de publication décroissante
          const sortedArticles = data.data.sort((a, b) => 
            new Date(b.datePublication) - new Date(a.datePublication)
          );
          setArticles(sortedArticles);
        } else {
          setError(data.message || 'Erreur lors du chargement des articles');
          setArticles([]);
        }
      } catch (err) {
        setError('Erreur lors du chargement des articles');
        setArticles([]);
        console.error('Erreur load articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Fonction pour trouver un article par slug
  const getArticleBySlug = (slug) => {
    return articles.find(article => article.slug === slug) || null;
  };

  // Fonction pour obtenir l'article suggéré
  const getSuggestedArticle = (currentSlug) => {
    if (articles.length <= 1) return null;
    
    const currentIndex = articles.findIndex(article => article.slug === currentSlug);
    
    if (currentIndex === 0 && articles.length > 1) {
      // Article actuel est le plus récent, retourner l'avant-dernier
      return articles[1];
    } else if (currentIndex > 0) {
      // Article actuel n'est pas le plus récent, retourner le plus récent
      return articles[0];
    } else {
      // Article actuel non trouvé, retourner le plus récent
      return articles[0];
    }
  };

  // Fonction pour filtrer les articles
  const getFilteredArticles = (searchTerm = '') => {
    if (!searchTerm.trim()) return articles;
    
    return articles.filter(article =>
      article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.resume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.motsCles && article.motsCles.some(mot => 
        mot.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  };

  // Fonction pour rafraîchir les articles (utile pour l'admin)
  const refreshArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/articles?statut=publie&sortBy=date&limit=50');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const sortedArticles = data.data.sort((a, b) => 
          new Date(b.datePublication) - new Date(a.datePublication)
        );
        setArticles(sortedArticles);
      }
    } catch (err) {
      setError('Erreur lors du rafraîchissement des articles');
      console.error('Erreur refresh articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    articles,
    loading,
    error,
    getArticleBySlug,
    getSuggestedArticle,
    getFilteredArticles,
    refreshArticles,
    setError
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticlesContext() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticlesContext must be used within an ArticlesProvider');
  }
  return context;
}
