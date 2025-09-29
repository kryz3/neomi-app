"use client";

export default function ArticleContent({ content, mediaItems = [] }) {
  // Fonction pour remplacer les placeholders par le contenu multimédia
  const renderContent = () => {
    if (!content) return '';
    
    let processedContent = content;
    
    // Remplacer chaque placeholder par le contenu approprié
    mediaItems.forEach((item, index) => {
      const placeholder = `[${item.type.toUpperCase()}:${index}]`;
      let replacement = '';
      
      switch (item.type) {
        case 'image':
          replacement = `
            <figure class="article-media article-image my-6 flex flex-col items-center">
              <img 
                src="${item.url}" 
                alt="${item.alt || ''}" 
                class="max-w-sm w-auto h-auto rounded-lg shadow-md"
                style="max-height: 300px; object-fit: contain;"
                loading="lazy"
              />
              ${item.caption ? `<figcaption class="text-sm text-gray-600 text-center mt-2 italic max-w-sm">${item.caption}</figcaption>` : ''}
            </figure>
          `;
          break;
          
        case 'video':
          replacement = `
            <figure class="article-media article-video my-6">
              <div class="relative w-full" style="padding-bottom: 56.25%;">
                <iframe 
                  src="${item.url}"
                  class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy">
                </iframe>
              </div>
              ${item.caption ? `<figcaption class="text-sm text-gray-600 text-center mt-2 italic">${item.caption}</figcaption>` : ''}
            </figure>
          `;
          break;
          
        case 'button':
          let buttonClasses = 'inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ';
          
          switch (item.buttonStyle) {
            case 'primary':
              buttonClasses += 'bg-accent text-white hover:bg-accent/90 focus:ring-accent';
              break;
            case 'secondary':
              buttonClasses += 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
              break;
            case 'outline':
              buttonClasses += 'border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent';
              break;
          }
          
          replacement = `
            <div class="article-media article-button my-6 text-center">
              <a 
                href="${item.url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="${buttonClasses}"
              >
                ${item.buttonText}
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          `;
          break;
      }
      
      processedContent = processedContent.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    });
    
    return processedContent;
  };

  return (
    <div 
      className="prose prose-lg max-w-none article-content"
      dangerouslySetInnerHTML={{ __html: renderContent() }}
      style={{
        // Styles personnalisés pour le contenu de l'article
        '--tw-prose-body': 'rgb(55 65 81)',
        '--tw-prose-headings': 'rgb(17 24 39)',
        '--tw-prose-lead': 'rgb(75 85 99)',
        '--tw-prose-links': 'rgb(79 70 229)',
        '--tw-prose-bold': 'rgb(17 24 39)',
        '--tw-prose-counters': 'rgb(107 114 128)',
        '--tw-prose-bullets': 'rgb(209 213 219)',
        '--tw-prose-hr': 'rgb(229 231 235)',
        '--tw-prose-quotes': 'rgb(17 24 39)',
        '--tw-prose-quote-borders': 'rgb(229 231 235)',
        '--tw-prose-captions': 'rgb(107 114 128)',
        '--tw-prose-code': 'rgb(17 24 39)',
        '--tw-prose-pre-code': 'rgb(229 231 235)',
        '--tw-prose-pre-bg': 'rgb(17 24 39)',
        '--tw-prose-th-borders': 'rgb(209 213 219)',
        '--tw-prose-td-borders': 'rgb(229 231 235)',
      }}
    />
  );
}