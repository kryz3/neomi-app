import { NextResponse } from 'next/server';
import { getSecteurs, createSecteur } from '../../controllers/secteurController';
import { verifyAdminAuth, unauthorizedResponse } from '@/app/lib/auth';

// GET /api/secteurs - Récupérer tous les secteurs (PUBLIC)
export async function GET() {
  try {
    const result = await getSecteurs();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erreur API GET /secteurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/secteurs - Créer un nouveau secteur (ADMIN SEULEMENT)
export async function POST(request) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const body = await request.json();
    
    // Validation des champs requis
    const requiredFields = ['nom', 'enjeux', 'accompagnement', 'resultats', 'minicas', 'icone', 'ordre'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Champs requis manquants: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await createSecteur(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erreur API POST /secteurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
