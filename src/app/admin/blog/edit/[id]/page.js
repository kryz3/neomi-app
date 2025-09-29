"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import { useArticles } from '../../../../hooks/useArticles';
import RichEditor from '../../../../components/RichEditor';
import ArticlePreview from '../../../../components/ArticlePreview';

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const { fetchArticleById, updateArticle, uploadImage, loading, error, setError } = useArticles();
  
  const [formData, setFormData] = useState({
    titre: '',
    slug: '',
    contenu: '',
    resume: '',
    image: '',
    imageAlt: '',
    auteur: 'Admin',
    statut: 'brouillon',
    metaDescription: '',
    motsCles: [],
    ordre: 0,
    mediaItems: []
  });
  
  const [motCle, setMotCle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (id) {
        setLoadingArticle(true);
        const article = await fetchArticleById(id, true);
        if (article) {
          setFormData({
            titre: article.titre || '',
            slug: article.slug || '',
            contenu: article.contenu || '',
            resume: article.resume || '',
            image: article.image || '',
            imageAlt: article.imageAlt || '',
            auteur: article.auteur || 'Admin',
            statut: article.statut || 'brouillon',
            metaDescription: article.metaDescription || '',
            motsCles: article.motsCles || [],
            ordre: article.ordre || 0,
            mediaItems: article.mediaItems || [],
            datePublication: article.datePublication || null
          });
        }
        setLoadingArticle(false);
      }
    };
    
    loadArticle();
  }, [id, fetchArticleById]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMotCle = () => {
    if (motCle.trim() && !formData.motsCles.includes(motCle.trim())) {
      setFormData(prev => ({
        ...prev,
        motsCles: [...prev.motsCles, motCle.trim()]
      }));
      setMotCle('');
    }
  };

  const handleRemoveMotCle = (index) => {
    setFormData(prev => ({
      ...prev,
      motsCles: prev.motsCles.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      console.log('Résultat upload image:', result); // Debug
      if (result && result.url) {
        setFormData(prev => ({
          ...prev,
          image: result.url
        }));
        console.log('Image URL sauvegardée:', result.url); // Debug
      } else {
        setError('Erreur lors de l\'upload: URL manquante');
        console.error('Résultat upload invalide:', result);
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.titre.trim()) {
      setError('Le titre est requis');
      return;
    }
    if (!formData.contenu.trim()) {
      setError('Le contenu est requis');
      return;
    }
    if (!formData.resume.trim()) {
      setError('Le résumé est requis');
      return;
    }

    console.log('Données de l\'article à mettre à jour:', formData); // Debug
    const result = await updateArticle(id, formData);
    if (result) {
      console.log('Article mis à jour avec succès:', result); // Debug
      router.push('/admin/blog');
    }
  };

  const handleSaveAndPublish = async () => {
    setFormData(prev => ({ 
      ...prev, 
      statut: 'publie',
      datePublication: new Date().toISOString()
    }));
    // Le submit se fera automatiquement avec le nouveau statut
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 0);
  };

  if (loadingArticle) {
    return (
      <div className="fixed inset-0 z-50 h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 h-screen bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mr-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Dashboard Admin
              </Link>
              <Link
                href="/admin/blog"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mr-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Gestion du Blog
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Éditer l'Article</h1>
                <p className="text-gray-600">Modifier l'article : {formData.titre}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Site Web
              </Link>
              <button
                type="button"
                onClick={() => router.push('/admin/blog')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!formData.titre || !formData.contenu}
              >
                Aperçu
              </button>
              {formData.statut !== 'publie' && (
                <button
                  type="button"
                  onClick={handleSaveAndPublish}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Publication...' : 'Publier'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations principales */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations principales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  placeholder="Titre de votre article"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-de-larticle"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  pattern="^[a-z0-9-]+$"
                  title="Seules les lettres minuscules, chiffres et tirets sont autorisés"
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'URL sera : /blog/{formData.slug}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur
                </label>
                <input
                  type="text"
                  name="auteur"
                  value={formData.auteur}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Résumé *
              </label>
              <textarea
                name="resume"
                value={formData.resume}
                onChange={handleInputChange}
                placeholder="Résumé de l'article (300 caractères max)"
                maxLength={300}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.resume.length}/300 caractères
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Image de l'article</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                {uploadingImage && (
                  <p className="text-sm text-blue-600 mt-2">Upload en cours...</p>
                )}
              </div>
              
              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 mb-2">✓ Image disponible</p>
                  <img
                    src={formData.image}
                    alt="Aperçu"
                    className="max-w-xs h-48 object-cover rounded-lg border border-gray-200"
                    onLoad={() => console.log('Image chargée:', formData.image)}
                    onError={() => console.error('Erreur chargement image:', formData.image)}
                  />
                  <p className="text-xs text-gray-500 mt-1">URL: {formData.image}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte alternatif (ALT)
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleInputChange}
                  placeholder="Description de l'image pour l'accessibilité"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contenu de l'article</h3>
            
            <RichEditor
              content={formData.contenu}
              onChange={(content) => setFormData(prev => ({ ...prev, contenu: content }))}
              mediaItems={formData.mediaItems}
              onMediaItemsChange={(mediaItems) => setFormData(prev => ({ ...prev, mediaItems }))}
              uploadImage={uploadImage}
            />
          </div>

          {/* SEO et métadonnées */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO et métadonnées</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Description pour les moteurs de recherche (160 caractères max)"
                  maxLength={160}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 caractères
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={motCle}
                    onChange={(e) => setMotCle(e.target.value)}
                    placeholder="Ajouter un mot-clé"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMotCle())}
                  />
                  <button
                    type="button"
                    onClick={handleAddMotCle}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Ajouter
                  </button>
                </div>
                
                {formData.motsCles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.motsCles.map((mot, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                      >
                        {mot}
                        <button
                          type="button"
                          onClick={() => handleRemoveMotCle(index)}
                          className="ml-2 text-accent/60 hover:text-accent"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Paramètres</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="ordre"
                  value={formData.ordre}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
            
            {formData.statut === 'publie' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication
                </label>
                <input
                  type="datetime-local"
                  name="datePublication"
                  value={formData.datePublication ? new Date(formData.datePublication).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    datePublication: e.target.value ? new Date(e.target.value).toISOString() : null 
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifiez pour changer la position dans la liste des articles
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      {/* Prévisualisation */}
      <ArticlePreview
        article={formData}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
