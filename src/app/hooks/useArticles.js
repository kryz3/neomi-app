import { useState, useEffect, useCallback } from 'react';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer tous les articles
  const fetchArticles = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      
      if (filters.statut) searchParams.append('statut', filters.statut);
      if (filters.search) searchParams.append('search', filters.search);
      if (filters.sortBy) searchParams.append('sortBy', filters.sortBy);
      if (filters.limit) searchParams.append('limit', filters.limit.toString());
      if (filters.admin) searchParams.append('admin', 'true');
      
      const response = await fetch(`/api/articles?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setArticles(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.message || 'Erreur lors de la récupération des articles');
        setArticles([]); // S'assurer qu'on a un tableau vide en cas d'erreur
      }
    } catch (err) {
      setError('Erreur lors de la récupération des articles');
      setArticles([]); // S'assurer qu'on a un tableau vide en cas d'erreur
      console.error('Erreur fetch articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un article par ID
  const fetchArticleById = useCallback(async (id, isAdmin = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      if (isAdmin) searchParams.append('admin', 'true');
      
      const response = await fetch(`/api/articles/${id}?${searchParams}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la récupération de l\'article');
      console.error('Erreur fetch article:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un article par slug
  const fetchArticleBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles/slug/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la récupération de l\'article');
      console.error('Erreur fetch article by slug:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un nouvel article
  const createArticle = useCallback(async (articleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Ajouter le nouvel article à la liste
        setArticles(prev => [data.data, ...prev]);
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'article');
      console.error('Erreur create article:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un article
  const updateArticle = useCallback(async (id, articleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'article dans la liste
        setArticles(prev => 
          prev.map(article => 
            article._id === id ? data.data : article
          )
        );
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'article');
      console.error('Erreur update article:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un article
  const deleteArticle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Supprimer l'article de la liste
        setArticles(prev => prev.filter(article => article._id !== id));
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError('Erreur lors de la suppression de l\'article');
      console.error('Erreur delete article:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Publier un article
  const publishArticle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles/${id}/publish`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'article dans la liste
        setArticles(prev => 
          prev.map(article => 
            article._id === id ? data.data : article
          )
        );
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la publication de l\'article');
      console.error('Erreur publish article:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Dépublier un article
  const unpublishArticle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles/${id}/unpublish`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'article dans la liste
        setArticles(prev => 
          prev.map(article => 
            article._id === id ? data.data : article
          )
        );
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la dépublication de l\'article');
      console.error('Erreur unpublish article:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload d'image
  const uploadImage = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload/blog', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError('Erreur lors de l\'upload de l\'image');
      console.error('Erreur upload image:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer les articles suggérés (dernier ou avant-dernier selon l'article actuel)
  const fetchSuggestedArticles = useCallback(async (currentSlug) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/articles?statut=publie&sortBy=date&limit=10`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Trier par date de publication décroissante
        const sortedArticles = data.data.sort((a, b) => 
          new Date(b.datePublication) - new Date(a.datePublication)
        );
        
        // Trouver l'index de l'article actuel
        const currentIndex = sortedArticles.findIndex(article => article.slug === currentSlug);
        
        if (currentIndex === 0 && sortedArticles.length > 1) {
          // Article actuel est le plus récent, retourner l'avant-dernier
          return sortedArticles[1];
        } else if (currentIndex > 0) {
          // Article actuel n'est pas le plus récent, retourner le plus récent
          return sortedArticles[0];
        } else if (sortedArticles.length > 1) {
          // Article actuel non trouvé, retourner le plus récent
          return sortedArticles[0];
        }
        
        return null; // Aucun autre article disponible
      } else {
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la récupération des articles suggérés');
      console.error('Erreur fetch suggested articles:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    fetchArticleById,
    fetchArticleBySlug,
    fetchSuggestedArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    uploadImage,
    setError
  };
}
