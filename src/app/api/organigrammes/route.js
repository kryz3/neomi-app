import { NextResponse } from 'next/server';
import { getOrganigrammes, createOrganigramme } from '../../controllers/organigrammeController.js';
import { verifyAdminAuth, unauthorizedResponse } from '@/app/lib/auth.js';

// GET /api/organigrammes - Récupérer tous les membres (PUBLIC)
export async function GET() {
  try {
    const result = await getOrganigrammes();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erreur API GET /organigrammes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/organigrammes - Créer un nouveau membre (ADMIN SEULEMENT)
export async function POST(request) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const body = await request.json();
    
    // Validation des champs requis (photo devient optionnelle)
    const requiredFields = ['name', 'firstname', 'email', 'phone', 'description', 'role', 'ordre'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Champs requis manquants: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await createOrganigramme(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erreur API POST /organigrammes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
