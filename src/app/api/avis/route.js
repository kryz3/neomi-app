import { NextResponse } from 'next/server';
import { getAllAvis, createAvis } from '../../lib/avis.js';
import { verifyAdminAuth, unauthorizedResponse } from '@/app/lib/auth.js';

// GET - Récupérer tous les avis (PUBLIC)
export async function GET() {
  try {
    const result = await getAllAvis();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Erreur dans GET /api/avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel avis (ADMIN SEULEMENT)
export async function POST(request) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const avisData = await request.json();
    
    // Validation basique
    if (!avisData.entreprise || !avisData.referent) {
      return NextResponse.json(
        { error: 'L\'entreprise et le référent sont requis' },
        { status: 400 }
      );
    }
    
    const result = await createAvis(avisData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur dans POST /api/avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
