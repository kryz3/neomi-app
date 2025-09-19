'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    rgpdConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const [csrfToken, setCSRFToken] = useState(null);
  
  const captchaRef = useRef(null);
  
  // Charger le token CSRF au montage du composant
  useEffect(() => {
    loadCSRFToken();
  }, []);
  
  const loadCSRFToken = async () => {
    try {
      const response = await fetch('/api/csrf');
      const data = await response.json();
      setCSRFToken(data.csrfToken);
    } catch (error) {
      console.error('Erreur lors du chargement du token CSRF:', error);
    }
  };

  const onCaptchaVerify = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const onCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Nettoyer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    if (!formData.rgpdConsent) newErrors.rgpdConsent = 'Vous devez accepter les conditions';
    if (!captchaToken) newErrors.captcha = 'Veuillez compléter la vérification CAPTCHA';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          ...formData,
          captcha: captchaToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message envoyé avec succès !' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          rgpdConsent: false
        });
        
        // Réinitialiser le CAPTCHA
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
        
        // Recharger le token CSRF
        loadCSRFToken();
        
      } else {
        if (data.errors) {
          // Erreurs de validation
          const fieldErrors = {};
          data.errors.forEach(error => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setSubmitStatus({ type: 'error', message: data.error || 'Une erreur est survenue' });
        }
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
              className={`w-full px-2 py-1.5 text-xs border rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary shadow-sm hover:shadow-md hover:border-accent/50 ${
                errors.name ? 'border-red-500' : 'border-light/40'
              }`}
              placeholder="Votre nom"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
              className={`w-full px-2 py-1.5 text-xs border rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary shadow-sm hover:shadow-md hover:border-accent/50 ${
                errors.email ? 'border-red-500' : 'border-light/40'
              }`}
              placeholder="votre@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            className={`w-full px-2 py-1.5 text-xs border rounded-lg bg-white/70 backdrop-blur-sm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-primary resize-none shadow-sm hover:shadow-md hover:border-accent/50 ${
              errors.message ? 'border-red-500' : 'border-light/40'
            }`}
            placeholder="Votre message..."
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        {/* Case à cocher RGPD */}
        <div className="flex items-start space-x-2 pt-1">
          <input
            type="checkbox"
            id="rgpdConsent"
            name="rgpdConsent"
            checked={formData.rgpdConsent}
            onChange={handleChange}
            required
            className="mt-0.5 w-4 h-4 text-accent bg-white border-2 border-light/40 rounded focus:ring-accent focus:ring-2 focus:ring-offset-0 transition-all duration-300"
          />
          <label htmlFor="rgpdConsent" className="text-xs text-primary leading-relaxed">
            J'accepte que mes données personnelles soient collectées et traitées par Neomi pour répondre à ma demande. 
            <a href="/politique-confidentialite" className="text-accent hover:text-accent/80 underline ml-1" target="_blank" rel="noopener noreferrer">
              En savoir plus
            </a>
            <span className="text-accent ml-1">*</span>
          </label>
        </div>
        {errors.rgpdConsent && <p className="text-red-500 text-xs mt-1">{errors.rgpdConsent}</p>}

        {/* CAPTCHA */}
        <div className="flex justify-center py-2">
          <div>
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              onVerify={onCaptchaVerify}
              onExpire={onCaptchaExpire}
              onError={(err) => console.error('Erreur hCaptcha:', err)}
              theme="light"
              size="compact"
            />
            {errors.captcha && <p className="text-red-500 text-xs mt-1 text-center">{errors.captcha}</p>}
          </div>
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
            * Champs obligatoires
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !formData.rgpdConsent || !captchaToken}
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
