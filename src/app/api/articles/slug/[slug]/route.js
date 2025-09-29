import { NextResponse } from 'next/server';
import { ArticleController } from '../../../../controllers/articleController.js';

// GET - Récupérer un article par slug (public)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    const result = await ArticleController.getBySlug(slug);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    });
    
  } catch (error) {
    console.error('Erreur API article slug GET:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}
