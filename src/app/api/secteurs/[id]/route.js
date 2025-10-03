import { NextResponse } from 'next/server';
import { updateSecteur, deleteSecteur } from '../../../controllers/secteurController.js';
import { verifyAdminAuth, unauthorizedResponse } from '@/app/lib/auth.js';

// PUT /api/secteurs/[id] - Mettre à jour un secteur (ADMIN SEULEMENT)
export async function PUT(request, { params }) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const result = await updateSecteur(id, body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Secteur non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erreur API PUT /secteurs/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/secteurs/[id] - Supprimer un secteur (ADMIN SEULEMENT)
export async function DELETE(request, { params }) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const { id } = await params;

    const result = await deleteSecteur(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Secteur non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json({ message: 'Secteur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur API DELETE /secteurs/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
