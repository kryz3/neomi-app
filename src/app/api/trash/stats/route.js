import { NextResponse } from 'next/server';
import { TrashController } from '../../../controllers/trashController.js';
import { verifyAdminAuth, unauthorizedResponse } from '../../../lib/auth.js';

// GET - Récupérer les statistiques de la corbeille
export async function GET(request) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }
    
    const result = await TrashController.getStats();
    
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
    console.error('Erreur API statistiques corbeille:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}