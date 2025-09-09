import { NextResponse } from 'next/server';
import { ArticleController } from '../../controllers/articleController.js';
import { verifyAdminAuth, unauthorizedResponse } from '../../lib/auth.js';

// GET - Récupérer tous les articles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const limit = searchParams.get('limit');
    const isAdmin = searchParams.get('admin') === 'true';
    
    // Si c'est une requête admin, vérifier l'authentification
    if (isAdmin) {
      const authResult = await verifyAdminAuth(request);
      if (authResult.error) {
        return unauthorizedResponse(authResult.error);
      }
    }
    
    const filters = {};
    
    // Pour les non-admins, ne montrer que les articles publiés
    if (!isAdmin) {
      filters.statut = 'publie';
    } else if (statut) {
      filters.statut = statut;
    }
    
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (limit) filters.limit = parseInt(limit);
    
    const result = await ArticleController.getAll(filters);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    console.error('Erreur API articles GET:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// POST - Créer un nouvel article (Admin seulement)
export async function POST(request) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const body = await request.json();
    
    // Validation des champs requis
    const requiredFields = ['titre', 'contenu', 'resume'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json({
          success: false,
          message: `Le champ ${field} est requis`
        }, { status: 400 });
      }
    }
    
    const result = await ArticleController.create(body);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur API articles POST:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}
