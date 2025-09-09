import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdminAuth, unauthorizedResponse } from '../../../lib/auth.js';

// POST - Upload d'image pour article (Admin seulement)
export async function POST(request) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Aucun fichier sélectionné'
      }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: 'Type de fichier non autorisé. Seuls les fichiers JPEG, PNG et WebP sont acceptés.'
      }, { status: 400 });
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: 'Le fichier est trop volumineux. Taille maximale autorisée : 5MB'
      }, { status: 400 });
    }

    // Créer le nom de fichier unique
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `article-${timestamp}.${extension}`;

    // Définir le chemin de destination
    const uploadDir = join(process.cwd(), 'public', 'blog');
    
    // Créer le dossier s'il n'existe pas
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);

    // Retourner l'URL publique du fichier
    const fileUrl = `/blog/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        filename,
        url: fileUrl,
        size: file.size,
        type: file.type
      },
      message: 'Image uploadée avec succès'
    });

  } catch (error) {
    console.error('Erreur upload image article:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image'
    }, { status: 500 });
  }
}
