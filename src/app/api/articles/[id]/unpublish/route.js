import { NextResponse } from 'next/server';
import { ArticleController } from '../../../../controllers/articleController.js';
import { verifyAdminAuth, unauthorizedResponse } from '../../../../lib/auth.js';

// POST - Dépublier un article (Admin seulement)
export async function POST(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const { id } = params;
    
    const result = await ArticleController.unpublish(id);
    
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
    console.error('Erreur API article unpublish POST:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}
