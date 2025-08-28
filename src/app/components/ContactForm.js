'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message envoyé avec succès !' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Une erreur est survenue' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-1 md:space-y-2">
        {/* Nom et Email sur la même ligne - responsive amélioré */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-primary mb-1">
              Nom *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-2 py-1.5 text-xs border border-light/40 rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary shadow-sm hover:shadow-md hover:border-accent/50"
              placeholder="Votre nom"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-primary mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 py-1.5 text-xs border border-light/40 rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary shadow-sm hover:shadow-md hover:border-accent/50"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        {/* Téléphone et Sujet sur la même ligne - responsive amélioré */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-primary mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-xs border border-light/40 rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary shadow-sm hover:shadow-md hover:border-accent/50"
              placeholder="06 12 34 56 78"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-xs font-medium text-primary mb-1">
              Sujet
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-xs border border-light/40 rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary shadow-sm hover:shadow-md hover:border-accent/50 cursor-pointer"
            >
              <option value="">Sélectionnez</option>
              <option value="Information">Information</option>
              <option value="Devis">Devis</option>
              <option value="Rendez-vous">Rendez-vous</option>
              <option value="Comptabilité">Comptabilité</option>
              <option value="Fiscalité">Fiscalité</option>
              <option value="Création">Création entreprise</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-medium text-primary mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-2 py-1.5 text-xs border border-light/40 rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary resize-none shadow-sm hover:shadow-md hover:border-accent/50"
            placeholder="Votre message..."
          />
        </div>

        {/* Message de statut */}
        {submitStatus && (
          <div className={`p-2 rounded-lg text-xs backdrop-blur-sm shadow-sm ${
            submitStatus.type === 'success' 
              ? 'bg-info/10 border border-info/30 text-info' 
              : 'bg-accent/10 border border-accent/30 text-accent'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {/* Bouton de soumission et note obligatoire */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-1 md:pt-2 gap-1 md:gap-2">
          <p className="text-xs text-secondary order-2 sm:order-1 whitespace-nowrap">
            * Obligatoire
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 order-1 sm:order-2 shrink-0"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi...
              </>
            ) : (
              'Envoyer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
