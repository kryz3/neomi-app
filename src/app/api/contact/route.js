import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { withRateLimit } from '../../lib/rateLimit.js';
import { contactSchema, validateAndSanitize, validationErrorResponse } from '../../lib/validation.js';
import { withSecurityHeaders, applySecureCacheHeaders } from '../../lib/security.js';
import { withCSRFProtection } from '../../lib/csrf.js';

async function contactHandler(request) {
  try {
    const body = await request.json();

    // Validation et sanitisation des données
    const validation = validateAndSanitize(contactSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, captcha } = validation.data;

    // Vérification CAPTCHA (hCaptcha)
    const captchaValid = await verifyCaptcha(captcha);
    if (!captchaValid) {
      return NextResponse.json(
        { error: 'CAPTCHA invalide', message: 'Veuillez compléter la vérification CAPTCHA' },
        { status: 400 }
      );
    }

    // Configuration du transporteur email
    // IMPORTANT: Vous devez configurer vos variables d'environnement
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true pour le port 465, false pour le port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Configuration de l'email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `Nouveau message de contact: ${subject || 'Sans sujet'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #AC0C61; border-bottom: 2px solid #AC0C61; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #262451;">Nom:</strong> ${name}</p>
            <p><strong style="color: #262451;">Email:</strong> ${email}</p>
            ${phone ? `<p><strong style="color: #262451;">Téléphone:</strong> ${phone}</p>` : ''}
            <p><strong style="color: #262451;">Sujet:</strong> ${subject || 'Non spécifié'}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #435EB8; margin: 20px 0;">
            <h3 style="color: #435EB8; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              Ce message a été envoyé depuis le formulaire de contact du site Neomi
            </p>
          </div>
        </div>
      `,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    const response = NextResponse.json(
      { message: 'Message envoyé avec succès' },
      { status: 200 }
    );

    // Appliquer les headers de sécurité et cache
    applySecureCacheHeaders(response, 'no-cache');
    
    return response;

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    const response = NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
    
    applySecureCacheHeaders(response, 'no-cache');
    return response;
  }
}

/**
 * Vérifier le CAPTCHA hCaptcha
 */
async function verifyCaptcha(captchaToken) {
  if (!captchaToken) {
    console.log('� Token CAPTCHA manquant');
    return false;
  }
  
  if (!process.env.HCAPTCHA_SECRET_KEY) {
    console.error('� HCAPTCHA_SECRET_KEY non configurée');
    return false;
  }
  
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY,
        response: captchaToken
      })
    });
    
    const data = await response.json();
    console.log('🛡️ Vérification CAPTCHA:', data.success ? 'Succès' : 'Échec', data.success ? '' : `(${data['error-codes']?.join(', ') || 'Erreur inconnue'})`);
    return data.success === true;
  } catch (error) {
    console.error('🚨 Erreur de vérification CAPTCHA:', error);
    return false;
  }
}

// Appliquer toutes les protections
export const POST = withSecurityHeaders(
  withRateLimit(
    withCSRFProtection(contactHandler),
    '/api/contact'
  )
);
