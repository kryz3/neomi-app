import { NextResponse } from 'next/server';
import { getAvisById, updateAvis, updateAvisField, deleteAvis } from '../../../lib/avis.js';

// GET - Récupérer un avis par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getAvisById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Avis non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Erreur dans GET /api/avis/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un avis
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    
    const result = await updateAvis(id, updateData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Avis non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('Erreur dans PUT /api/avis/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un champ spécifique d'un avis
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { field, value } = body;
    
    if (!field || value === undefined) {
      return NextResponse.json(
        { error: 'Le champ et la valeur sont requis' },
        { status: 400 }
      );
    }
    
    const result = await updateAvisField(id, field, value);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Avis non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('Erreur dans PATCH /api/avis/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un avis
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteAvis(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Avis non trouvé' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erreur dans DELETE /api/avis/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
