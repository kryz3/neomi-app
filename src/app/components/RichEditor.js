"use client";
import { useState, useRef } from 'react';

export default function RichEditor({ 
  content, 
  onChange, 
  mediaItems = [], 
  onMediaItemsChange,
  uploadImage 
}) {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState('image');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const [mediaForm, setMediaForm] = useState({
    type: 'image',
    url: '',
    alt: '',
    caption: '',
    buttonText: '',
    buttonStyle: 'primary',
    position: 0
  });

  const handleMediaTypeSelect = (type) => {
    setSelectedMediaType(type);
    setMediaForm({ 
      ...mediaForm, 
      type,
      url: '',
      alt: '',
      caption: '',
      buttonText: '',
      buttonStyle: 'primary'
    });
    setShowMediaModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      if (result) {
        setMediaForm(prev => ({
          ...prev,
          url: result.url
        }));
      }
    } catch (err) {
      console.error('Erreur upload:', err);
    }
  };

  const parseYouTubeUrl = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&#\n?]*)/,
      /youtube\.com\/watch\?.*v=([^&#\n?]*)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    return url;
  };

  const insertTextAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = content || '';
    
    const newContent = 
      currentContent.substring(0, start) + 
      text + 
      currentContent.substring(end);
    
    onChange(newContent);
    
    // Remettre le focus et positionner le curseur après l'insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const addMediaItem = () => {
    const newMediaItem = {
      ...mediaForm,
      position: mediaItems.length,
      createdAt: new Date().toISOString()
    };

    // Traiter l'URL YouTube si c'est une vidéo
    if (newMediaItem.type === 'video') {
      newMediaItem.url = parseYouTubeUrl(newMediaItem.url);
    }

    const updatedMediaItems = [...mediaItems, newMediaItem];
    onMediaItemsChange(updatedMediaItems);

    // Insérer le placeholder dans le contenu
    let placeholder = '';
    switch (newMediaItem.type) {
      case 'image':
        placeholder = `\n\n[IMAGE:${mediaItems.length}]\n\n`;
        break;
      case 'video':
        placeholder = `\n\n[VIDEO:${mediaItems.length}]\n\n`;
        break;
      case 'button':
        placeholder = `\n\n[BUTTON:${mediaItems.length}]\n\n`;
        break;
    }
    
    insertTextAtCursor(placeholder);
    
    // Reset du formulaire
    setMediaForm({
      type: 'image',
      url: '',
      alt: '',
      caption: '',
      buttonText: '',
      buttonStyle: 'primary',
      position: 0
    });
    setShowMediaModal(false);
  };

  const removeMediaItem = (index) => {
    const updatedMediaItems = mediaItems.filter((_, i) => i !== index);
    onMediaItemsChange(updatedMediaItems);

    // Supprimer le placeholder du contenu
    const placeholderPattern = new RegExp(`\\[(?:IMAGE|VIDEO|BUTTON):${index}\\]`, 'g');
    const updatedContent = (content || '').replace(placeholderPattern, '');
    onChange(updatedContent);
  };

  const moveMediaItem = (index, direction) => {
    const newMediaItems = [...mediaItems];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < mediaItems.length) {
      [newMediaItems[index], newMediaItems[newIndex]] = [newMediaItems[newIndex], newMediaItems[index]];
      onMediaItemsChange(newMediaItems);
    }
  };

  const insertHtmlTag = (tag, hasClosing = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = (content || '').substring(start, end);
    
    let insertText = '';
    if (hasClosing) {
      insertText = selectedText 
        ? `<${tag}>${selectedText}</${tag}>` 
        : `<${tag}></${tag}>`;
    } else {
      insertText = `<${tag}>`;
    }
    
    insertTextAtCursor(insertText);
  };

  const insertAlignedText = (alignment) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = (content || '').substring(start, end);
    
    let alignClass = '';
    switch (alignment) {
      case 'left':
        alignClass = 'text-left';
        break;
      case 'center':
        alignClass = 'text-center';
        break;
      case 'right':
        alignClass = 'text-right';
        break;
      case 'justify':
        alignClass = 'text-justify';
        break;
    }
    
    const insertText = selectedText 
      ? `<div class="${alignClass}">${selectedText}</div>` 
      : `<div class="${alignClass}"></div>`;
    
    insertTextAtCursor(insertText);
  };

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          <h4 className="text-sm font-medium text-gray-700 w-full mb-2">Formatage HTML</h4>
          <button
            type="button"
            onClick={() => insertHtmlTag('h2')}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertHtmlTag('h3')}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertHtmlTag('p')}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Paragraphe
          </button>
          <button
            type="button"
            onClick={() => insertHtmlTag('strong')}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <strong>Gras</strong>
          </button>
          <button
            type="button"
            onClick={() => insertHtmlTag('em')}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <em>Italique</em>
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor('<br>')}
            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Saut de ligne
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <h4 className="text-sm font-medium text-gray-700 w-full mb-2">Alignement du texte</h4>
          <button
            type="button"
            onClick={() => insertAlignedText('left')}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Aligner à gauche"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
            Gauche
          </button>
          <button
            type="button"
            onClick={() => insertAlignedText('center')}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Centrer"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M6 18h12" />
            </svg>
            Centré
          </button>
          <button
            type="button"
            onClick={() => insertAlignedText('right')}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Aligner à droite"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M10 18h10" />
            </svg>
            Droite
          </button>
          <button
            type="button"
            onClick={() => insertAlignedText('justify')}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Justifier"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Justifié
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <h4 className="text-sm font-medium text-gray-700 w-full mb-2">Insérer des médias</h4>
          <button
            type="button"
            onClick={() => handleMediaTypeSelect('image')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ajouter une image
          </button>
          <button
            type="button"
            onClick={() => handleMediaTypeSelect('video')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Ajouter une vidéo
          </button>
          <button
            type="button"
            onClick={() => handleMediaTypeSelect('button')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Ajouter un bouton
          </button>
        </div>
      </div>

      {/* Zone de texte principale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu de l'article *
        </label>
        <textarea
          ref={textareaRef}
          value={content || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rédigez votre article ici... Utilisez les boutons ci-dessus pour insérer du contenu multimedia."
          rows={20}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono text-sm"
          onSelect={(e) => setCursorPosition(e.target.selectionStart)}
          required
        />
        <div className="mt-2 text-xs text-gray-500">
          <p>Les placeholders [IMAGE:X], [VIDEO:X], [BUTTON:X] seront remplacés par le contenu multimédia lors de l'affichage.</p>
        </div>
      </div>

      {/* Liste des éléments média */}
      {mediaItems.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Éléments multimédias ({mediaItems.length})</h4>
          <div className="space-y-3">
            {mediaItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {item.type === 'image' && (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {item.type === 'video' && (
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {item.type === 'button' && (
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded">
                      {item.type.toUpperCase()}:{index}
                    </span>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.type === 'image' && (item.alt || 'Image sans titre')}
                      {item.type === 'video' && (item.caption || 'Vidéo sans titre')}
                      {item.type === 'button' && (item.buttonText || 'Bouton sans texte')}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.url}</p>
                  {item.caption && (
                    <p className="text-xs text-gray-600 mt-1">{item.caption}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveMediaItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    title="Déplacer vers le haut"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMediaItem(index, 'down')}
                    disabled={index === mediaItems.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    title="Déplacer vers le bas"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMediaItem(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal pour ajouter un élément média */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ajouter {selectedMediaType === 'image' ? 'une image' : 
                         selectedMediaType === 'video' ? 'une vidéo' : 
                         'un bouton'}
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {selectedMediaType === 'image' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload d'image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ou URL de l'image
                    </label>
                    <input
                      type="url"
                      value={mediaForm.url}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texte alternatif (ALT)
                    </label>
                    <input
                      type="text"
                      value={mediaForm.alt}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, alt: e.target.value }))}
                      placeholder="Description de l'image"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Légende (optionnel)
                    </label>
                    <input
                      type="text"
                      value={mediaForm.caption}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Légende de l'image"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                </>
              )}

              {selectedMediaType === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la vidéo YouTube
                    </label>
                    <input
                      type="url"
                      value={mediaForm.url}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formats supportés : YouTube (watch, youtu.be, embed)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre/Description (optionnel)
                    </label>
                    <input
                      type="text"
                      value={mediaForm.caption}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Titre ou description de la vidéo"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                </>
              )}

              {selectedMediaType === 'button' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texte du bouton *
                    </label>
                    <input
                      type="text"
                      value={mediaForm.buttonText}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Cliquez ici"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de redirection *
                    </label>
                    <input
                      type="url"
                      value={mediaForm.url}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style du bouton
                    </label>
                    <select
                      value={mediaForm.buttonStyle}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, buttonStyle: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <option value="primary">Principal (fond coloré)</option>
                      <option value="secondary">Secondaire (fond gris)</option>
                      <option value="outline">Contour (bordure seulement)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={addMediaItem}
                disabled={!mediaForm.url || (selectedMediaType === 'button' && !mediaForm.buttonText)}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}