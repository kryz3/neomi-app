import { NextResponse } from 'next/server';
import { ArticleController } from '../../../controllers/articleController.js';
import { verifyAdminAuth, unauthorizedResponse } from '../../../lib/auth.js';

// GET - Récupérer un article par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    
    // Si c'est une requête admin, vérifier l'authentification
    if (isAdmin) {
      const authResult = await verifyAdminAuth(request);
      if (authResult.error) {
        return unauthorizedResponse(authResult.error);
      }
    }
    
    const result = await ArticleController.getById(id);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }
    
    // Pour les non-admins, vérifier que l'article est publié
    if (!isAdmin && result.data.statut !== 'publie') {
      return NextResponse.json({
        success: false,
        message: 'Article non trouvé'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    console.error('Erreur API article GET:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// PUT - Mettre à jour un article (Admin seulement)
export async function PUT(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const { id } = await params;
    const body = await request.json();
    
    const result = await ArticleController.update(id, body);
    
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
    });
    
  } catch (error) {
    console.error('Erreur API article PUT:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// DELETE - Supprimer un article (Admin seulement)
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const { id } = await params;
    
    const result = await ArticleController.delete(id);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    console.error('Erreur API article DELETE:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}
