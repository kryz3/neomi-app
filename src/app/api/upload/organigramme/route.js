import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyAdminAuth, unauthorizedResponse } from '@/app/lib/auth.js';

export async function POST(request) {
  // Vérifier l'authentification admin
  const authCheck = await verifyAdminAuth(request);
  if (authCheck.error) {
    return unauthorizedResponse(authCheck.error);
  }

  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'L\'image ne doit pas dépasser 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '');
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const fileName = `${nameWithoutExt}-${timestamp}${extension}`;

    // Chemin de destination
    const uploadDir = path.join(process.cwd(), 'public', 'organigramme');
    const filePath = path.join(uploadDir, fileName);

    // Créer le dossier s'il n'existe pas
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Écrire le fichier
    await writeFile(filePath, buffer);

    // Retourner le chemin relatif pour l'utilisation dans l'app
    const relativePath = `/organigramme/${fileName}`;

    return NextResponse.json({ 
      success: true,
      filePath: relativePath,
      message: 'Photo uploadée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}
