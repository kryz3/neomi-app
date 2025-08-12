import { NextResponse } from 'next/server';
import { updateAvisField } from '../../../../../lib/avis.js';

// PATCH - Mettre à jour un champ spécifique d'un avis
export async function PATCH(request, { params }) {
  try {
    const { id, field } = await params;
    const body = await request.json();
    
    // Vérifier que la valeur est fournie
    if (!body.hasOwnProperty('value')) {
      return NextResponse.json(
        { error: 'La valeur du champ est requise dans le body de la requête' },
        { status: 400 }
      );
    }
    
    const result = await updateAvisField(id, field, body.value);
    
    if (!result.success) {
      let status = 400;
      if (result.error === 'Avis non trouvé') {
        status = 404;
      } else if (result.error.includes('n\'est pas autorisé')) {
        status = 403;
      }
      
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('Erreur dans PATCH /api/avis/[id]/field/[field]:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
