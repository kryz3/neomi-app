import { NextResponse } from 'next/server';
import { updateOrganigramme, deleteOrganigramme } from '../../../controllers/organigrammeController';

// PUT /api/organigrammes/[id] - Mettre à jour un membre
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await updateOrganigramme(id, body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Membre non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erreur API PUT /organigrammes/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/organigrammes/[id] - Supprimer un membre
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const result = await deleteOrganigramme(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Membre non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur API DELETE /organigrammes/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
