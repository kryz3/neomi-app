import { NextResponse } from 'next/server';
import { TrashController } from '../../../controllers/trashController.js';
import { verifyAdminAuth, unauthorizedResponse } from '../../../lib/auth.js';

// POST - Restaurer un élément depuis la corbeille
export async function POST(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const { id } = await params;
    const { itemType } = await request.json();
    
    if (!itemType) {
      return NextResponse.json({
        success: false,
        message: 'Le type d\'élément est requis'
      }, { status: 400 });
    }
    
    const result = await TrashController.restore(id, itemType);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    });
    
  } catch (error) {
    console.error('Erreur API restauration:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// DELETE - Supprimer définitivement un élément
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type');
    
    if (!itemType) {
      return NextResponse.json({
        success: false,
        message: 'Le type d\'élément est requis'
      }, { status: 400 });
    }
    
    const result = await TrashController.permanentDelete(id, itemType);
    
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
    console.error('Erreur API suppression définitive:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}