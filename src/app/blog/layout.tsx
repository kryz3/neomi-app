import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Actualités - Neomi',
  description: 'Découvrez nos derniers articles, conseils et actualités dans le domaine de la gestion d\'entreprise et de la comptabilité. Restez informé des dernières tendances avec NEOMI.',
  keywords: [
    'blog comptabilité',
    'actualités entreprise',
    'conseils gestion',
    'expertise comptable',
    'NEOMI',
    'articles comptables',
    'actualités fiscales',
    'gestion entreprise'
  ],
  openGraph: {
    title: 'Blog & Actualités - NEOMI Expertise Comptable',
    description: 'Découvrez nos derniers articles, conseils et actualités dans le domaine de la gestion d\'entreprise et de la comptabilité.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'NEOMI Expertise Comptable',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Actualités - NEOMI Expertise Comptable',
    description: 'Découvrez nos derniers articles, conseils et actualités dans le domaine de la gestion d\'entreprise et de la comptabilité.',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}