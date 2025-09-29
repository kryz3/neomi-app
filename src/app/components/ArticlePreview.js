"use client";
import { useState } from 'react';
import ArticleContent from './ArticleContent';

export default function ArticlePreview({ 
  article, 
  isOpen, 
  onClose 
}) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Aperçu de l'article</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Article preview */}
        <div className="p-6">
          {/* Métadonnées */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <time>
              {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
            <span className="mx-2">•</span>
            <span>Par {article.auteur}</span>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {article.titre}
          </h1>

          {/* Résumé */}
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
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

          {/* Image principale */}
          {article.image && (
            <div className="mb-6">
              <div className="aspect-[16/9] max-w-2xl mx-auto bg-gray-100 rounded-lg overflow-hidden">
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

          {/* Contenu avec médias */}
          <div className="border-t pt-6">
            <ArticleContent 
              content={article.contenu} 
              mediaItems={article.mediaItems || []}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fermer l'aperçu
          </button>
        </div>
      </div>
    </div>
  );
}