import { NextResponse } from 'next/server';
import { AvisController } from '../../../controllers/avisController.js';
import { verifyAdminAuth, unauthorizedResponse } from '@/app/lib/auth.js';

// DELETE - Suppression définitive d'un avis (ADMIN SEULEMENT)
export async function DELETE(request, { params }) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const { id } = await params;
    
    const result = await AvisController.hardDeleteAvis(id);
    
    if (!result.success) {
      const status = result.error === 'Avis non trouvé' ? 404 : 500;
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erreur dans DELETE /api/avis/[id]/hard:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
