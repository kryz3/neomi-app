import { NextResponse } from 'next/server';
import { TrashController } from '../../controllers/trashController.js';
import { verifyAdminAuth, unauthorizedResponse } from '../../lib/auth.js';

// GET - Récupérer tous les éléments de la corbeille
export async function GET(request) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type');
    const limit = searchParams.get('limit');
    
    const filters = {};
    if (itemType) filters.itemType = itemType;
    if (limit) filters.limit = parseInt(limit);
    
    const result = await TrashController.getAll(filters);
    
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
    console.error('Erreur API corbeille GET:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// DELETE - Vider la corbeille
export async function DELETE(request) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const result = await TrashController.empty();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    console.error('Erreur API corbeille DELETE:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}